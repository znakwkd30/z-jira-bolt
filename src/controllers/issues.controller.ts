import { Controller } from '@nestjs/common';
import { Event } from 'nestjs-slack-bolt';
import { SlackService } from 'nestjs-slack-bolt/dist/services/slack.service';
import { SlackEventMiddlewareArgs } from '@slack/bolt';
import {
  ConversationsRepliesResponse,
  ReactionsGetResponse,
  UsersInfoResponse,
} from '@slack/web-api';
import { Gemini, Jira } from '../utils';
import { IJiraIssueResponse } from '../interface';

@Controller()
export class IssuesController {
  private readonly gemini: Gemini;
  private readonly jira: Jira;

  constructor(private readonly slackService: SlackService) {
    this.gemini = new Gemini();
    this.jira = new Jira();
  }

  @Event('reaction_added')
  async makeJiraIssue({ event, say }: SlackEventMiddlewareArgs) {
    if (event.type !== 'reaction_added') {
      return;
    }

    if (event.reaction !== 'issues') {
      return;
    }

    const threads: ConversationsRepliesResponse =
      await this.slackService.client.conversations.replies({
        channel: event.item.channel,
        ts: event.item.ts,
      });

    const firstThread = threads.messages[0];
    if (firstThread.thread_ts && event.item.ts !== firstThread.thread_ts) {
      this.slackService.client.chat.postMessage({
        channel: event.user,
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '스레드 최상단에 이모지를 달아주세요.',
            },
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `:${event.reaction}: 이모지를 스레드 최상단에 달아주세요.`,
              },
            ],
          },
        ],
      });

      return;
    }

    const reactions: ReactionsGetResponse =
      await this.slackService.client.reactions.get({
        channel: event.item.channel,
        timestamp: event.item.ts,
      });

    let count: number = 0;
    for (const reaction of reactions.message.reactions) {
      if (reaction.name === 'issues') {
        count = reaction.count;
      }
    }

    if (count > 1) {
      this.slackService.client.chat.postMessage({
        channel: event.user,
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '이모지를 모두 지우고 다시 시도해주세요.',
            },
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `이미 이모지가 스레드에 달려있어서 지라 이슈를 생성할 수 없습니다. 이모지를 모두 지우고 다시 시도해보세요.`,
              },
            ],
          },
        ],
      });

      return;
    }

    let context: string = '';
    for (const message of threads.messages) {
      context += message.text + '\n';

      if (message?.files) {
        for (const file of message.files) {
          //TODO: 파일 업로드 추가
        }
      }
    }

    let summary: string = '';
    let description: string = '';
    try {
      await this.slackService.client.reactions.add({
        channel: event.item.channel,
        timestamp: event.item.ts,
        name: 'loading',
      });

      const result = await this.gemini.run(context);
      const parsed = JSON.parse(result);

      summary = parsed.summary;
      description = parsed.description;
    } catch (err) {
      console.log(`Gemini AI 오류 : ${err?.message}`);
    } finally {
      await this.slackService.client.reactions.remove({
        channel: event.item.channel,
        timestamp: event.item.ts,
        name: 'loading',
      });
    }

    const emojiUser: UsersInfoResponse =
      await this.slackService.client.users.info({
        user: event.user,
      });

    const reportUser: UsersInfoResponse =
      await this.slackService.client.users.info({
        user: event.item_user,
      });

    const assignee: string = await this.jira.findUser(
      emojiUser.user.profile.email,
    );
    const reporter: string = await this.jira.findUser(
      reportUser.user.profile.email,
    );

    let issue: IJiraIssueResponse;
    try {
      issue = await this.jira.createIssue({
        summary,
        description: {
          content: [
            {
              content: [
                {
                  text: description,
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
            {
              type: 'blockCard',
              attrs: {
                url: `${process.env.SLACK_URL}/${
                  event.item.channel
                }/p${event.item.ts.replace(/[.]/gi, '')}`,
              },
            },
          ],
          type: 'doc',
          version: 1,
        },
        assignee: {
          id: assignee,
        },
        reporter: {
          id: reporter,
        },
        issuetype: {
          //TODO: 현재는 작업으로만 분류
          id: `${process.env.JIRA_ISSUETYPE_ID}`,
        },
        project: {
          //TODO: 현재는 환급 프로젝트로만 처리
          id: `${process.env.JIRA_PROJECT_ID}`,
        },
      });
    } catch (err) {
      console.log(`지라 이슈 생성 중 에러: ${JSON.stringify(err.response)}`);
    }

    say({
      channel: event.item.channel,
      thread_ts: event.item.ts,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: 'Jira 이슈가 생성 되었습니다!',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `<${process.env.JIRA_HOST}/browse/${issue.key}>`,
          },
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `*내용*: ${description}`,
            },
          ],
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `*제보자*: <@${event.item_user}>`,
            },
            {
              type: 'mrkdwn',
              text: `*작업자*: <@${event.user}>`,
            },
          ],
        },
      ],
    });

    return;
  }
}

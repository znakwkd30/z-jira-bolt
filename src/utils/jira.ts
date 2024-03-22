import * as superagent from 'superagent';
import axios, { AxiosResponse } from 'axios';
import {
  IJiraFile,
  IJiraIssueRequest,
  IJiraIssueResponse,
  IJiraUser,
} from '../interface';

export class Jira {
  private readonly baseUrl: string;
  private readonly token: string;

  constructor() {
    this.baseUrl = process.env.JIRA_HOST;
    this.token = process.env.JIRA_TOKEN;
  }

  async findUser(email: string) {
    const result: AxiosResponse<IJiraUser[], any> = await axios.get(
      `${this.baseUrl}/rest/api/3/user/search?query=${email}`,
      {
        headers: {
          authorization: `Basic ${this.token}`,
        },
      },
    );

    return result.data[0].accountId;
  }

  async createIssue(issue: IJiraIssueRequest) {
    const result: AxiosResponse<IJiraIssueResponse, any> = await axios.post(
      `${this.baseUrl}/rest/api/3/issue`,
      {
        fields: issue,
      },
      {
        headers: {
          authorization: `Basic ${this.token}`,
        },
      },
    );

    return result.data;
  }

  async fileAttachments(issueIdOrKey: string, files: IJiraFile[]) {
    const request = superagent(
      'post',
      `${this.baseUrl}/rest/api/3/issue/${issueIdOrKey}/attachments`,
    );

    request.set('authorization', `Basic ${this.token}`);
    request.set('accept', 'application/json');
    request.set('content-type', 'multipart/form-data');
    request.set('X-Atlassian-Token', 'no-check');

    for (const file of files) {
      request.attach('file', file.data, {
        filename: `${file.name}`,
      });

      await request;
    }
  }
}

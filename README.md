# Z Jira Bolt
슬랙 스레드에 이모지를 달면 스레드 전체를 요약하여 Jira 티켓을 생성합니다! ([wanted-jira-bolt](https://github.com/wanteddev/wanted_jira_bolt)를 참고해서 만들었습니다.)

---

# Slack 설정
https://api.slack.com/apps

아래 항목이 모두 체크되어 있어야 합니다.

- Event Subscriptions
  - Socket Mode 를 사용합니다.
- OAuth & Permissions
  - Bot Token Scopes
    - channels:history
    - channels:read
    - chat:write
    - chat:write.customize
    - chat:write.public
    - emoji:read
    - files:read
    - links:read
    - links:write
    - reactions:read
    - reactions:write
    - users:read
    - users:read.email
  - User Token Scopes
    - reactions:read

---

# ENV
```
GEMINI_AI_KEY=
SLACK_URL=
SLACK_SIGNING_SECRET=
SLACK_BOT_TOKEN=
SLACK_APP_TOKEN=
SLACK_SOCKET_MODE=
JIRA_HOST=
JIRA_TOKEN=
JIRA_PROJECT_ID=
JIRA_ISSUETYPE_ID=
```

---

# 실행 방법

```
패키지 설치: pnpm i
로컬 실행: pnpm start:dev
```
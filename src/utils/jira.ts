import axios, { AxiosResponse } from 'axios';
import { IJiraIssueRequest, IJiraIssueResponse, IJiraUser } from '../interface';

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
}

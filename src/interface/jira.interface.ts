interface IIdObject {
  id: string;
}

interface IErrorCollection {
  errorMessages: string[];
  errors: object;
}

interface IJiraTransition {
  status: number;
  errorCollection: IErrorCollection;
}

export interface IJiraUser {
  self: string;
  accountId: string;
  accountType: string;
  emailAddress: string;
  avatarUrls: string[];
  displayName: string;
  active: boolean;
  timeZone: string;
  locale: string;
}

export interface IJiraIssueRequest {
  summary: string;
  description: object;
  assignee: IIdObject;
  reporter: IIdObject;
  issuetype: IIdObject;
  project: IIdObject;
}

export interface IJiraIssueResponse {
  id: string;
  key: string;
  self: string;
  transition: IJiraTransition;
}

export interface IJiraFile {
  name: string;
  data: any;
}

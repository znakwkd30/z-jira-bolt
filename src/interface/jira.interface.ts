interface IIdObject {
  id: string;
}

interface IPriority {
  id: string;
  name: string;
  iconUrl: string;
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
  priority: IPriority;
}

export interface IJiraIssueResponse {
  id: string;
  key: string;
  self: string;
  transition: IJiraTransition;
}

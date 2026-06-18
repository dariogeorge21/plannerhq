export interface AwarenessUser {
  name: string;
  color: string;
  avatar?: string;
  clientId?: number;
}

export interface AwarenessState {
  user: AwarenessUser;
  [key: string]: any;
}

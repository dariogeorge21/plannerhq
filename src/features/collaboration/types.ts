export interface AwarenessUser {
  name: string;
  color: string;
  avatar?: string;
  clientId?: number;
  id?: string;
}

export interface AwarenessState {
  user: AwarenessUser;
  [key: string]: any;
}

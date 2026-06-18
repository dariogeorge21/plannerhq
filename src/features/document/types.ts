export interface Section {
  id: string;
  workspace_id: string;
  name: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  section_id: string;
  workspace_id: string;
  title: string;
  position: number;
  icon: string | null;
  cover: string | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentContent {
  document_id: string;
  content: any;
  updated_at: string;
}

export type FileEntityType = 'workspace' | 'document' | 'task';

export interface FileUpload {
  id: string;
  workspace_id: string;
  entity_type: FileEntityType;
  entity_id: string;
  storage_path: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

export interface FileFilters {
  entity_type?: FileEntityType;
  entity_id?: string;
}

export interface QuotaInfo {
  maxFileUploadBytes: number;
  maxStorageBytes: number;
  currentStorageBytes: number;
}

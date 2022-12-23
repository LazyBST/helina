export interface S3ClientConfig {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
}

export enum PresignedUrlPermission {
  READ = 'READ',
  WRITE = 'WRITE',
}

export interface IPresignedUrlResponse {
  url: string | void;
}

export interface IFileUploadResponse {
  isUploaded: boolean;
  error?: string;
}

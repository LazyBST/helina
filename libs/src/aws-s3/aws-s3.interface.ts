export interface S3ClientConfig {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
}

export enum PresignedUrlPermission {
  READ = 'READ',
  WRITE = 'WRITE',
}

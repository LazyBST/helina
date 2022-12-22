export interface PresignedUrlConfig {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucket: string;
  expiry: number;
}

export enum PresignedUrlPermission {
  READ = 'READ',
  WRITE = 'WRITE',
}

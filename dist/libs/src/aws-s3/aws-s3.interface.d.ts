export interface S3ClientConfig {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
}
export declare enum PresignedUrlPermission {
    READ = "READ",
    WRITE = "WRITE"
}

export interface PresignedUrlConfig {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    bucket: string;
    expiry: number;
}
export declare enum PresignedUrlPermission {
    READ = "READ",
    WRITE = "WRITE"
}

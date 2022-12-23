/// <reference types="node" />
import { S3ClientConfig, PresignedUrlPermission, IPresignedUrlResponse, IFileUploadResponse } from './aws-s3.interface';
import { LoggerService } from '../logger';
export declare class AwsS3Service {
    private logger;
    private s3Client;
    constructor(logger: LoggerService);
    getPresignedUrl(config: S3ClientConfig, bucket: string, fileName: string, permission: PresignedUrlPermission, expiry: number): Promise<IPresignedUrlResponse>;
    uploadFile(config: S3ClientConfig, bucket: string, fileName: string, fileContent: Buffer | string | Uint8Array): Promise<IFileUploadResponse>;
}

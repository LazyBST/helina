import { S3ClientConfig, PresignedUrlPermission } from './aws-s3.interface';
import { LoggerService } from '../logger';
export declare class AwsS3Service {
    private logger;
    private config;
    private s3Client;
    constructor(logger: LoggerService, config: S3ClientConfig);
    getPresignedUrl(bucket: string, fileName: string, permission: PresignedUrlPermission, expiry: number): Promise<any>;
}

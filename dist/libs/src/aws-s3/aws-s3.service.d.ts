import { S3ClientConfig, PresignedUrlPermission } from './aws-s3.interface';
import { LoggerService } from '..';
export declare class AwsS3Service {
    private logger;
    private s3Client;
    constructor(config: S3ClientConfig, logger: LoggerService);
    getPresignedUrl(bucket: string, fileName: string, permission: PresignedUrlPermission, expiry: number): Promise<any>;
}

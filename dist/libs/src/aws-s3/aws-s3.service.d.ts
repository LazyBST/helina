import { S3ClientConfig, PresignedUrlPermission } from './aws-s3.interface';
import { LoggerService } from '../logger';
export declare class AwsS3Service {
    private logger;
    private s3Client;
    constructor(logger: LoggerService);
    getPresignedUrl(config: S3ClientConfig, bucket: string, fileName: string, permission: PresignedUrlPermission, expiry: number): Promise<any>;
}

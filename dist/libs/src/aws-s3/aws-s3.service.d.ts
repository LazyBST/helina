import { PresignedUrlConfig, PresignedUrlPermission } from './aws-s3.interface';
export declare class AwsS3Service {
    getPresignedUrl(config: PresignedUrlConfig, fileName: string, permission: PresignedUrlPermission): Promise<any>;
}

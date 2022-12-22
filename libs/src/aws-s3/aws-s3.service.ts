import { Injectable } from '@nestjs/common';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { PresignedUrlConfig, PresignedUrlPermission } from './aws-s3.interface';

@Injectable()
export class AwsS3Service {
  async getPresignedUrl(
    config: PresignedUrlConfig,
    fileName: string,
    permission: PresignedUrlPermission,
  ): Promise<any> {
    const { accessKeyId, secretAccessKey, region, bucket, expiry } = config;

    const client = new S3Client({
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      region: region,
    });

    const commandConfig = {
      Bucket: bucket,
      Key: fileName,
    };

    let command;

    if (permission === PresignedUrlPermission.READ) {
      command = new GetObjectCommand(commandConfig);
    } else if (permission === PresignedUrlPermission.WRITE) {
      command = new PutObjectCommand(commandConfig);
    }

    const url = await getSignedUrl(client, command, { expiresIn: expiry });

    return { url };
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { S3ClientConfig, PresignedUrlPermission } from './aws-s3.interface';
import { LoggerService } from '../logger';

@Injectable()
export class AwsS3Service {
  private s3Client: S3Client;

  constructor(private logger: LoggerService, random: string) {}

  async getPresignedUrl(
    config: S3ClientConfig,
    bucket: string,
    fileName: string,
    permission: PresignedUrlPermission,
    expiry: number,
  ): Promise<any> {
    if (!this.s3Client) {
      const { accessKeyId, secretAccessKey, region } = config;

      this.s3Client = new S3Client({
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
        region: region,
      });
    }

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

    const url = await getSignedUrl(this.s3Client, command, {
      expiresIn: expiry,
    }).catch((err) => {
      this.logger.error(
        `Error generating s3 presigned url for file :: ${fileName} :: ${err}`,
      );
    });

    return { url };
  }
}

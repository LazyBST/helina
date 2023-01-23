import { Inject, Injectable } from '@nestjs/common';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  GetObjectCommandInput,
} from '@aws-sdk/client-s3';
import {
  S3ClientConfig,
  PresignedUrlPermission,
  IPresignedUrlResponse,
  IFileUploadResponse,
} from './aws-s3.interface';
import { LoggerService } from '../logger';

@Injectable()
export class AwsS3Service {
  private s3Client: S3Client;

  constructor(private logger: LoggerService) {}

  async getPresignedUrl(
    config: S3ClientConfig,
    commandConfig: GetObjectCommandInput | PutObjectCommandInput,
    permission: PresignedUrlPermission,
    expiry: number,
  ): Promise<IPresignedUrlResponse> {
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

    const { Key: fileName } = commandConfig;

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

  async uploadFile(
    config: S3ClientConfig,
    bucket: string,
    fileName: string,
    fileContent: Buffer | string | Uint8Array,
  ): Promise<IFileUploadResponse> {
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
      Body: fileContent,
    };

    const command = new PutObjectCommand(commandConfig);

    try {
      await this.s3Client.send(command);
      this.logger.info(
        'File uploaded successfully with file name: ' + fileName,
      );
      return {
        isUploaded: true,
      };
    } catch (err) {
      this.logger.error(`Error Uploading File :: ${fileName} :: ${err}`);
      return {
        isUploaded: false,
        error: err,
      };
    }
  }
}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsS3Service = void 0;
const common_1 = require("@nestjs/common");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const client_s3_1 = require("@aws-sdk/client-s3");
const aws_s3_interface_1 = require("./aws-s3.interface");
const logger_1 = require("../logger");
let AwsS3Service = class AwsS3Service {
    constructor(logger, random) {
        this.logger = logger;
    }
    async getPresignedUrl(config, bucket, fileName, permission, expiry) {
        if (!this.s3Client) {
            const { accessKeyId, secretAccessKey, region } = config;
            this.s3Client = new client_s3_1.S3Client({
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
        if (permission === aws_s3_interface_1.PresignedUrlPermission.READ) {
            command = new client_s3_1.GetObjectCommand(commandConfig);
        }
        else if (permission === aws_s3_interface_1.PresignedUrlPermission.WRITE) {
            command = new client_s3_1.PutObjectCommand(commandConfig);
        }
        const url = await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, {
            expiresIn: expiry,
        }).catch((err) => {
            this.logger.error(`Error generating s3 presigned url for file :: ${fileName} :: ${err}`);
        });
        return { url };
    }
};
AwsS3Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_1.LoggerService, String])
], AwsS3Service);
exports.AwsS3Service = AwsS3Service;
//# sourceMappingURL=aws-s3.service.js.map
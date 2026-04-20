import { Injectable } from '@nestjs/common';
import {S3Client} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {}

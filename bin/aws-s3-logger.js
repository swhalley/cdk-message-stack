#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { AwsS3LoggerStack } = require('../lib/aws-s3-logger-stack');

const app = new cdk.App();
new AwsS3LoggerStack(app, 'AwsS3LoggerStack');

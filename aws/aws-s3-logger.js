#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { AwsS3LoggerStack } = require('./aws-s3-logger-stack');

const app = new cdk.App();
new AwsS3LoggerStack(app, 'AwsS3LoggerStack',{
    env: {
        region: 'ca-central-1',
        account: cdk.Aws.ACCOUNT_ID
    }
});

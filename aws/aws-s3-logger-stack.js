const path = require('path')
const cdk = require('@aws-cdk/core');
const lambda = require('@aws-cdk/aws-lambda')
const s3 = require('@aws-cdk/aws-s3')
const sqs = require('@aws-cdk/aws-sqs')
const eventSources = require('@aws-cdk/aws-lambda-event-sources')

class AwsS3LoggerStack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const messageQueue = new sqs.Queue(this, 'messageQueue')
    const s3Bucket = new s3.Bucket(this, 'messageBucket')

    const messageGenerator = new lambda.Function(this, 'messageGenerator', {
      name: 'Message Geneator',
      description: 'Generate messages to send to SQS',
      code: lambda.Code.asset(path.join(__dirname, '../src/lambda')),
      handler: 'generator.handler',
      runtime: lambda.Runtime.NODEJS_12_X,
      environment: {
        QueueUrl: messageQueue.QueueUrl
      }
    })

    const messageConsumer = new lambda.Function(this, 'messageConsumer', {
      name: 'Message Consumer',
      description: 'Consumes messages from SQS and sends to S3',
      code: lambda.Code.asset(path.join(__dirname, '../src/lambda')),
      handler: 'consumer.handler',
      runtime: lambda.Runtime.NODEJS_12_X,
      environment: {
        QueueUrl: messageQueue.QueueUrl,
        S3BucketURL: s3Bucket.
      }
    })


    messageConsumer.addEventSource(new eventSources.SqsEventSource(messageQueue))
    messageQueue.grantSendMessages(messageGenerator)
    messageQueue.grantConsumeMessages( messageConsumer)
    
    //https://docs.aws.amazon.com/AmazonS3/latest/dev/using-with-s3-actions.html
    s3Bucket.grant(messageConsumer, 's3:PutObject')
    
  }
}

module.exports = { AwsS3LoggerStack }

const AWS = require('aws-sdk')
const randomWords = require('random-words')
const moment = require('moment-timezone')

module.exports.handler = async (event, context) => {
    let sqs = new AWS.SQS({ apiVersion: '2012-11-05' })

    for (let i = 0; i < 500; i++) {
        sqs.sendMessage(buildMessage(),(error, response)=>{
            if(error)
                break
            console.log( `sent message ${response.MessageId}`)
        })
    }
}

const buildMessage = () => {
    let params = {
        MessageAttributes: {
            "Date": {
                DataType: "String",
                StringValue: moment.tz('America/Halifax').format()
            },
            "Author": {
                DataType: "String",
                StringValue: randomWords(2).join(', ')
            }
        },
        MessageBody:  randomWords(10).join(' '),
        QueueUrl: process.env.QueueUrl,
    }

    return params
}
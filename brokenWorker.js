import {   ReceiveMessageCommand, DeleteMessageCommand, DeleteMessageBatchCommand, SQSClient } from "@aws-sdk/client-sqs";

const client = new SQSClient({});
const SQS_QUEUE_URL = "MsgQueue";

const receiveMessage = (queueUrl) =>
    client.send(
        new ReceiveMessageCommand({
            AttributeNames: ["SentTimestamp"],
            MaxNumberOfMessages: 10,
            MessageAttributeNames: ["All"],
            QueueUrl: queueUrl,
            VisibilityTimeout: 20,
        })
    );

const main = async(queueUrl) => {
    const { Messages } = await receiveMessage(queueUrl);

    if (!Messages) {
        console.log('No New messages');
        return;
    }

    console.log(Messages);
}

main(SQS_QUEUE_URL);
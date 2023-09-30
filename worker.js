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
        return;
    }

    if (Messages.length === 1) {
        console.log(Messages[0].Body);
        await client.send(
            new DeleteMessageCommand({
                QueueUrl: queueUrl,
                ReceiptHandle: Messages[0].ReceiptHandle,
            })
        );

        return;
    }
    await client.send(
        new DeleteMessageBatchCommand({
            QueueUrl: queueUrl,
            Entries: Messages.map((message) => ({
                Id: message.MessageId,
                ReceiptHandle: message.ReceiptHandle,
            })),
        })
    );
}

main(SQS_QUEUE_URL);
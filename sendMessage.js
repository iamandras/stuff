import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { randomBytes } from 'crypto';

const client = new SQSClient({});
const SQS_QUEUE_URL = "MsgQueue";

export const main = async (sqsQueueUrl = SQS_QUEUE_URL) => {
    const talentId = randomBytes(20).toString('hex');
    const data = {
        talentId: talentId,
        eventType: 'delete'
    };

    const command = new SendMessageCommand({
        QueueUrl: sqsQueueUrl,
        DelaySeconds: 0,
        MessageBody: JSON.stringify(data),
    });

    const response = await client.send(command);
    console.log(response);
    return response;
};

main();
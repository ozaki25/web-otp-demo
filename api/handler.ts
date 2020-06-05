import { SNS } from 'aws-sdk';
import { APIGatewayProxyHandler, CustomAuthorizerHandler } from 'aws-lambda';
import 'source-map-support/register';

type bodyType = {
  message?: string;
  phoneNumber?: string;
};

const { AUTH_KEY } = process.env;

const sns = new SNS();

export const sendSMS: APIGatewayProxyHandler = async event => {
  const { body } = event;
  if (!body) return { statusCode: 500, body: 'body is empty' };
  const { message, phoneNumber }: bodyType = JSON.parse(body);
  console.log({ message, phoneNumber });
  if (!message || !phoneNumber) {
    return {
      statusCode: 500,
      body: `invalid params. message: ${message}, phoneNumber: ${phoneNumber}`,
    };
  }

  try {
    const params: SNS.Types.PublishInput = {
      Message: message,
      PhoneNumber: `+81${phoneNumber.slice(1)}`,
    };
    await sns.publish(params).promise();
    console.log('success');
    return {
      statusCode: 200,
      body: 'success',
    };
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      body: JSON.stringify(e),
    };
  }
};

export const auth: CustomAuthorizerHandler = (event, context) => {
  const { authorizationToken } = event;
  console.log({ authorizationToken, AUTH_KEY });
  if (authorizationToken === AUTH_KEY) {
    const policy = {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: event.methodArn,
          },
        ],
      },
    };
    context.succeed(policy);
  } else {
    context.fail('Unauthorized');
  }
};

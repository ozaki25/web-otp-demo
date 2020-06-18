import { SNS } from 'aws-sdk';
import { APIGatewayProxyHandler, CustomAuthorizerHandler } from 'aws-lambda';
import 'source-map-support/register';

type bodyType = {
  id?: string;
  phoneNumber?: string;
};

const { AUTH_KEY } = process.env;

const sns = new SNS();

const responseHeders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': '*',
};

export const sendSMS: APIGatewayProxyHandler = async event => {
  const { body } = event;
  if (!body) {
    return {
      statusCode: 500,
      headers: responseHeders,
      body: JSON.stringify({ error: 'body is empty' }),
    };
  }

  const { id, phoneNumber }: bodyType = JSON.parse(body);
  const otp = generateOtp();
  console.log({ id, phoneNumber, otp });
  if (!id || !phoneNumber) {
    return {
      statusCode: 500,
      headers: responseHeders,
      body: JSON.stringify({
        error: `invalid params. id: ${id}, phoneNumber: ${phoneNumber}`,
      }),
    };
  }

  try {
    const params: SNS.Types.PublishInput = {
      Message: otp,
      PhoneNumber: `+81${phoneNumber.slice(1)}`,
    };
    await sns.publish(params).promise();
    console.log('success');
    return {
      statusCode: 200,
      headers: responseHeders,
      body: JSON.stringify({ message: 'success' }),
    };
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      headers: responseHeders,
      body: JSON.stringify({ error: JSON.stringify(e) }),
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

const generateOtp = () => String(Math.floor(Math.random() * 1000000));

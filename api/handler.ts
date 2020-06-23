import { DynamoDB, SNS } from 'aws-sdk';
import { APIGatewayProxyHandler, CustomAuthorizerHandler } from 'aws-lambda';
import 'source-map-support/register';

type sendBodyType = {
  id?: string;
  phoneNumber?: string;
};

type authBodyType = {
  id?: string;
  otp?: string;
};

const { AUTH_KEY, OTP_TABLE, DOMAIN } = process.env;

const sns = new SNS();

const dynamo = new DynamoDB.DocumentClient();

const responseHeders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': '*',
};

export const send: APIGatewayProxyHandler = async event => {
  const { body } = event;
  if (!body) {
    return {
      statusCode: 400,
      headers: responseHeders,
      body: JSON.stringify({ error: 'body is empty' }),
    };
  }

  const { id, phoneNumber }: sendBodyType = JSON.parse(body);
  const otp = generateOtp();
  console.log({ id, phoneNumber, otp });
  if (!id || !phoneNumber) {
    return {
      statusCode: 400,
      headers: responseHeders,
      body: JSON.stringify({
        error: `invalid params. id: ${id}, phoneNumber: ${phoneNumber}`,
      }),
    };
  }

  try {
    await putItem({ id, otp, timestamp: Date.now() });
    await publish({
      message: `Your OTP is ${otp}
@${DOMAIN} #${otp}`,
      phoneNumber: phoneNumber.replace(/^0*/, '+81'),
    });
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

export const auth: APIGatewayProxyHandler = async event => {
  const { body } = event;
  if (!body) {
    return {
      statusCode: 400,
      headers: responseHeders,
      body: JSON.stringify({ error: 'body is empty' }),
    };
  }

  const { id, otp }: authBodyType = JSON.parse(body);
  console.log({ id, otp });
  if (!id || !otp) {
    return {
      statusCode: 400,
      headers: responseHeders,
      body: JSON.stringify({
        error: `invalid params. id: ${id}, otp: ${otp}`,
      }),
    };
  }

  try {
    const { Item } = await getItem({ id });
    console.log({ Item });
    if (!Item || !valid(Item.timestamp)) {
      return {
        statusCode: 400,
        headers: responseHeders,
        body: JSON.stringify({
          error: JSON.stringify('this otp has expired or is invalid'),
        }),
      };
    }
    const result = otp === Item.otp ? 'ok' : 'ng';
    return {
      statusCode: 200,
      headers: responseHeders,
      body: JSON.stringify({ result }),
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

export const customauth: CustomAuthorizerHandler = (event, context) => {
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

const generateOtp = () => `${String(Math.floor(Math.random() * 1000000))}`;

const putItem = (props: { id: string; otp: string; timestamp: number }) => {
  const params: DynamoDB.DocumentClient.PutItemInput = {
    TableName: OTP_TABLE || '',
    Item: props,
  };
  return dynamo.put(params).promise();
};

const getItem = (props: { id: string }) => {
  const params: DynamoDB.DocumentClient.GetItemInput = {
    TableName: OTP_TABLE || '',
    Key: props,
  };
  return dynamo.get(params).promise();
};

const publish = (props: { message: string; phoneNumber: string }) => {
  const params: SNS.Types.PublishInput = {
    Message: props.message,
    PhoneNumber: props.phoneNumber,
  };
  return sns.publish(params).promise();
};

const valid = (timestamp: number) => {
  // 有効期限は3分
  const now = Date.now();
  const expired = 1000 * 60 * 3;
  const result = now - timestamp < expired;
  console.log({ now, timestamp, expired, result });
  return result;
};

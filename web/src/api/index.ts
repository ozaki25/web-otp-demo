const { REACT_APP_API_URL, REACT_APP_AUTH_KEY } = process.env;

export type postPhoneNumberProps = {
  phoneNumber: string;
  id: string;
};

export const postPhoneNumber = async (body: postPhoneNumberProps) => {
  const res = await fetch(`${REACT_APP_API_URL}/send`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: REACT_APP_AUTH_KEY || '',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

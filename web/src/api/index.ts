const { API_URL, AUTH_KEY } = process.env;

export type postPhoneNumberProps = {
  phoneNumber: string;
  id: string;
};

export const postPhoneNumber = async (body: postPhoneNumberProps) => {
  const res = await fetch(`${API_URL}/phonenumber`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: AUTH_KEY || '',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

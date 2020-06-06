const { API_URL } = process.env;

export type postPhoneNumberProps = {
  phoneNumber: string;
  id: string;
};

export const postPhoneNumber = async (body: postPhoneNumberProps) => {
  const res = await fetch(`${API_URL}/phonenumber`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

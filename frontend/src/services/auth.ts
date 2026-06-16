import api from "../lib/api";

export async function login(
  email: string,
  password: string
) {
  const response = await api.post(
    "/auth/login",
    {
      email,
      password,
    }
  );

  const data = response.data;

  localStorage.setItem(
    "accessToken",
    data.token
  );

  localStorage.setItem(
    "role",
    data.role
  )

  return data;
}
import { sql } from './connect';

export type User = {
  id: number;
  username: string;
  passwordHash: string;
  name: string;
  email: string;
  phoneNumber: number | null;
};

export async function getUserByUsername(username: string) {
  if (!username) return undefined;

  const [user] = await sql<
    {
      username: string;
      name: string;
      email: string;
      phoneNumber: number | null;
    }[]
  >`
  SELECT
    username,
    name,
    email,
    phone_number
  FROM
    users
  WHERE
    users.username = ${username}
  `;

  return user;
}

export async function getUserWithPasswordHashByUsername(username: string) {
  if (!username) return undefined;

  const [user] = await sql<User[]>`
  SELECT
    *
  FROM
    users
  WHERE
    users.username = ${username}
  `;

  return user;
}

export async function getUserBySessionToken(token: string) {
  if (!token) return undefined;

  const [user] = await sql<{ id: number; username: string }[]>`
  SELECT
    users.id,
    users.username
  FROM
    users,
    sessions
  WHERE
    sessions.token = ${token} AND
    sessions.user_id = users.id AND
    sessions.expiry_timestamp > now();
  `;

  return user;
}

export async function createUser(
  username: string,
  password_hash: string,
  name: string,
  email: string,
  phone_number: number,
) {
  const [userWithoutPassword] = await sql<
    {
      id: number;
      username: string;
      name: string;
      email: string;
      phoneNumber: number | null;
    }[]
  >`
  INSERT INTO users
    (username, password_hash, name, email, phone_number)
  VALUES
    (${username}, ${password_hash}, ${name}, ${email}, ${phone_number})
  RETURNING
    id,
    username,
    name,
    email,
    phone_number
  `;

  return userWithoutPassword!;
}

import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  deleteUserByUsername,
  getUserBySessionToken,
  updateUserByUsername,
} from '../../../database/users';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'GET') {
    // 1. Get the cookie from the request
    const token = request.cookies.sessionToken;

    if (!token) {
      response
        .status(400)
        .json({ errors: [{ message: 'No session token passed' }] });
      return;
    }

    // 2. Get the user from the token
    const user = await getUserBySessionToken(token);

    if (!user) {
      response
        .status(400)
        .json({ errors: [{ message: 'Session token not valid' }] });
      return;
    }

    // return the user from the session token
    return response.status(200).json({ user: user });
  }

  if (request.method === 'PUT') {
    const passwordHash = await bcrypt.hash(request.body?.password, 12);

    const username = request.body?.username;
    const password = passwordHash;
    const name = request.body?.name;
    const email = request.body?.email;
    const phoneNumber = request.body?.phoneNumber || null;

    if (!(username && password && name && email)) {
      return response.status(400).json({ message: 'property is missing' });
    }

    const newUser = await updateUserByUsername(
      username,
      password,
      name,
      email,
      phoneNumber,
    );

    return response.status(200).json(newUser);
  }

  if (request.method === 'DELETE') {
    const username = request.body?.username;
    const deletedUser = await deleteUserByUsername(username);
    return response.status(200).json(deletedUser);
  } else {
    response.status(405).json({ errors: [{ message: 'method not allowed' }] });
  }
}

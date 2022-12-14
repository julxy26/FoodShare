// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { createSession } from '../../database/sessions';
import {
  createUser,
  getUserByEmail,
  getUserByUsername,
} from '../../database/users';
import { createSerializedRegisterSessionTokenCookie } from '../../utils/cookies';

export type RegisterResponseBody =
  | { errors: { message: string }[] }
  | { user: { username: string } };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<RegisterResponseBody>,
) {
  if (request.method === 'POST') {
    // 1. make sure the data exist
    if (
      typeof request.body.username !== 'string' ||
      typeof request.body.password !== 'string' ||
      typeof request.body.name !== 'string' ||
      typeof request.body.email !== 'string' ||
      !request.body.username ||
      !request.body.password ||
      !request.body.name ||
      !request.body.email
    ) {
      return response
        .status(400)
        .json({ errors: [{ message: 'Required fields must be filled out' }] });
    }
    // 2.we check if the user already exist
    const userUsername = await getUserByUsername(request.body.username);
    const userEmail = await getUserByEmail(request.body.email);
    if (userUsername) {
      return response
        .status(401)
        .json({ errors: [{ message: 'Username is already taken' }] });
    }
    if (userEmail) {
      return response
        .status(401)
        .json({ errors: [{ message: 'Email already exists' }] });
    }

    // 3. we hash the password
    const passwordHash = await bcrypt.hash(request.body.password, 12);

    // 4. sql query to create the record
    const userWithoutPassword = await createUser(
      request.body.username,
      passwordHash,
      request.body.name,
      request.body.email,
      request.body.phoneNumber || null,
    );

    // 4.Create a session token and serialize a cookie with the token
    const session = await createSession(
      userWithoutPassword.id,
      crypto.randomBytes(80).toString('base64'),
    );

    const serializedCookie = createSerializedRegisterSessionTokenCookie(
      session.token,
    );

    response
      .status(200)
      .setHeader('Set-Cookie', serializedCookie)
      .json({ user: { username: userWithoutPassword.username } });
  } else {
    response.status(401).json({ errors: [{ message: 'Method not allowed' }] });
  }
}

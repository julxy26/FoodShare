import { NextApiRequest, NextApiResponse } from 'next';
import {
  createEvent,
  getAllEvents,
  getEventsByUserId,
} from '../../../database/events';
import { getUserBySessionToken } from '../../../database/users';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'GET') {
    const token = request.cookies.sessionToken;
    const user = token && (await getUserBySessionToken(token));

    if (user) {
      const events = await getAllEvents();

      if (typeof events === 'undefined') {
        return response
          .status(400)
          .json({ errors: [{ message: 'No events found' }] });
      }
      return response.status(200).json({ events: events });
    }
  }

  if (request.method === 'POST') {
    const token = request.cookies.sessionToken;
    const user = token && (await getUserBySessionToken(token));

    if (user) {
      const userId = user.id;
      await getEventsByUserId(userId);
    }

    if (user) {
      const userId = user.id;
      const title = request.body?.title;
      const street = request.body?.street;
      const district = request.body?.district;
      const date = request.body?.date;
      const time = request.body?.time;

      // 1. make sure the data exist
      if (
        typeof title !== 'string' ||
        typeof street !== 'string' ||
        typeof district !== 'number' ||
        !title ||
        !street ||
        !district ||
        !date ||
        !time
      ) {
        return response.status(400).json({
          errors: [{ message: 'Required fields must be filled out' }],
        });
      }

      const [event] = await createEvent(
        title,
        street,
        district,
        date,
        time,
        userId,
      );

      // 4. sql query to create the record

      return response.status(200).json({ event });
    }
    return response
      .status(405)
      .json({ errors: [{ message: 'User not found' }] });
  } else {
    response.status(405).json({ errors: [{ message: 'Method not allowed' }] });
  }
}

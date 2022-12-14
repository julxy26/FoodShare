import { NextApiRequest, NextApiResponse } from 'next';
import { createAttendee } from '../../../database/attendees';
import { deleteEventByEventId, getEventById } from '../../../database/events';
import { getValidSessionByToken } from '../../../database/sessions';
import { getUserBySessionToken } from '../../../database/users';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const session =
    request.cookies.sessionToken &&
    (await getValidSessionByToken(request.cookies.sessionToken));

  if (!session) {
    response
      .status(400)
      .json({ errors: [{ message: 'No valid session token passed' }] });
    return;
  }

  const eventIdFromUrl = Number(request.query.eventId);

  if (!eventIdFromUrl) {
    return response.status(404).json({ message: 'Not a valid Id' });
  }

  if (request.method === 'GET') {
    const event = await getEventById(eventIdFromUrl);

    if (!event) {
      return response.status(404).json({ message: 'Not a valid Id!' });
    }

    return response.status(200).json(event);
  }

  if (request.method === 'PUT') {
    const eventId = eventIdFromUrl;
    const token = request.cookies.sessionToken;
    const user = token && (await getUserBySessionToken(token));
    const attendees = [];

    if (user) {
      const userId = user.id;
      const newAttendee = attendees.push(await createAttendee(eventId, userId));

      return response.status(200).json({ newAttendee });
    }

    if (!eventId) return response.status(400).json({ message: 'no valid Id' });
  }

  if (request.method === 'DELETE') {
    const deletedEvent = await deleteEventByEventId(eventIdFromUrl);

    if (!deletedEvent) {
      return response.status(404).json({ message: 'Not a valid Id' });
    }

    return response.status(200).json(deletedEvent);
  }

  return response.status(400).json({ message: 'Method not allowed' });
}

import { sql } from './connect';
import { User } from './users';

export async function createAttendee(eventId: number, userId: User['id']) {
  const event = await sql<{ id: number; eventId: number; userId: number }[]>`
    INSERT INTO attendees
      (event_id, user_id)
    VALUES
      (${eventId}, ${userId})
    RETURNING
      *
  `;
  return event;
}

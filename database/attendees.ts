import { sql } from './connect';
import { User } from './users';

export async function updateAttendeeById(eventId: number, userId: User['id']) {
  const attendee = await sql<
    { id: number; eventId: number; userId: number | null }[]
  >`
    UPDATE
      attendees
    SET
      user_id = ${userId}
    WHERE
      event_id = ${eventId}
    RETURNING
      *
  `;
  return attendee;
}

export async function createAttendee(eventId: number, userId: User['id']) {
  const attendee = await sql<
    { id: number; eventId: number; userId: number | null }[]
  >`
    INSERT INTO attendees
      (event_id, user_id)
    VALUES
      (${eventId}, ${userId})
    RETURNING
      *
  `;
  return attendee;
}

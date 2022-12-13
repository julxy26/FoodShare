/* eslint-disable @ts-safeql/check-sql */
import { sql } from './connect';
import { User } from './users';

export type Event = {
  id: number;
  title: string;
  street: string;
  district: number;
  date: Date;
  time: Date;
  userId: number;
}[];

export async function getAttendingEvents(attUserId: number) {
  const events = await sql<
    {
      id: number;
      title: string;
      street: string;
      district: number;
      userId: number;
      date: Date;
      time: Date;
    }[]
  >`
SELECT
  events.id,
  title,
  street,
  district,
  user_id,
  TO_CHAR(date, 'DAY DD.MM.YYYY') date,
  TO_CHAR(time, 'HH12:MI AM') time
FROM
  events
ORDER BY
  events.date ASC
`;

  const rawAttendees = events.map((event) => {
    return sql<{ userId: number }[]>`
  SELECT user_id
  FROM attendees
  WHERE event_id = ${event.id}
  `;
  });

  const userIds = await Promise.all(rawAttendees);

  const fullEvents = events.map((event, index) => {
    return {
      ...event,
      userIds: userIds[index]?.map((obj) => obj.userId),
    };
  });

  if (!fullEvents[0]) return undefined;

  const foundFullEvents = fullEvents.filter((event) =>
    event.userIds?.find((id) => id === attUserId),
  );

  return foundFullEvents;
}

export async function deleteEventByEventId(eventId: number) {
  const [event] = await sql<Event[]>`
    DELETE FROM
      events
    WHERE
      id = ${eventId}
    RETURNING
      *
  `;
  return event;
}

export async function getEventById(eventId: number) {
  const [event] = await sql<
    {
      id: number;
      title: string;
      street: string;
      district: number;
      date: Date;
      time: Date;
      userId: number;
    }[]
  >`
  SELECT
    events.id,
    title,
    street,
    district,
    TO_CHAR(date, 'DAY DD.MM.YYYY') date,
    TO_CHAR(time, 'HH12:MI AM') time
  FROM
    events
  WHERE
    ${eventId} = events.id
  `;

  const rawAttendees = await sql<{ userId: number }[]>`
  SELECT
   user_id
  FROM
   attendees
  WHERE
   event_id = ${event!.id}
  `;

  if (!event) return undefined;

  const userIds = await Promise.all(rawAttendees as { userId: number }[]);

  const fullEvent = {
    ...event,
    userIds: userIds.map((obj) => obj.userId),
  };

  return fullEvent;
}

export async function getEventsByUserId(userId: User['id']) {
  const events = await sql<
    {
      id: number;
      title: string;
      street: string;
      district: number;
      userId: number;
      date: Date;
      time: Date;
    }[]
  >`
  SELECT
    events.id,
    title,
    street,
    district,
    TO_CHAR(date, 'DAY DD.MM.YYYY') date,
    TO_CHAR(time, 'HH12:MI AM') time
  FROM
    events
  INNER JOIN
    users ON ${userId} = users.id
  WHERE
    ${userId} = users.id
  AND
    ${userId} = events.user_id
  ORDER BY
    events.date ASC
  `;

  if (!events.length) return undefined;

  // loop over each post and get an array of promises with the urls for each post
  const rawAttendees = events.map((event) => {
    return sql<{ userId: number }[]>`
  SELECT user_id
  FROM attendees
  WHERE  event_id = ${event.id}
`;
  });

  // await until all the promises resolve
  const userIds = await Promise.all(rawAttendees);

  // loop over the posts and add the array of images that correspond to them matching by index
  const fullEvents = events.map((event, index) => {
    return {
      ...event,
      userId: userIds[index]?.map((obj) => obj.userId),
    };
  });
  return fullEvents;
}

export async function getAllEvents() {
  const events = await sql<
    {
      id: number;
      title: string;
      street: string;
      district: number;
      userId: number;
      date: Date;
      time: Date;
    }[]
  >`
  SELECT
    events.id,
    title,
    street,
    district,
    user_id,
    TO_CHAR(date, 'DAY DD.MM.YYYY') date,
    TO_CHAR(time, 'HH12:MI AM') time
  FROM
    events
  ORDER BY
    events.date ASC
  `;

  const rawAttendees = events.map((event) => {
    return sql<{ userId: number }[]>`
    SELECT user_id
    FROM attendees
    WHERE event_id = ${event.id}
    `;
  });

  const userIds = await Promise.all(rawAttendees);

  const fullEvents = events.map((event, index) => {
    return {
      ...event,
      userIds: userIds[index]?.map((obj) => obj.userId),
    };
  });

  if (!fullEvents[0]) return undefined;

  return fullEvents;
}

export async function createEvent(
  title: string,
  street: string,
  district: number,
  date: Date,
  time: Date,
  userId: User['id'],
) {
  const event = await sql<Event[]>`
  INSERT INTO events
    (title, street, district, date, time, user_id)
  VALUES
    (${title}, ${street}, ${district}, ${date}, ${time}, ${userId})
  RETURNING
    *
  `;
  return event;
}

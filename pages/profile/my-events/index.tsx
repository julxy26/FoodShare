import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { SlideInFromLeft } from '../../../components/Animations/SlideInFromLeft';
import HeaderWithSession from '../../../components/HeaderWithSession';
import {
  getAttendingEvents,
  getEventsByUserId,
} from '../../../database/events';
import { getUserBySessionToken, User } from '../../../database/users';

const mainContainer = css`
  width: 100vw;
  margin-top: 30px;
  padding-bottom: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h2 {
    margin-bottom: 10px;
  }
`;

const imageContainer = css`
  height: 180px;
  width: 100vw;
  background-image: url('/dinner-table.jpg');
  background-position: 50% 60%;
  background-repeat: no-repeat;
  border: 1px solid lightgrey;
`;

const addEventDiv = css`
  width: 50px;
  height: 50px;
  background-color: #c07e6e;
  color: #fff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  border: none;
  font-weight: 700;
  background-image: url('/add.png');
  background-repeat: no-repeat;
  background-size: 35px;
  background-position: center;
  transition: 0.3s ease-in-out;

  &:active {
    background-color: #e4b19b;
  }
`;

const textContainer = css`
  margin-top: -10px;
  width: 100vw;

  h3,
  p {
    text-align: center;
  }
`;

const buttonContainer = css`
  display: flex;
  justify-content: center;

  button {
    width: 130px;
    height: 38px;
    color: #3d3535;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 30px;
    border: 1px solid #588777;
    background-color: #fff;
    font-weight: 700;
    font-size: 19px;
    line-height: 20px;
    transition: 0.3s ease-in-out;
    margin-bottom: 40px;

    &:active {
      background-color: #588777;
      color: #fff;
    }
  }
`;
type Props = {
  events?: {
    id: number;
    title: string;
    street: string;
    district: number;
    date: string;
    time: string;
    userId: User['id'];
  }[];

  attendingEvents?: {
    id: number;
    title: string;
    street: string;
    district: number;
    date: string;
    time: string;
    userId: User['id'];
  }[];
};

export default function MyEvents(props: Props) {
  const [eventId, setEventId] = useState<number>();
  const router = useRouter();

  const deleteEventHandler = useCallback(async () => {
    if (!eventId) return;

    const response = await fetch(`/api/events/${eventId}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        eventId: eventId,
      }),
    });

    const deletedEvent = (await response.json()) as Event;
    return deletedEvent;
  }, [eventId]);

  useEffect(() => {
    deleteEventHandler().catch((err) => {
      console.log(err);
    });
  }, [eventId, deleteEventHandler]);

  return (
    <div>
      <HeaderWithSession />
      <SlideInFromLeft>
        <Head>
          <title>FoodShare events</title>
          <meta name="description" content="Welcome to FoodShare" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main css={mainContainer}>
          <h2>Upcoming Events</h2>
          {props.attendingEvents &&
            props.attendingEvents.map((event) => {
              return (
                <div key={`attend-${event.id}`}>
                  <div css={imageContainer} />
                  <div css={textContainer}>
                    <h3>{event.title}</h3>
                    <p>
                      {event.street}, {event.district} Vienna
                    </p>
                    <p>
                      {event.date}, TIME {event.time}
                    </p>
                  </div>
                  <div css={buttonContainer}>
                    <button
                      value={event.id}
                      onClick={(e) => {
                        setEventId(Number(e.currentTarget.value));
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            })}

          <h2>My Events</h2>
          {!props.events ? (
            <div>
              <p>There are no events yet</p>
            </div>
          ) : (
            props.events.map((event) => {
              return (
                <div key={`event-${event.id}`}>
                  <div css={textContainer}>
                    <h3>{event.title}</h3>
                    <p>
                      {event.street}, {event.district} Vienna
                    </p>
                    <p>
                      {event.date}, TIME {event.time}
                    </p>
                  </div>
                  <div css={buttonContainer}>
                    <button
                      value={eventId}
                      onClick={async () => {
                        setEventId(event.id);
                        await router.push('/profile/my-events');
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}

          <Link href="/profile/my-events/add-event">
            <div css={addEventDiv} />
          </Link>
        </main>
      </SlideInFromLeft>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.sessionToken;

  const user = token && (await getUserBySessionToken(token));

  if (!user) {
    return {
      redirect: {
        destination: '/signIn?returnTo=/profile/my-events',
        permanent: false,
      },
    };
  }

  const rawEvents = await getEventsByUserId(user.id);

  const events = rawEvents && JSON.parse(JSON.stringify(rawEvents));

  const attendingEvents = await getAttendingEvents(user.id);

  return {
    props: {
      events: events || null,
      attendingEvents: attendingEvents || null,
    },
  };
}

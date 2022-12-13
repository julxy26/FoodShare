import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import { SlideInFromLeft } from '../components/Animations/SlideInFromLeft';
import HeaderWithSession from '../components/HeaderWithSession';
import { getAllEvents } from '../database/events';
import { getUserBySessionToken, User } from '../database/users';

const mainContainer = css`
  margin-top: 50px;
  padding-bottom: 100px;

  h2 {
    text-align: center;
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

const textContainer = css`
  margin-top: -10px;
  text-align: center;
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

    &:focus {
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
    attendingUserId: number | null[];
  }[];

  user: {
    id: number;
  };
};

export default function Events(props: Props) {
  const [eventId, setEventId] = useState<number>();
  const [attendees, setAttendees] = useState<number>();

  const updateAttendEvent = useCallback(async () => {
    if (!eventId) return;

    const response = await fetch(`/api/events/${eventId}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        eventId: eventId,
        userIds: attendees,
      }),
    });

    const updatedEventFromApi = (await response.json()) as Event;
    return updatedEventFromApi;
  }, [attendees, eventId]);

  useEffect(() => {
    updateAttendEvent().catch((err) => {
      console.log(err);
    });
  }, [eventId, updateAttendEvent]);

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
          <h2>Events</h2>
          {!props.events ? (
            <div>
              <p>There are no events yet</p>
            </div>
          ) : (
            props.events.map((event) => {
              return (
                <div key={`events-${event.id}`}>
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
                      value={eventId}
                      onClick={() => {
                        setEventId(event.id);
                        setAttendees(props.user.id);
                      }}
                    >
                      Attend
                    </button>
                  </div>
                </div>
              );
            })
          )}
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
        destination: '/signIn?returnTo=/events',
        permanent: false,
      },
    };
  }

  const rawEvents = await getAllEvents();

  const events = rawEvents && JSON.parse(JSON.stringify(rawEvents));

  return {
    props: {
      events: events || null,
      user: user,
    },
  };
}

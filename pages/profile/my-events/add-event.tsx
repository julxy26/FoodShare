import { css } from '@emotion/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Transition } from '../../../components/Animations/Transition';
import HeaderWithSession from '../../../components/HeaderWithSession';

const mainStyles = css`
  margin-top: 130px;
  padding-bottom: 120px;
  display: flex;
  flex-direction: column;

  align-items: center;
  height: 90vh;

  input {
    width: 100%;
    border: none;
    border-radius: 30px;
    line-height: 21px;
    text-align: center;
    margin-bottom: 10px;
    color: #3d3535;
    outline: none;
    background: none;
    height: 33px;
    border: 1px solid #bcbcbc;
    transition: 0.3s ease-in-out;

    &:focus,
    &:active {
      outline: none;
    }
  }
`;

const messageContainer = css`
  display: flex;
  justify-content: center;
  color: #c07e6e;
  position: relative;
  padding-bottom: 10px;

  p {
    text-align: center;
    width: 100vw;
    position: absolute;
    top: -10px;
  }
`;

const buttonContainer = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
`;

const addButton = css`
  width: 160px;
  height: 38px;
  background-color: #c07e6e;
  padding-left: 20px;
  color: #fff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 30px;
  border: none;
  font-weight: 700;
  font-size: 18px;
  line-height: 20px;
  background-image: url('/add.png');
  background-repeat: no-repeat;
  background-size: 24px;
  background-position-y: center;
  background-position-x: 5px;
  transition: 0.3s ease-in-out;

  &:active {
    background-color: #e4b19b;
  }
`;

export type AddPostResponseBody =
  | { errors: { message: string }[] }
  | { user: { username: string } };

export default function AddEvent() {
  const [title, setTitle] = useState<string>('');
  const [street, setStreet] = useState<string>('');
  const [district, setDistrict] = useState<number>();
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const router = useRouter();

  async function addEventHandler() {
    const response = await fetch('/api/events', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
        street: street,
        district: district,
        date: date,
        time: time,
      }),
    });

    const addEventResponseBody = (await response.json()) as AddPostResponseBody;

    if ('errors' in addEventResponseBody) {
      setErrors(addEventResponseBody.errors);
      return console.log(addEventResponseBody.errors);
    }

    await router.push(`/profile/my-events`);
    return addEventResponseBody;
  }

  return (
    <>
      <HeaderWithSession />

      <Transition>
        <Head>
          <title>Add new Event</title>
          <meta name="description" content="Add new Event" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main css={mainStyles}>
          <form onSubmit={(event) => event.preventDefault()}>
            <div>
              <label htmlFor="title">
                Title
                <input
                  name="title"
                  autoComplete="false"
                  value={title}
                  onChange={(event) => {
                    setTitle(event.currentTarget.value);
                    setErrors([]);
                  }}
                />
              </label>
            </div>

            <div>
              <label htmlFor="street">
                Street
                <input
                  name="street"
                  autoComplete="off"
                  value={street}
                  onChange={(event) => {
                    setStreet(event.currentTarget.value);
                    setErrors([]);
                  }}
                />
              </label>
            </div>

            <div>
              <label htmlFor="district">
                District
                <input
                  value={district}
                  autoComplete="off"
                  name="district"
                  type="number"
                  onChange={(event) => {
                    setDistrict(parseInt(event.currentTarget.value));
                    setErrors([]);
                  }}
                />
              </label>
            </div>

            <div>
              <label htmlFor="date">
                Date
                <input
                  value={date}
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(event) => {
                    setDate(event.currentTarget.value);
                    setErrors([]);
                  }}
                />
              </label>
            </div>

            <div>
              <label htmlFor="time">
                Time
                <input
                  value={time}
                  name="time"
                  type="time"
                  step="600"
                  onChange={(event) => {
                    setTime(event.currentTarget.value);
                    setErrors([]);
                  }}
                />
              </label>
            </div>

            <div css={messageContainer}>
              {errors.map((error) => {
                return <p key={error.message}>{error.message}</p>;
              })}
            </div>

            <div css={buttonContainer}>
              <button
                css={addButton}
                onClick={async () => {
                  await addEventHandler();
                }}
              >
                Add event
              </button>
            </div>
          </form>
        </main>
      </Transition>
    </>
  );
}

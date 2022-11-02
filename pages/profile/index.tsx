import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Anchor from '../../components/Anchor';
import { getUserBySessionToken, User } from '../../database/users';

const avatarStyles = css`
  border-radius: 50px;
`;

const mainBodyStyles = css`
  display: inline-flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;

  span {
    margin: 20px 0;
  }
`;

export type Props = {
  user: User;
};

function deleteHandler() {}

export default function Profile(props: Props) {
  const [updatedMessage, setUpdatedMessage] = useState('');
  const [username, setUsername] = useState(props.user.username);
  const [password, setPassword] = useState('******');
  const [name, setName] = useState(props.user.name);
  const [email, setEmail] = useState(props.user.email);
  const [phoneNumber, setPhoneNumber] = useState(props.user.phoneNumber || '');

  async function updateUserFromApiByUsername(username: string) {
    const response = await fetch(`/api/profile`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        name: name,
        password: password,
        email: email,
        phoneNumber: phoneNumber,
      }),
    });

    const updatedUserFromApi = (await response.json()) as User;
    setUpdatedMessage('Changes are saved');
    return updatedUserFromApi;
  }

  return (
    <div>
      <Head>
        <title>My profile</title>
        <meta name="description" content="This is my profile" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div css={mainBodyStyles}>
        <h1>{props.user.username}'s Profile</h1>

        <span>
          <Image
            css={avatarStyles}
            src="/profile-pic.jpg"
            width="100"
            height="100"
            alt="user profile picture"
          />
        </span>

        <div>
          <label htmlFor="username">Username</label>
          <br />
          <input
            value={username}
            onChange={(event) => {
              setUsername(event.currentTarget.value.toLowerCase());
            }}
          />
          <br />
          <label htmlFor="password">Password</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.currentTarget.value);
            }}
          />
          <br />
          <label htmlFor="name">Name</label>
          <br />
          <input
            value={name}
            onChange={(event) => {
              setName(event.currentTarget.value);
            }}
          />
          <br />
          <label htmlFor="email">E-mail</label>
          <br />
          <input
            value={email}
            onChange={(event) => {
              setEmail(event.currentTarget.value);
            }}
          />
          <br />
          <label htmlFor="phone-number">Phone number (optional)</label>
          <br />
          <input
            value={phoneNumber}
            onChange={(event) => {
              setPhoneNumber(event.currentTarget.value);
            }}
          />
          <br />
          <button
            onClick={async () => await updateUserFromApiByUsername(username)}
          >
            Save
          </button>
          <div>{updatedMessage}</div>
        </div>

        <br />

        <Link href="/profile/my-posts">My Posts</Link>
        <br />

        {props.user.id ? (
          <Anchor>
            <Link href="/logout">Logout</Link>
          </Anchor>
        ) : (
          ' '
        )}
        <br />
        <button onClick={() => deleteHandler()}>Delete profile</button>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.sessionToken;

  const user = token && (await getUserBySessionToken(token));

  if (!user) {
    return {
      redirect: {
        destination: '/signIn?returnTo=/profile',
        permanent: false,
      },
    };
  }

  return {
    props: { user },
  };
}

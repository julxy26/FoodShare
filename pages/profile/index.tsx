import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
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

type Props = {
  user?: User;
};

function deleteHandler() {}

export default function Profile(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <div>
      <Head>
        <title>My profile</title>
        <meta name="description" content="This is my profile" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div css={mainBodyStyles}>
        <h1>{props.user && props.user.username}'s Profile</h1>

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
          <button>Cancel</button>
          <button>Save</button>
        </div>

        <br />

        <Link href="/profile/my-posts">My Posts</Link>
        <br />

        {props.user ? (
          <a>
            <Link href="/logout">Logout</Link>
          </a>
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

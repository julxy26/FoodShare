import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
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

export default function Profile(props: Props) {
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

        <Link href="/profile/my-posts">My Posts</Link>
        <br />

        {props.user ? (
          <a>
            <Link href="/logout">Logout</Link>
          </a>
        ) : (
          ' '
        )}
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

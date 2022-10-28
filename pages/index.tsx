import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { getValidSessionByToken } from '../database/sessions';

const h1Styles = css``;

export type Props = {
  userIsSignedIn: string;
};

export default function Home(props: Props) {
  return (
    <div>
      <Head>
        <title>Welcome to FoodShare</title>
        <meta name="description" content="Welcome to FoodShare" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {props.userIsSignedIn ? (
        <div>
          <h1 css={h1Styles}>
            Welcome to <div>FoodShare!</div>
          </h1>

          <Image src="/placeholder2.jpg" width="400" height="400" alt="" />

          <Link href="/posts">See all posts</Link>

          <p>Recently added</p>

          <Link href="/logout">Logout</Link>
        </div>
      ) : (
        <div>
          <Image src="/placeholder.jpg" width="400" height="400" alt="" />
          <br />
          <button>
            <Link href="/register">Register</Link>
          </button>
          <button>
            <Link href="/signIn">Sign in</Link>
          </button>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.sessionToken;

  const userIsSignedIn = token && (await getValidSessionByToken(token));

  return {
    props: {
      userIsSignedIn: userIsSignedIn || null,
    },
  };
}

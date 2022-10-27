import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { getUserBySessionToken, User } from '../../database/users';

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

      <h1>{props.user && props.user.username}'s Profile</h1>

      <Link href="/profile/my-posts">My Posts</Link>
      <br />

      {props.user ? <a href="/logout">Logout</a> : ' '}
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

import Head from 'next/head';

export default function Profile() {
  return (
    <div>
      <Head>
        <title>My profile</title>
        <meta name="description" content="This is my profile" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>My Profile</h1>
    </div>
  );
}

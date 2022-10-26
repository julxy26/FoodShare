import Head from 'next/head';

export default function AfterLogin() {
  return (
    <div>
      <Head>
        <title>Welcome to FoodShare</title>
        <meta name="description" content="Welcome to FoodShare" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  );
}

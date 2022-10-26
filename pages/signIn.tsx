import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

export default function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  return (
    <div>
      <Head>
        <title>Sign in to FoodShare</title>
        <meta name="description" content="Sign in to FoodShare" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Link href="/">
        {/* <Image /> */}
        Back
      </Link>

      <h1>Welcome back!</h1>

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
          value={password}
          onChange={(event) => {
            setPassword(event.currentTarget.value);
          }}
        />
      </div>

      <button>Sign in</button>
      <br />
      <Link href="/register">I don't have an account yet!</Link>
    </div>
  );
}

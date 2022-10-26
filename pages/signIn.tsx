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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
        <input value={username} />
        <br />
        <label htmlFor="password">Password</label>
        <br />
        <input value={password} />
      </div>

      <button>Sign in</button>
      <br />
      <Link href="/register">I have an account yet!</Link>
    </div>
  );
}

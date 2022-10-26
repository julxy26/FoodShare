import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { getValidSessionByToken } from '../database/sessions';
import { RegisterResponseBody } from './api/register';

type Props = {
  refreshUserProfile: () => Promise<void>;
};

export default function Register(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();
  const [errors, setErrors] = useState<{ message: string }[]>([]);

  async function registerHandler() {
    const registerResponse = await fetch('/register', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        username: username.toLowerCase(),
        password,
        name,
        email,
        phoneNumber,
      }),
    });
    const registerResponseBody =
      (await registerResponse.json()) as RegisterResponseBody;

    if ('errors' in registerResponseBody) {
      setErrors(registerResponseBody.errors);
      return console.log(registerResponseBody.errors);
    }

    const returnTo = router.query.returnTo;
    if (
      returnTo &&
      !Array.isArray(returnTo) && // Security: Validate returnTo parameter against valid path
      // (because this is untrusted user input)
      /^\/[a-zA-Z0-9-?=/]*$/.test(returnTo)
    ) {
      return await router.push(returnTo);
    }

    // refresh the user on state
    await props.refreshUserProfile();
    // redirect user to user profile
    await router.push(`/`);
  }

  return (
    <div>
      <Head>
        <title>Register</title>
        <meta name="description" content="Register to FoodShare" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Link href="/">
        {/* <Image /> */}
        Back
      </Link>
      <h1>Register</h1>

      <Image
        src="/profile-pic.jpg"
        width="100"
        height="100"
        alt="user profile picture"
      />

      {errors.map((error) => {
        return <p key={error.message}>ERROR: {error.message}</p>;
      })}
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
        <label htmlFor="phone-number">Phone Number</label>
        <br />
        <input
          value={phoneNumber}
          onChange={(event) => {
            setPhoneNumber(event.currentTarget.value);
          }}
        />
      </div>
      <button
        onClick={async () => {
          await registerHandler();
        }}
      >
        Sign Up
      </button>
      <br />
      <Link href="/signIn">I already have an account!</Link>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.sessionToken;

  if (token && (await getValidSessionByToken(token))) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    };
  }

  return {
    props: {},
  };
}

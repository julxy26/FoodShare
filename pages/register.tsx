import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { getValidSessionByToken } from '../database/sessions';
import { RegisterResponseBody } from './api/register';

const mainStyles = css`
  height: 87vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 90px;
  background-image: url('/register-background.jpg');
  background-position: 50% 125%;
  background-repeat: no-repeat;
  background-size: 607px;
`;

const formContainer = css`
  margin-top: 14px;
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: grey;
  width: 303px;
  height: 656px;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid #b2bfb6;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.2);
  border-radius: 23px;

  input {
    box-sizing: border-box;
    width: 221px;
    height: 30px;
    background: #eeeeee;
    border: 1px solid #b2bfb6;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
    border-radius: 40px;
    line-height: 21px;
    text-align: center;
    margin-bottom: 10px;
    color: #3d3535;

    &:focus {
      outline: none;
      color: #3d3535;
    }
  }
  p {
    color: #c07e6e;
    margin-top: 7px;
    margin-bottom: 0;
  }

  button {
    width: 160px;
    height: 38px;
    margin-top: 24px;
    background: #c07e6e;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 30px;
    border: none;
    background-image: url('/add-user-white.png');
    background-repeat: no-repeat;
    background-size: 22px;
    background-position-y: center;
    background-position-x: 10px;
    font-weight: 700;
    line-height: 20px;
    text-align: center;
    color: #ffffff;
    padding-left: 20px;
    transition: 0.3s ease-in-out;

    &:active {
      background-color: #e4b19b;
    }
  }
`;

const avatarStyles = css`
  border-radius: 71px;
`;

const linkToLogin = css`
  margin-top: 15px;
  font-weight: 400;
  line-height: 21px;
  text-decoration: underline;
  text-underline-offset: 4px;
`;

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
  const [message, setMessage] = useState('');

  async function registerHandler() {
    const registerResponse = await fetch('/api/register', {
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
      await props.refreshUserProfile();
      return await router.push(returnTo);
    }

    // refresh the user on state
    await props.refreshUserProfile();
    // redirect user to user profile
    await router.push(`/profile`);
  }

  return (
    <div>
      <Head>
        <title>Register</title>
        <meta name="description" content="Register to FoodShare" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main css={mainStyles}>
        <div css={formContainer}>
          <Image
            css={avatarStyles}
            src="/profile-pic.jpg"
            width="128px"
            height="128px"
            alt="user profile picture"
          />

          <div>
            <label htmlFor="username">Username</label>
            <br />
            <input
              value={username}
              onChange={(event) => {
                setUsername(event.currentTarget.value.toLowerCase());
                setMessage('');
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
                setMessage('');
              }}
            />
            <br />
            <label htmlFor="name">Name</label>
            <br />
            <input
              value={name}
              onChange={(event) => {
                setName(event.currentTarget.value);
                setMessage('');
              }}
            />
            <br />
            <label htmlFor="email">E-mail</label>
            <br />
            <input
              value={email}
              onChange={(event) => {
                setEmail(event.currentTarget.value);
                setMessage('');
              }}
            />
            <br />
            <label htmlFor="phone-number">Phone number (optional)</label>
            <br />
            <input
              value={phoneNumber}
              type="number"
              onChange={(event) => {
                setPhoneNumber(event.currentTarget.value);
                setMessage('');
              }}
            />
          </div>
          {errors.map((error) => {
            return <p key={error.message}>{error.message}</p>;
          })}

          <p>{message}</p>

          <button
            onClick={async () => {
              if (password === '') {
                setMessage('Password required');
              } else if (password.length < 6) {
                setMessage('Password is too short (min. 6 characters)');
              } else {
                setMessage('');
                await registerHandler();
              }
            }}
          >
            Register
          </button>

          <br />
          <div css={linkToLogin}>
            <Link href="/signIn">I already have an account!</Link>
          </div>
        </div>
      </main>
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

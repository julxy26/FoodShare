import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { ButtonHover } from '../components/Animations/ButtonHover';
import { SlideInFromRight } from '../components/Animations/SlideInFromRight';
import { getValidSessionByToken } from '../database/sessions';
import { LoginResponseBody } from './api/signIn';

const mainStyles = css`
  height: 100%;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 90px;

  h1 {
    margin-top: 14px;
    width: 157px;
    text-align: center;
  }

  input {
    box-sizing: border-box;
    width: 221px;
    height: 30px;
    background: #eeeeee;
    border: 1px solid #b2bfb6;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
    border-radius: 40px;
    font-size: 16px;
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
    margin-top: 24px;
    width: 160px;
    height: 38px;
    background: #c07e6e;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 30px;
    border: none;
    background-image: url('/enter-white.png');
    background-repeat: no-repeat;
    background-size: 25px;
    background-position-y: center;
    background-position-x: 6px;
    font-weight: 700;
    font-size: 16px;
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

const inputContainer = css`
  margin-top: 24px;
`;

const linkToRegister = css`
  margin-top: 15px;
  font-weight: 400;
  font-size: 16px;
  line-height: 21px;
  text-decoration: underline;
  text-underline-offset: 4px;
`;

type Props = {
  refreshUserProfile: () => Promise<void>;
};

export default function SignIn(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const router = useRouter();

  async function loginHandler() {
    const loginResponse = await fetch('/api/signIn', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        username: username.toLowerCase(),
        password,
      }),
    });
    const loginResponseBody = (await loginResponse.json()) as LoginResponseBody;

    if ('errors' in loginResponseBody) {
      setErrors(loginResponseBody.errors);
      return console.log(loginResponseBody.errors);
    }

    const returnTo = router.query.returnTo;

    if (
      returnTo &&
      !Array.isArray(returnTo) && // Security: Validate returnTo parameter against valid path
      // (because this is untrusted user input)
      /^\/[a-zA-Z0-9-?=/]*$/.test(returnTo)
    ) {
      // refresh the user on state
      await props.refreshUserProfile();
      return await router.push(returnTo);
    }

    // refresh the user on state
    await props.refreshUserProfile();
    // redirect user to user profile
    await router.push(`/`);
  }

  return (
    <SlideInFromRight>
      <Head>
        <title>Sign in to FoodShare</title>
        <meta name="description" content="Sign in to FoodShare" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main css={mainStyles}>
        <h1>Welcome back!</h1>

        <Image
          src="/signin-illustration.jpg"
          width="230px"
          height="250px"
          alt="Illustration of a blue bowl with lots of ingredients floating above it."
        />

        <div css={inputContainer}>
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
        </div>

        {errors.map((error) => {
          return <p key={error.message}>{error.message}</p>;
        })}
        <ButtonHover>
          <button
            onClick={async () => {
              await loginHandler();
            }}
          >
            Sign in
          </button>
        </ButtonHover>
        <br />
        <div css={linkToRegister}>
          <Link href="/register">I don't have an account yet!</Link>
        </div>
      </main>
    </SlideInFromRight>
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

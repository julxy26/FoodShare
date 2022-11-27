import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SlideInFromRight } from '../../components/Animations/SlideInFromRight';
import HeaderWithSession from '../../components/HeaderWithSession';
import { getUserBySessionToken, User } from '../../database/users';

const avatarStyles = css`
  border-radius: 71px;
`;

const mainBodyStyles = css`
  height: 90vh;
  width: 100vw;
  background-image: url('/profile-background.png');
  background-position: 50% 100%;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: -25px;

  p {
    color: #c07e6e;
    margin-top: 7px;
    margin-bottom: -10px;
    margin-left: 20%;
  }

  input {
    box-sizing: border-box;
    width: 220px;
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

  span {
    margin: 20px 0;
  }

  @media (max-width: 380px) {
    padding-top: 60px;
    padding-bottom: 120px;
    background-position: 50% 0%;
    background-size: 400px 800px;
    height: 100%;
  }

  @media (min-width: 400px) {
    padding-top: 90px;
    padding-bottom: 120px;
    background-position: 50% 100%;
    background-size: 450px 800px;
    height: 100%;
  }

  @media (min-width: 700px) {
    margin-top: 60px;
    padding-top: 80px;
    padding-bottom: 250px;
    background-position: 50% 0%;
    background-size: 820px 1200px;
    height: 100%;
    overflow: hidden;
  }
`;

const saveButton = css`
  width: 165px;
  height: 38px;
  margin-left: 13%;
  margin-top: 24px;
  background: #c07e6e;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 30px;
  border: none;
  background-image: url('/checked.png');
  background-repeat: no-repeat;
  background-size: 23px;
  background-position-y: center;
  background-position-x: 7px;
  font-weight: 600;
  font-size: 17px;

  line-height: 20px;
  text-align: center;
  color: #ffffff;
  padding-left: 25px;
  transition: 0.3s ease-in-out;

  &:active {
    background-color: #e4b19b;
  }
`;

const buttonToDeleteAccount = css`
  margin-top: 15px;
  font-size: 16px;
  line-height: 21px;
  text-decoration: underline;
  text-underline-offset: 4px;
  border: none;
  background: none;
  color: #939393;
`;

export type Props = {
  user: User;
  errors: { message: string }[];
};

export default function Profile(props: Props) {
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState(props.user.username);
  const [password, setPassword] = useState('');
  const [name, setName] = useState(props.user.name);
  const [email, setEmail] = useState(props.user.email);
  const [phoneNumber, setPhoneNumber] = useState(props.user.phoneNumber || '');

  async function getUserFromApi() {
    const response = await fetch('/api/profile');
    const userFromApi = await response.json();
    return userFromApi;
  }

  async function deleteUserFromApiByUsername() {
    const response = await fetch(`/api/profile`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
      }),
    });

    const deletedUser = (await response.json()) as User;
    setMessage('Profile deleted');
    return deletedUser;
  }

  async function updateUserFromApiByUsername() {
    const response = await fetch(`/api/profile`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        name: name,
        password: password,
        email: email,
        phoneNumber: phoneNumber,
      }),
    });

    const updatedUserFromApi = (await response.json()) as User;
    setMessage('Changes are saved');
    return updatedUserFromApi;
  }

  useEffect(() => {
    getUserFromApi().catch((err) => {
      console.log(err);
    });
  }, []);

  if ('errors' in props) {
    return (
      <div>
        {props.errors.map((error) => {
          return <div key={error.message}>{error.message}</div>;
        })}
      </div>
    );
  }

  return (
    <>
      <HeaderWithSession />

      <SlideInFromRight>
        <Head>
          <title>My profile</title>
          <meta name="description" content="This is my profile" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div css={mainBodyStyles}>
          <span>
            <Image
              css={avatarStyles}
              src="/profile-pic.jpg"
              width="128px"
              height="128px"
              alt="user profile picture"
            />
          </span>

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
              required
              minLength={5}
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
              onChange={(event) => {
                setPhoneNumber(event.currentTarget.value);
                setMessage('');
              }}
            />
            <p>{message}</p>

            <button
              css={saveButton}
              onClick={async () => {
                if (password === '') {
                  setMessage('Password required');
                } else if (password.length < 6) {
                  setMessage('Password is too short (min. 6 characters)');
                } else {
                  await updateUserFromApiByUsername();
                }
              }}
            >
              Save changes
            </button>
          </div>

          <br />

          <Link href="/logout">
            <a>
              <Image
                src="/logout.png"
                width="23px"
                height="23px"
                alt="logout icon"
              />
            </a>
          </Link>

          <Link href="/logout">
            <a>
              <button
                css={buttonToDeleteAccount}
                onClick={async () => {
                  await deleteUserFromApiByUsername();
                }}
              >
                Delete account
              </button>
            </a>
          </Link>
        </div>
      </SlideInFromRight>
    </>
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

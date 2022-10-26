import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  return (
    <div>
      <Head>
        <title>Register</title>
        <meta name="description" content="Register to FoodShare" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
      <div>
        <label htmlFor="username">Username</label>
        <br />
        <input value={username} />
        <br />
        <label htmlFor="password">Password</label>
        <br />
        <input value={password} />
        <br />
        <label htmlFor="name">Name</label>
        <br />
        <input value={password} />
        <br />
        <label htmlFor="email">E-mail</label>
        <br />
        <input value={password} />
        <br />
        <label htmlFor="phone-number">Phone Number</label>
        <br />
        <input value={password} />
      </div>
      <button>Sign Up</button>
      <br />
      <Link href="/signIn">I already have an account!</Link>
    </div>
  );
}

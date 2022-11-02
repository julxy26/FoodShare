import Head from 'next/head';
import { User } from '../database/users';
import Footer from './Footer';
import Header from './Header';

type Props = {
  children: React.ReactNode;
  user: User;
};

export default function Layout(props: Props) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main>{props.children}</main>

      <Footer user={props.user} />
    </>
  );
}

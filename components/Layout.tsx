import Head from 'next/head';
import { User } from '../database/users';
import HeaderWithSession from './HeaderWithSession';
import NavigationBar from './NavigationBar';

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
      {typeof props.user !== 'undefined' ? <HeaderWithSession /> : ''}
      <main>{props.children}</main>
      <NavigationBar user={props.user} />
    </>
  );
}

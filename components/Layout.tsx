import Head from 'next/head';
import { Props } from 'next/script';
import Footer from './Footer';
import Header from './Header';

export default function Layout(props: Props) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main>{props.children}</main>

      <Footer />
    </>
  );
}

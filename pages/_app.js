import { css, Global } from '@emotion/react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState();
  const router = useRouter;

  const spring = {
    type: 'spring',
    damping: 20,
    stiffness: 100,
    when: 'afterChildren',
  };

  const refreshUserProfile = useCallback(async () => {
    const profileResponse = await fetch('/api/profile');
    const profileResponseBody = await profileResponse.json();

    if ('errors' in profileResponseBody) {
      setUser(undefined);
    } else {
      setUser(profileResponseBody.user);
    }
  }, []);

  useEffect(() => {
    refreshUserProfile().catch(() => console.log('fetch api failed'));
  }, [refreshUserProfile]);

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="true"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&family=Yeseva+One&display=swap"
        rel="stylesheet"
      />

      <Global
        styles={css`
          *,
          *::before,
          *::after {
            box-sizing: border-box;
          }

          body {
            font-family: 'Assistant', sans-serif;
            font-family: 'Assistant';
            font-style: normal;
            font-size: 18px;
            font-weight: 400;
            margin: 20px 0;
            color: #3d3535;
          }

          h1 {
            font-family: 'Yeseva One', cursive;
            color: #3d3535;
          }

          a,
          a:visited {
            color: #3d3535;
            text-decoration: none;
          }

          img {
            object-fit: cover;
          }
        `}
      />

      <Layout user={user}>
        <Component {...pageProps} refreshUserProfile={refreshUserProfile} />
      </Layout>
    </>
  );
}

export default MyApp;

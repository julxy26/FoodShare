import { css } from '@emotion/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Props } from '../pages/profile';

const containerStyles = (notSignedIn: boolean) => css`
  margin-top: 20px;
  width: 100%;
  text-align: center;
  justify-content: center;
  opacity: 1;

  ${!notSignedIn &&
  css`
    opacity: 0.5;
  `}
`;

export default function Footer(props: Props) {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

  useEffect(() => {
    props.user ? setIsSignedIn(true) : setIsSignedIn(false);
  }, [props.user]);

  return (
    <div css={containerStyles(isSignedIn)}>
      {isSignedIn ? (
        <div>
          <footer>
            <Link href="/">
              <a>Home</a>
            </Link>{' '}
            <Link href="/posts">
              <a>Posts</a>
            </Link>{' '}
            <Link href="/profile">
              <a>Profile</a>
            </Link>{' '}
            {/* <div>copyright FoodShare 2023</div> */}
          </footer>
        </div>
      ) : (
        <div>no session</div>
      )}
    </div>
  );
}

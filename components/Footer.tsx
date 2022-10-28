import { css } from '@emotion/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Props } from '../pages';

const containerStyles = (notSignedIn: boolean | undefined) => css`
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
  const [isSignedIn, setIsSignedIn] = useState<boolean>();

  useEffect(() => {
    const initialValue = props.userIsSignedIn;

    console.log(props.userIsSignedIn);

    if (!initialValue) {
      setIsSignedIn(false);

      props.userIsSignedIn ? setIsSignedIn(true) : setIsSignedIn(false);
    }
  }, [props.userIsSignedIn]);

  return (
    <div css={containerStyles(isSignedIn)}>
      <footer>
        <div>
          <Link href="/">Home</Link> <Link href="/posts">Posts</Link>{' '}
          <Link href="/">Profile</Link>{' '}
        </div>

        {/* <div>copyright FoodShare 2023</div> */}
      </footer>
    </div>
  );
}

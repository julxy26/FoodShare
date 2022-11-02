import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { User } from '../database/users';

const containerStyles = (notSignedIn: boolean) => css`
  ${notSignedIn &&
  css`
    width: 100%;
    text-align: center;
    opacity: 1;
  `}
`;


type Props = {
  user: User | undefined;
};

export default function Footer(props: Props) {
  return (
    <div css={containerStyles(!props.user)}>
      {props.user ? (
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
        ' '
      )}
    </div>
  );
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.sessionToken;

  const userIsSignedIn = token;
  return {
    props: {
      userIsSignedIn: userIsSignedIn || null,
    },
  };
}

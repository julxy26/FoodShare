import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { User } from '../database/users';

const containerStyles = css`
  width: 100vw;
  bottom: 0px;
  position: fixed;
  z-index: 4;

  div {
    height: 93px;
    width: 100vw;
    background: #588777;
    border-radius: 20px 20px 0 0;

    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }
`;

type Props = {
  user: User | undefined;
};

export default function NavigationBar(props: Props) {
  return (
    <div css={containerStyles}>
      {props.user !== undefined ? (
        <div>
          <Link href="/">
            <a>
              <Image
                src="/zuhause.png"
                width="33px"
                height="33px"
                alt="home icon"
              />
            </a>
          </Link>
          <Link href="/posts">
            <a>
              <Image
                src="/ramen.png"
                width="32px"
                height="32px"
                alt="all posts icon"
              />
            </a>
          </Link>

          <Link href="/profile/my-posts/add-post">
            <a>
              <Image
                src="/hinzufugen.png"
                width="60px"
                height="60px"
                alt="add post icon"
              />
            </a>
          </Link>

          <Link href="/profile">
            <a>
              <Image
                src="/profil.png"
                width="40px"
                height="40px"
                alt="profile icon"
              />
            </a>
          </Link>
          <Link href="/faq">
            <a>
              <Image
                src="/question.png"
                width="33px"
                height="33px"
                alt="questions icon"
              />
            </a>
          </Link>
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

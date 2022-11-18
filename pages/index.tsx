import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Photo } from '../database/images';
import { getPostsWithLimit } from '../database/posts';
import { getValidSessionByToken } from '../database/sessions';
import { Tag } from '../database/tags';
import { User } from '../database/users';

const mainStyles = css`
  @media (max-width: 700px) {
    background-color: grey;
    margin: 0;
    padding: 0;
    width: 100vw;
    height: 100vh;
  }
`;

export type Props = {
  userIsSignedIn: string;
  posts: {
    id: number;
    title: string;
    price: number;
    description: string;
    street: string;
    district: number;
    userId: User['id'];
    url: Photo['url'][];
    name: Tag['name'];
  }[];
};

export default function Home(props: Props) {
  return (
    <div>
      <Head>
        <title>Welcome to FoodShare</title>
        <meta name="description" content="Welcome to FoodShare" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main css={mainStyles}>
        {props.userIsSignedIn ? (
          <div>
            <h1>
              Welcome to <div>FoodShare!</div>
            </h1>

            <Image src="/placeholder2.jpg" width="400" height="400" alt="" />

            <br />

            <Link href="/posts">See all posts</Link>

            <p>Recently added</p>

            {props.posts.map((post) => {
              return (
                <div key={`post-${post.id}`}>
                  {post.url.map((url) => (
                    <Link href={`/posts/${post.id}`} key={`url-${url}`}>
                      <a>
                        <Image src={url} width="80px" height="80x" alt="" />
                      </a>
                    </Link>
                  ))}
                  <p>{post.title}</p>
                  <p>€{post.price}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            <Image src="/placeholder.jpg" width="400" height="400" alt="" />
            <br />
            <button>
              <Link href="/register">Register</Link>
            </button>
            <button>
              <Link href="/signIn">Sign in</Link>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.sessionToken;

  const userIsSignedIn = token && (await getValidSessionByToken(token));

  const posts = await getPostsWithLimit(3);

  return {
    props: {
      userIsSignedIn: userIsSignedIn || null,
      posts: posts,
    },
  };
}

import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Photo } from '../database/images';
import { getAllPosts, getPostsWithLimit } from '../database/posts';
import { getValidSessionByToken } from '../database/sessions';
import { Tag } from '../database/tags';
import { User } from '../database/users';

const h1Styles = css``;

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
    urls: Photo['urls'];
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

      {props.userIsSignedIn ? (
        <div>
          <h1 css={h1Styles}>
            Welcome to <div>FoodShare!</div>
          </h1>

          <Image src="/placeholder2.jpg" width="400" height="400" alt="" />

          <br />

          <Link href="/posts">See all posts</Link>

          <p>Recently added</p>

          {props.posts.map((post) => {
            return (
              <div key={`post-${post.id}`}>
                <Link href={`/posts/${post.id}`}>
                  <a>
                    <Image src={post.urls} width="80px" height="80px" alt="" />
                  </a>
                </Link>

                <Link href={`/posts/${post.id}`}>
                  <p>{post.title}</p>
                </Link>
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

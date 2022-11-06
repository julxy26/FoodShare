import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { getPostsByUserId, Post } from '../../../database/posts';
import { getUserBySessionToken } from '../../../database/users';

type Props = {
  posts: Post;
};

export default function UserPosts(props: Props) {
  return (
    <div>
      <Head>
        <title>My Posts</title>
        <meta name="description" content="My Posts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>My Posts</h1>

      {props.posts === null ? (
        <div>
          <p>There are no posts yet</p>
        </div>
      ) : (
        props.posts.map((post) => {
          return (
            <div key={`post-${post.id}`}>
              <Link href={`/profile/my-posts/${post.id}`}>
                <a>
                  <Image
                    src="/placeholder2.jpg"
                    width="80px"
                    height="80px"
                    alt=""
                  />
                </a>
              </Link>

              <Link href={`/profile/my-posts/${post.id}`}>
                <h2>{post.title}</h2>
              </Link>

              <p>price: {post.price}</p>
              <p>description: {post.description}</p>
            </div>
          );
        })
      )}
      <Link href="/profile/my-posts/add-post">
        <button>Add new post</button>
      </Link>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.sessionToken;

  const user = token && (await getUserBySessionToken(token));

  if (user) {
    const userId = user.id;
    const posts = await getPostsByUserId(userId);

    return {
      props: {
        posts: posts || null,
      },
    };
  }
}

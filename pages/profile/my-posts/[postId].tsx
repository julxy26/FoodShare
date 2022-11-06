import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { getSinglePostByPostId, Post } from '../../../database/posts';
import { parseIntFromContextQuery } from '../../../utils/contextQuery';

type Props =
  | {
      post: {
        id: number;
        title: string;
        price: number;
        description: string;
        street: string;
        district: number;
        userId: number;
        imageUrls: string | null;
      };
    }
  | {
      error: string;
    };

export default function SinglePost(props: Props) {
  if ('error' in props) {
    return (
      <div>
        <Head>
          <title>Post not found</title>
          <meta name="description" content="Animal not found" />
        </Head>
        <h1>{props.error}</h1>
        Sorry, try the <Link href="/profile/my-posts">My Posts page</Link>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>{props.post.title}</title>
        <meta name="description" content={`${props.post.title}`} />
      </Head>
      <h2>{props.post.title}</h2>
      <Image src="/placeholder2.jpg" alt="" width="200" height="200" />
      <div>{props.post.price}€</div>
      <div>description: {props.post.description}</div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const postId = parseIntFromContextQuery(context.query.postId);

  if (typeof postId === 'undefined') {
    context.res.statusCode = 404;
    return {
      props: {
        error: 'Post not found',
      },
    };
  }
  const foundPost = await getSinglePostByPostId(postId);

  if (typeof foundPost === 'undefined') {
    context.res.statusCode = 404;
    return {
      props: {
        error: 'Post not found',
      },
    };
  }

  return {
    props: {
      post: foundPost,
    },
  };
}

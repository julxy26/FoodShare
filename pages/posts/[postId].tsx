import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { getSinglePostByPostId, Post } from '../../database/posts';
import { getUserById, getUserBySessionToken, User } from '../../database/users';
import { parseIntFromContextQuery } from '../../utils/contextQuery';

type Props = {
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
  user1: User;
  user2: User;
};

export default function SinglePost(props: Props) {
  return (
    <div>
      <Head>
        <title>{props.post.title}</title>
        <meta name="description" content="Welcome to FoodShare" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>{props.post.title}</h1>
        <Image src="/placeholder2.jpg" width="280" height="250" alt="" />
        <p>{props.post.price}€</p>
        <p>{props.post.description}</p>
        <p>
          {props.post.street}, {props.post.district}
        </p>
        <Link
          href={`mailto:${props.user1.email}?subject=FoodShare request&body=Hi! Your post looks delicious. I would love to purchase it from you. Is it still available? If yes, where and when can I pick it up? Cheers, ${props.user1.name}.`}
        >
          <button>Contact seller</button>
        </Link>
      </main>
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

  if (typeof foundPost === null) {
    context.res.statusCode = 404;
  }
  const token = context.req.cookies.sessionToken;

  const user1 = token && (await getUserBySessionToken(token));

  const foundUser = await getUserById(2);

  return {
    props: {
      post: foundPost,
      user1: user1,
      user2: foundUser,
    },
  };
}

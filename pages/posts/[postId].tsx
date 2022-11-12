import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Photo } from '../../database/images';
import { getSinglePostByPostId, Post } from '../../database/posts';
import { Tag } from '../../database/tags';
import {
  getUserById,
  getUserByPost,
  getUserBySessionToken,
  User,
} from '../../database/users';
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
    urls: Photo['urls'];
    name: Tag['name'];
  };
  loggedUser: User;
  postUser: User;
};

export default function SinglePost(props: Props) {
  const router = useRouter();

  return (
    <div>
      <Head>
        <title>{props.post.title}</title>
        <meta name="description" content="Welcome to FoodShare" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>{props.post.title}</h1>
        <Image src={props.post.urls} width="300px" height="300px" alt="" />
        <p>{props.post.price}€</p>
        <p>{props.post.name}</p>
        <p>{props.post.description}</p>
        <p>
          {props.post.street}, {props.post.district}
        </p>

        <button
          onClick={async () =>
            await router.push(
              `mailto:${props.postUser.email}?subject=FoodShare request&body=Hi, ${props.postUser.name}! Your post looks delicious. I would love to purchase it from you. Is it still available? If yes, where and when can I pick it up? Cheers, ${props.loggedUser.name}.`,
            )
          }
        >
          Contact seller
        </button>
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

  if (typeof foundPost === undefined) {
    context.res.statusCode = 404;
  }
  const token = context.req.cookies.sessionToken;

  const user = token && (await getUserBySessionToken(token));

  const foundLoggedUser = user && (await getUserById(user.id));

  const foundPostUser = await getUserByPost(postId);

  return {
    props: {
      post: foundPost,
      loggedUser: foundLoggedUser,
      postUser: foundPostUser,
    },
  };
}

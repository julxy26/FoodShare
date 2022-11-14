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
        urls: Photo['urls'];
        name: Tag['name'];
      };
      loggedUser: User;
      postUser: User;
    }
  | {
      error: string;
    };

export default function SinglePost(props: Props) {
  const router = useRouter();

  if ('error' in props) {
    return (
      <div>
        <Head>
          <title>Post not found</title>
          <meta name="description" content="Post not found" />
        </Head>
        <h1>{props.error}</h1>
        Sorry, try the <Link href="/posts">Posts page</Link>
      </div>
    );
  }
  return (
    <div>
      <Head>
        <title>{props.post.title}</title>
        <meta name="description" content="Welcome to FoodShare" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>{props.post.title}</h1>
        <p>by {props.postUser.username}</p>
        <Image src={props.post.urls} width="300px" height="300px" alt="" />
        <p>{props.post.price}€</p>
        <p>Tag: {props.post.name}</p>
        <p>Description: {props.post.description}</p>
        <p>
          Pick-up at: {props.post.street}, {props.post.district}
        </p>

        <button
          onClick={async () =>
            await router.push(
              `mailto:${props.postUser.email}?subject=FoodShare request&body=Hi, ${props.postUser.username}! Your post looks delicious. I would love to purchase it from you. Is it still available? If yes, where and when can I pick it up? Cheers, ${props.loggedUser.username}.`,
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

  const foundPost = postId && (await getSinglePostByPostId(postId));

  if (typeof foundPost === 'undefined') {
    context.res.statusCode = 404;
    return {
      props: {
        error: 'Post not found',
      },
    };
  }

  const token = context.req.cookies.sessionToken;

  const user = token && (await getUserBySessionToken(token));

  const foundLoggedUser = user && (await getUserById(user.id));

  const foundPostUser = foundPost && (await getUserByPost(postId));

  return {
    props: {
      post: foundPost,
      loggedUser: foundLoggedUser,
      postUser: foundPostUser,
    },
  };
}

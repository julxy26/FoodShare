import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { getAllPosts, Post } from '../../database/posts';
import { getUserBySessionToken } from '../../database/users';

type Props = {
  posts: Post;
};

export default function Posts(props: Props) {
  return (
    <div>
      <Head>
        <title>FoodShare posts</title>
        <meta name="description" content="Welcome to FoodShare" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>All posts</h1>
      {props.posts.map((post) => {
        return (
          <div key={`post-${post.id}`}>
            <Image src="/placeholder2.jpg" width="200" height="170" alt="" />
            <h2>{post.title}</h2>
            <p>{post.price}€</p>
            <p>{post.description}</p>
            <p>
              {post.street}, {post.district}
            </p>
            <button>View post</button>
          </div>
        );
      })}
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.sessionToken;

  const user = token && (await getUserBySessionToken(token));

  if (!user) {
    return {
      redirect: {
        destination: '/signIn?returnTo=/posts',
        permanent: false,
      },
    };
  }

  const posts = await getAllPosts();

  return {
    props: { posts },
  };
}

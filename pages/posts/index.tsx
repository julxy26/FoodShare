import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Photo } from '../../database/images';
import { getAllPosts } from '../../database/posts';
import { getAllTags, Tag } from '../../database/tags';
import { getUserBySessionToken, User } from '../../database/users';

type Props = {
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

  tags: {
    id: number;
    name: string;
  }[];
};

function filterHandler() {
  return <div>test</div>;
}

export default function Posts(props: Props) {
  return (
    <div>
      <Head>
        <title>FoodShare posts</title>
        <meta name="description" content="Welcome to FoodShare" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>All posts</h1>
      <select>
        {props.tags &&
          props.tags.map((tag) => {
            return <option key={`tag-${tag.id}`}>{tag.name}</option>;
          })}
      </select>

      <button
        onClick={() => {
          filterHandler();
        }}
      >
        Filter
      </button>

      {props.posts.map((post) => {
        return (
          <div key={`post-${post.id}`}>
            <Link href={`/posts/${post.id}`}>
              <Image src={post.urls} width="300px" height="300px" alt="" />
            </Link>
            <Link href={`/posts/${post.id}`}>
              <h2>{post.title}</h2>
            </Link>
            <p>{post.price}€</p>
            <p>{post.name}</p>
            <p>{post.description}</p>
            <p>
              {post.street}, {post.district}
            </p>
            <Link href={`/posts/${post.id}`}>
              <button>View post</button>
            </Link>
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

  const tags = await getAllTags();

  return {
    props: { posts, tags },
  };
}

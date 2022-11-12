import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
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

export default function Posts(props: Props) {
  const [filterOptionSelect, setFilterOptionSelect] = useState('');
  const router = useRouter();

  // const foundPosts = props.posts.find(
  //   (post) => post.name === filterOptionSelect,
  // );

  function filterHandler() {}

  return (
    <div>
      <Head>
        <title>FoodShare posts</title>
        <meta name="description" content="Welcome to FoodShare" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>All posts</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <select
          onChange={(event) => {
            setFilterOptionSelect(event.currentTarget.value);
          }}
        >
          {props.tags.map((tag) => {
            return (
              <option key={`tag-${tag.id}`} value={tag.name}>
                {tag.name}
              </option>
            );
          })}
        </select>

        <button
          onClick={() => {
            filterHandler();
          }}
        >
          Filter
        </button>
      </form>

      {!props.posts[0] ? (
        <div>
          <p>There are no posts yet</p>
        </div>
      ) : (
        props.posts.map((post) => {
          return (
            <div key={`post-${post.id}`}>
              <Link href={`/posts/${post.id}`}>
                <a>
                  <Image src={post.urls} width="300px" height="300px" alt="" />
                </a>
              </Link>

              <Link href={`/posts/${post.id}`}>
                <h2>{post.title}</h2>
              </Link>

              <p>Price: {post.price}</p>
              <p>Tag: {post.name}</p>
              <p>Description: {post.description}</p>
              <p>
                Location: {post.street}, {post.district}
              </p>

              <button
                onClick={async () => await router.push(`/posts/${post.id}`)}
              >
                View post
              </button>
            </div>
          );
        })
      )}
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

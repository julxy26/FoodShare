import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  JSXElementConstructor,
  ReactElement,
  ReactFragment,
  ReactPortal,
  useState,
} from 'react';
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
    tagId: Tag['id'];
  }[];

  tags: {
    id: number;
    name: string;
  }[];
};

export default function Posts(props: Props) {
  const [filterTagId, setFilterTagId] = useState<number>();
  const [filterSelected, setFilterSelected] = useState<number>();
  const router = useRouter();

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
          defaultValue={''}
          onChange={(event) => {
            setFilterTagId(Number(event.currentTarget.value));
          }}
        >
          <option value="" disabled>
            Choose here
          </option>
          {props.tags.map((tag) => {
            return (
              <option key={`tag-${tag.id}`} value={tag.id}>
                {tag.name}
              </option>
            );
          })}
        </select>

        <button
          onClick={() => {
            setFilterSelected(filterTagId);
          }}
        >
          Filter
        </button>
        <button onClick={() => setFilterSelected(0)}>Reset</button>
      </form>

      {!props.posts[0] ? (
        <div>
          <p>There are no posts yet</p>
        </div>
      ) : (
        props.posts
          .filter((post) => {
            let isInTheList = true;

            if (filterSelected && filterSelected !== post.tagId) {
              isInTheList = false;
            }

            return isInTheList;
          })
          .map((post) => {
            return (
              <div key={`post-${post.id}`}>
                <Link href={`/posts/${post.id}`}>
                  <a>
                    <Image
                      src={post.urls}
                      width="300px"
                      height="300px"
                      alt=""
                    />
                  </a>
                </Link>

                <Link href={`/posts/${post.id}`}>
                  <h2>{post.title}</h2>
                </Link>

                <p>Price: {post.price}</p>
                <p>Tag: {post.name}</p>
                <p>Description: {post.description}</p>
                <p>
                  Pick-up at: {post.street}, {post.district}
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

import Head from 'next/head';
import Link from 'next/link';
import { getPostsByUserId, Post } from '../../database/posts';

type Props = {
  posts: Post[] | null;
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
              <h2>
                <Link href={`/posts/${post.id}`}>{post.title}</Link>
              </h2>

              <div>price: {post.price}</div>
              <div>description: {post.description}</div>
            </div>
          );
        })
      )}
      <button>Add new post</button>
    </div>
  );
}

export async function getServerSideProps() {
  const posts = await getPostsByUserId(1);

  return {
    props: {
      posts: posts || null,
    },
  };
}

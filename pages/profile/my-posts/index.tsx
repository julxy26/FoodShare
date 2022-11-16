import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Router, useRouter } from 'next/router';
import { Photo } from '../../../database/images';
import { getPostsByUserId } from '../../../database/posts';
import { Tag } from '../../../database/tags';
import { getUserBySessionToken, User } from '../../../database/users';

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
};

export default function UserPosts(props: Props) {
  const router = useRouter();
  return (
    <div>
      <Head>
        <title>My Posts</title>
        <meta name="description" content="My Posts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>My Posts</h1>

      {!props.posts[0] ? (
        <div>
          <p>There are no posts yet</p>
          <button
            onClick={async () =>
              await router.push('/profile/my-posts/add-post')
            }
          >
            Add new post
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={async () =>
              await router.push('/profile/my-posts/add-post')
            }
          >
            Add new post
          </button>

          {props.posts.map((post) => {
            return (
              <div key={`userPost-${post.id}`}>
                <Link href={`/profile/my-posts/${post.id}`}>
                  <a>
                    <Image
                      src={post.urls}
                      width="300px"
                      height="300px"
                      alt=""
                    />
                  </a>
                </Link>

                <Link href={`/profile/my-posts/${post.id}`}>
                  <h2>{post.title}</h2>
                </Link>

                <p>Price: {post.price}</p>
                <p>Tag: {post.name}</p>
                <p>Description: {post.description}</p>
                <p>
                  Location: {post.street}, {post.district}
                </p>

                <button
                  onClick={async () =>
                    await router.push(`/profile/my-posts/${post.id}`)
                  }
                >
                  Edit post
                </button>
              </div>
            );
          })}
        </div>
      )}
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
        posts,
      },
    };
  }
}

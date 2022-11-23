import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SlideInFromRight } from '../../../components/Animations/SlideInFromRight';
import { Photo } from '../../../database/images';
import { getPostsByUserId } from '../../../database/posts';
import { Tag } from '../../../database/tags';
import { getUserBySessionToken, User } from '../../../database/users';

const mainStyles = css`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 45px;
  position: relative;
  padding-bottom: 80px;

  img {
    object-fit: cover;
  }

  button {
    position: absolute;
    margin-top: -125px;
    margin-left: 30%;
    width: 130px;
    height: 35px;
    background-color: #588777;
    padding-left: 20px;
    color: #fff;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 30px;
    border: none;
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
    background-image: url('/edit.png');
    background-repeat: no-repeat;
    background-size: 20px;
    background-position-y: 6px;
    background-position-x: 9px;
    transition: 0.3s ease-in-out;

    &:active {
      background-color: #b2bfb6;
    }
  }
`;

const textContainer = css`
  width: 100%;
  display: inline-flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 19px;
  font-weight: 300px;
  padding: 0px 5px;
  margin-bottom: 10px;
  margin-top: -15px;

  h2 {
    font-size: 21px;
    font-weight: 600;
  }
`;

type Props = {
  posts?: {
    id: number;
    title: string;
    price: number;
    description: string;
    street: string;
    district: number;
    userId: User['id'];
    url: Photo['url'][];
    name: Tag['name'];
  }[];
};

export default function UserPosts(props: Props) {
  const router = useRouter();
  return (
    <SlideInFromRight>
      <Head>
        <title>My Posts</title>
        <meta name="description" content="My Posts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main css={mainStyles}>
        {!props.posts ? (
          <p>There are no posts yet</p>
        ) : (
          <div>
            {props.posts.map((post) => {
              return (
                <div key={`userPost-${post.id}`}>
                  <div>
                    <Link
                      href={`/profile/my-posts/${post.id}`}
                      key={`url-${post.url[0]}`}
                    >
                      <a>
                        {post.url[0] ? (
                          <Image
                            src={post.url[0]}
                            width="350px"
                            height="186px"
                            alt={post.title}
                          />
                        ) : (
                          <Image
                            src="/ramen-illustration.png"
                            width="350px"
                            height="186px"
                            alt={post.title}
                          />
                        )}
                      </a>
                    </Link>
                  </div>

                  <button
                    onClick={async () =>
                      await router.push(`/profile/my-posts/${post.id}`)
                    }
                  >
                    Edit post
                  </button>

                  <div css={textContainer}>
                    <h2>{post.title}</h2>
                    <p>€ {post.price}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </SlideInFromRight>
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
        posts: posts || null,
      },
    };
  }
}

import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import HeaderWithoutArrow from '../components/HeaderWithoutArrow';
import { Photo } from '../database/images';
import { getPostsWithLimit } from '../database/posts';
import { getValidSessionByToken } from '../database/sessions';
import { Tag } from '../database/tags';
import { User } from '../database/users';

const mainStyles = css`
  position: relative;

  h1 {
    position: absolute;
    z-index: 3;
    margin-top: 50px;
    left: 30px;
    font-size: 35px;
    line-height: 40px;
    width: 300px;
  }
`;

// USER LOGGED IN
const loggedInIndex = css`
  height: 90vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
  position: absolute;
  z-index: 0;
`;

const homeImageContainer = css`
  margin-top: 30px;
`;

const allPostsLink = css`
  width: 140px;
  height: 38px;
  background: #ffdb9d;
  border: 1px solid #ffdb9d;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 30px;
  font-weight: 700;
  font-size: 16px;
  line-height: 33px;
  text-align: center;
  position: absolute;
  left: 30px;
  margin-top: 140px;
`;

const newestPostsText = css`
  display: flex;
  height: 25px;
  line-height: 0;
  gap: 5px;
  margin-top: 17px;
`;

const postContainer = css`
  display: flex;
  gap: 8px;
  max-width: 100%;
  overflow-x: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  div {
    margin-top: 10px;
    width: 150px;
    overflow-x: visible;
    margin-bottom: 8px;
  }

  div div {
    margin-left: 11px;
  }

  p {
    margin: 0 15px;
  }
`;

const imageContainer = css`
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));

  img {
    border-radius: 10px;
    margin: 0 100px;
    border-radius: 10px;
  }
`;

const priceText = css`
  font-weight: 300;
`;

// USER NOT LOGGED IN

const notLoggedInIndex = css`
  top: -20px;
  background-color: #588777;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  position: absolute;
  z-index: 5;

  div {
    margin-bottom: 40px;
  }

  p {
    font-size: 24px;
    color: #fff;
    font-weight: 700;
    letter-spacing: 0.8px;
    margin: 15px;
  }
`;

const buttonContainer = css`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const registerButton = css`
  width: 160px;
  height: 38px;
  background: #ffffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 30px;
  border: none;
  font-weight: 700;
  font-size: 16px;
  line-height: 21px;
  color: #3d3535;
  padding-left: 20px;
  background-image: url('/add-user.png');
  background-repeat: no-repeat;
  background-size: 22px;
  background-position-y: center;
  background-position-x: 10px;
  transition: 0.3s ease-in-out;

  &:active {
    background-color: #b2bfb6;
  }
`;
const signInButton = css`
  margin-top: 25px;
  width: 160px;
  height: 38px;
  background: #b2bfb6;
  /* every button style */
  padding-left: 20px;
  color: #3d3535;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 30px;
  border: none;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  background-image: url('/enter.png');
  background-repeat: no-repeat;
  background-size: 25px;
  background-position-y: center;
  background-position-x: 6px;
  transition: 0.3s ease-in-out;

  &:active {
    background-color: #fff;
  }
`;

export type Props = {
  userIsSignedIn: string;
  posts: {
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

export default function Home(props: Props) {
  const router = useRouter();
  return (
    <div>
      <Head>
        <title>Welcome to FoodShare</title>
        <meta name="description" content="Welcome to FoodShare" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HeaderWithoutArrow />

      <main css={mainStyles}>
        {props.userIsSignedIn ? (
          <div css={loggedInIndex}>
            <h1>Because sharing is caring.</h1>

            <div css={homeImageContainer}>
              <Image
                src="/home-image.png"
                width="416px"
                height="370px"
                alt="Three glasses of pink lemonades on a wooden serving board with raspberries next to it."
              />
            </div>

            <br />

            <div css={allPostsLink}>
              <Link href="/posts">See all posts</Link>
            </div>
            <div css={newestPostsText}>
              <Image
                src="/salat.png"
                width="24px"
                height="23px"
                alt="salad bowl icon"
              />
              <p>Newest posts</p>
            </div>

            <div css={postContainer}>
              {props.posts.map((post) => {
                return (
                  <div key={`post-${post.id}`}>
                    <div css={imageContainer}>
                      <Link href={`/posts/${post.id}`}>
                        <a>
                          {post && post.url[0] ? (
                            <Image
                              src={post.url[0]}
                              width="150px"
                              height="138x"
                              alt={`Picture of ${post.title}`}
                            />
                          ) : (
                            <Image
                              src="/profile-pic.jpg"
                              width="150px"
                              height="138x"
                              alt="Post placeholder image"
                            />
                          )}
                        </a>
                      </Link>
                    </div>

                    <p>{post.title}</p>
                    <p css={priceText}>€ {post.price}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div css={notLoggedInIndex}>
            <p>Welcome to</p>
            <div>
              <Image
                src="/foodshare-logo.png"
                width="262"
                height="63"
                alt="FoodShare logo"
              />
            </div>

            <div>
              <Image
                src="/ramen-illustration.png"
                width="320"
                height="320"
                alt="Illustration of a bowl of ramen"
              />
            </div>

            <div css={buttonContainer}>
              <button
                css={registerButton}
                onClick={async () => await router.push('/register')}
              >
                Register
              </button>

              <button
                css={signInButton}
                onClick={async () => await router.push('/signIn')}
              >
                Sign in
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.sessionToken;

  const userIsSignedIn = token && (await getValidSessionByToken(token));

  const posts = await getPostsWithLimit(4);

  return {
    props: {
      userIsSignedIn: userIsSignedIn || null,
      posts: posts,
    },
  };
}

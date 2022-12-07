import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import { CldImage } from 'next-cloudinary';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ButtonHover } from '../components/Animations/ButtonHover';
import { SlideInFromLeft } from '../components/Animations/SlideInFromLeft';
import HeaderWithoutArrow from '../components/HeaderWithoutArrow';
import { Photo } from '../database/images';
import { getPostsWithLimit } from '../database/posts';
import { getValidSessionByToken } from '../database/sessions';
import { Tag } from '../database/tags';
import { User } from '../database/users';

const mainStyles = css`
  position: relative;
`;

// USER LOGGED IN
const loggedInIndex = css`
  height: 95vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 17px;
  position: absolute;
  z-index: 0;

  @media (max-height: 750px) {
    height: 120vh;
  }
`;

const imageAndTextContainer = css`
  display: flex;
  justify-content: center;
`;

const homeImageContainer = css`
  margin-top: 30px;
  width: 100vw;
  height: 370px;
  display: flex;
  justify-content: center;
  background-image: url('/home-image.jpg');
  background-size: 400px auto;
  background-repeat: no-repeat;
  background-position: 50% 50%;

  h1 {
    position: absolute;
    z-index: 8;
    top: 20px;
    left: 20px;
    font-size: 35px;
    line-height: 40px;
    width: 300px;
  }

  div {
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
    left: 20px;
    top: 135px;
  }

  @media (min-width: 400px) {
    background-size: 100% auto;
    background-position: 50% 55%;
  }

  @media (min-width: 572px) {
    h1 {
      width: 90%;
      padding-right: 50px;
      top: 50px;
      left: 50px;
    }
    div {
      margin-right: 150px;
      left: 50px;
      top: 130px;
    }
  }
`;

const newestPostsText = css`
  display: flex;
  height: 25px;
  line-height: 0;
  gap: 5px;
  margin-top: 45px;
  font-weight: 600;
`;

const postsMainContainer = css`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const postContainer = css`
  display: flex;
  justify-content: flex-start;
  gap: 8px;
  overflow-x: scroll;
  margin-left: -20px;

  &::-webkit-scrollbar {
    display: none;
  }

  div {
    margin-top: 13px;
    width: 150px;
    overflow-x: visible;
    margin-bottom: 8px;
  }

  div div {
    margin-left: 11px;
  }

  p {
    margin: 0 15px;
    width: 150px;
    margin-left: 25px;
  }
`;

const imageContainer = css`
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  width: 150px;
  height: 138px;
  border-radius: 10px;
  border: 0.4px solid #dbdbdb;

  img {
    border-radius: 10px;
    margin: 0px 100px;
  }
`;

const priceText = css`
  font-weight: 300;
`;

// USER NOT LOGGED IN

const notLoggedInIndex = css`
  top: -44px;
  padding-top: 80px;
  background-color: #588777;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 8;

  div {
    margin-bottom: 40px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }

  p {
    font-size: 24px;
    color: #fff;
    font-weight: 700;
    letter-spacing: 0.8px;
    margin: 15px;
    text-align: center;
  }

  @media (max-height: 750px) {
    padding-top: 40px;

    p {
      font-size: 18px;
    }
    div {
      width: 88%;
      margin-bottom: 25px;
    }
  }
`;

const buttonContainer = css`
  margin-top: 30px;
  width: 100vw;
  display: inline-flex;
  flex-direction: row;
  justify-content: center;

  button + button {
    margin-left: 25px;
  }

  @media (max-width: 500px) {
    margin-top: 10px;
    flex-direction: column;
    align-items: center;

    button + button {
      margin-left: 0px;
      margin-top: 25px;
    }
  }
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

export default function Home(props: Props) {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Welcome to FoodShare</title>
        <meta name="description" content="Welcome to FoodShare" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main css={mainStyles}>
        {props.userIsSignedIn ? (
          <div>
            <HeaderWithoutArrow />
            <SlideInFromLeft>
              <div css={loggedInIndex}>
                <div css={imageAndTextContainer}>
                  <div css={homeImageContainer}>
                    <h1>Because sharing is caring.</h1>

                    <div>
                      <Link href="/posts">See all posts</Link>
                    </div>
                  </div>
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

                <div css={postsMainContainer}>
                  <div css={postContainer}>
                    {props.posts &&
                      props.posts.map((post) => {
                        return (
                          <div key={`post-${post.id}`}>
                            <ButtonHover>
                              <div css={imageContainer}>
                                <Link href={`/posts/${post.id}`}>
                                  <a>
                                    {post.url[0] ? (
                                      <CldImage
                                        src={post.url[0]}
                                        width="150px"
                                        height="138x"
                                        alt={`Picture of ${post.title}`}
                                      />
                                    ) : (
                                      <Image
                                        src="/ramen-illustration.png"
                                        width="150px"
                                        height="138x"
                                        alt="Post placeholder image"
                                      />
                                    )}
                                  </a>
                                </Link>
                              </div>
                            </ButtonHover>

                            <p>{post.title}</p>
                            <p css={priceText}>€ {post.price}</p>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </SlideInFromLeft>
          </div>
        ) : (
          <div css={notLoggedInIndex}>
            <SlideInFromLeft>
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

              <ButtonHover>
                <span css={buttonContainer}>
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
                </span>
              </ButtonHover>
            </SlideInFromLeft>
          </div>
        )}
      </main>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.sessionToken;

  const userIsSignedIn = token && (await getValidSessionByToken(token));

  const posts = await getPostsWithLimit(4);

  return {
    props: {
      userIsSignedIn: userIsSignedIn || null,
      posts: posts || null,
    },
  };
}

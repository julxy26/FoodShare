import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import { CldImage } from 'next-cloudinary';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SlideInFromRight } from '../../components/Animations/SlideInFromRight';
import HeaderWithSession from '../../components/HeaderWithSession';
import { Photo } from '../../database/images';
import { getPostByPostId } from '../../database/posts';
import { Tag } from '../../database/tags';
import {
  getUserById,
  getUserByPost,
  getUserBySessionToken,
  User,
} from '../../database/users';
import { parseIntFromContextQuery } from '../../utils/contextQuery';

const mainStyles = css`
  margin-top: 47px;
  padding-bottom: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const imageContainer = css`
  overflow-x: scroll;
  white-space: nowrap;
  max-width: 100%;
  display: inline-block;
  scroll-snap-type: x mandatory;
  scroll-snap-align: start;

  &::-webkit-scrollbar {
    display: none;
  }

  img {
    object-fit: cover;
    overflow-x: visible;
  }
`;

const titleAndPriceContainer = css`
  width: 92%;
  display: inline-flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 19px;
  font-weight: 300px;
  padding: 0px 10px;
  margin-bottom: -10px;
  margin-top: -10px;

  h1 {
    font-family: 'Assistant';
    font-weight: 600;
    font-size: 21px;
  }
`;
const tagName = css`
  margin-right: 47%;
`;
const descriptionContainer = css`
  width: 344px;
  margin-bottom: 10px;
  margin-top: 0px;

  h2 {
    margin-bottom: -10px;
    font-weight: 600;
    font-size: 19px;
    line-height: 21px;
  }
`;

const locationContainer = css`
  display: flex;
  justify-content: center;
  height: 27px;
  gap: 2px;
  margin-bottom: 30px;
  margin-left: -3px;

  p {
    line-height: 4px;
    text-decoration: underline;
    text-underline-offset: 4px;
    font-weight: 600;
    font-size: 16px;
  }

  div {
    display: flex;
  }

  img {
    object-fit: cover;
  }
`;

const contactButton = css`
  width: 50%;
  height: 38px;
  background-color: #ffdb9d;
  padding-left: 20px;
  color: #3d3535;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 30px;
  border: none;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  background-image: url('/email.png');
  background-repeat: no-repeat;
  background-size: 25px;
  background-position-y: center;
  background-position-x: 6px;
  transition: 0.3s ease-in-out;

  &:active {
    background-color: #fff;
  }
`;

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
        url: Photo['url'][];
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
        <HeaderWithSession />
        <SlideInFromRight>
          <Head>
            <title>Post not found</title>
            <meta name="description" content="Post not found" />
          </Head>
          <h1>{props.error}</h1>
          Sorry, try the <Link href="/posts">Posts page</Link>
        </SlideInFromRight>
      </div>
    );
  }
  return (
    <div>
      <HeaderWithSession />
      <SlideInFromRight>
        <Head>
          <title>{props.post.title}</title>
          <meta name="description" content="Welcome to FoodShare" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main css={mainStyles}>
          <div css={imageContainer}>
            {props.post.url.map((url) => (
              <div key={`url-${url}`} css={imageContainer}>
                <CldImage
                  src={url}
                  width="393px"
                  height="321px"
                  alt={props.post.title}
                />
              </div>
            ))}
          </div>

          {!props.post.url[0] && (
            <div css={imageContainer}>
              <Image
                src="/ramen-illustration.png"
                width="393px"
                height="321px"
                alt="Post placeholder image"
              />
            </div>
          )}

          <div css={titleAndPriceContainer}>
            <h1>{props.post.title}</h1>
            <p>{props.post.price}€</p>
          </div>

          <div css={tagName}>
            <Image
              src={`/${props.post.name}-post.png`}
              width="160px"
              height="33px"
              alt={`${props.post.name} tag`}
            />
          </div>

          <div css={descriptionContainer}>
            <h2>Description</h2>
            <p>{props.post.description}</p>
          </div>

          <div css={locationContainer}>
            <Image
              src="/position-pin.png"
              width="20px"
              height="27px"
              alt="location icon"
            />
            <p>
              {props.post.street}, {props.post.district}
            </p>
          </div>

          <button
            css={contactButton}
            onClick={async () =>
              await router.push(
                `mailto:${props.postUser.email}?subject=FoodShare request&body=Hi, ${props.postUser.username}! Your post looks delicious. I would love to purchase it from you. Is it still available? If yes, where and when can I pick it up? Cheers, ${props.loggedUser.username}.`,
              )
            }
          >
            Contact {props.postUser.username}
          </button>
        </main>
      </SlideInFromRight>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const postId = parseIntFromContextQuery(context.query.postId);

  const foundPost = postId && (await getPostByPostId(postId));

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

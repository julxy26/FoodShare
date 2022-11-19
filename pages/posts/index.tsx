import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Photo } from '../../database/images';
import { getAllPosts } from '../../database/posts';
import { getAllTags, Tag } from '../../database/tags';
import { getUserBySessionToken, User } from '../../database/users';

const mainContainer = css`
  padding-top: 70px;
  padding-left: 20px;
  padding-bottom: 100px;

  img {
    object-fit: cover;
    margin-left: 20px;
  }
`;

const filterContainer = css`
  font-weight: 400;
  font-size: 16px;
  display: flex;

  button {
    border: none;
    background: none;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 17px;
    font-family: 'Assistant';
    font-style: normal;
    font-weight: 600;
    color: #3d3535;
  }

  button + button {
    margin-left: 117px;
  }
`;

const formStyles = css`
  background-color: grey;
  width: 100vw;
  height: 800px;
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  margin-bottom: 93px;
  display: flex;
  flex-direction: column;
  align-items: center;

  label {
    width: 160px;
    height: 33px;
    border: 1px solid black;
    border-radius: 65px;
    margin-bottom: 10px;
    /* background-image: url('/Vegan-filter.png'); */
    line-height: 30px;
    text-align: center;
    background: white;
    &:active {
      background: red;
    }
  }

  input {
    margin-left: 12px;
    appearance: none;
  }
`;
const textContainer = css`
  width: 95%;
  display: inline-flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 18px;
  font-weight: 300px;
  padding: 0px 10px;
  margin-bottom: -10px;
  margin-top: -10px;

  h2 {
    font-size: 20px;
    font-weight: 600;
  }
`;

const districtContainer = css`
  display: flex;
  justify-content: space-between;
  height: 23px;
  gap: 2px;

  p {
    line-height: 4px;
    text-decoration: underline;
    text-underline-offset: 3px;
    font-weight: 600;
    font-size: 14px;
  }

  div {
    display: flex;
  }
`;

const tagAndDistrict = css`
  display: flex;
  gap: 14px;
  margin-top: 5px;
  margin-bottom: 10px;
`;

type Props = {
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
  const [onFilter, setOnFilter] = useState<boolean>(false);

  return (
    <div>
      <Head>
        <title>FoodShare posts</title>
        <meta name="description" content="Welcome to FoodShare" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main css={mainContainer}>
        <div css={filterContainer}>
          <button onClick={() => setOnFilter(true)}>
            {
              <Image
                src="/filter.png"
                width="28px"
                height="28px"
                alt="filter icon"
              />
            }
            Filter
          </button>

          <button onClick={() => setOnFilter(true)}>Sort by:</button>
          <p>Most recent</p>
        </div>
        {onFilter ? (
          <form
            css={formStyles}
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            {props.tags.map((tag) => {
              return (
                <label>
                  <input
                    type="radio"
                    key={`tag-${tag.id}`}
                    value={tag.id}
                    onChange={(event) => {
                      setFilterTagId(Number(event.currentTarget.value));
                    }}
                  />
                  {/* <Image
                    src={`/${tag.name}-filter.png`}
                    width="160px"
                    height="33px"
                    alt={`${tag.name} filter`}
                  /> */}
                  {tag.name}
                </label>
              );
            })}

            <button
              onClick={() => {
                setFilterSelected(filterTagId);
                setOnFilter(false);
              }}
            >
              Confirm
            </button>
            <button
              onClick={() => {
                setFilterSelected(0);
                setOnFilter(false);
              }}
            >
              Reset
            </button>
          </form>
        ) : (
          ''
        )}

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
                  <div css={textContainer}>
                    <Link href={`/posts/${post.id}`}>
                      <h2>{post.title}</h2>
                    </Link>
                    <p>€ {post.price}</p>
                  </div>

                  {post && post.url[0] ? (
                    <Link href={`/posts/${post.id}`} key={`url-${post.url[0]}`}>
                      <a>
                        <Image
                          src={post.url[0]}
                          width="350px"
                          height="186px"
                          alt=""
                        />
                      </a>
                    </Link>
                  ) : (
                    ''
                  )}

                  <div css={tagAndDistrict}>
                    <Image
                      src={`/${post.name}.png`}
                      width="128px"
                      height="28px"
                      alt={`${post.name} tag`}
                    />

                    <div css={districtContainer}>
                      <Image
                        src="/position-pin.png"
                        width="17px"
                        height="23px"
                        alt="location icon"
                      />
                      <p>{post.district}</p>
                    </div>
                  </div>
                </div>
              );
            })
        )}
      </main>
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

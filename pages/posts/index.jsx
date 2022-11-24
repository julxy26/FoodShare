import { css } from '@emotion/react';
// import { GetServerSidePropsContext } from 'next';
import { CldImage } from 'next-cloudinary';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { SlideInFromLeft } from '../../components/Animations/SlideInFromLeft';
// import { Photo } from '../../database/images';
import { getAllPosts } from '../../database/posts';
import { getAllTags } from '../../database/tags';
import { getUserBySessionToken } from '../../database/users';

const mainContainer = css`
  padding-top: 60px;
  padding-left: 20px;
  z-index: 0;
  position: relative;
  padding-bottom: 100px;

  img {
    object-fit: cover;
    margin-left: 20px;
  }

  .dropdown-menu {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 30px;
  }

  .menu-items p {
    font-weight: 700;
    font-size: 18px;
    line-height: 24px;
    color: #3d3535;
    margin-bottom: 10px;
  }

  select {
    width: 175px;
    height: 35px;
    background: #ffffff;
    border: 1px solid #939393;
    border-radius: 40px;
    text-align: center;
    font-size: 16px;
    line-height: 21px;
    color: #3d3535;
    margin-bottom: 17px;
  }

  .navbar .nav-container li {
    list-style: none;
    width: 160px;
    height: 33px;
    border-radius: 65px;
    margin-bottom: 10px;
    font-size: 16px;
    text-align: center;
    background: white;
  }

  .nav-container .checkbox {
    position: absolute;
    display: block;
    top: 45px;
    left: 20px;
    height: 45px;
    width: 45px;
    z-index: 7;
    opacity: 0;

    cursor: pointer;
  }

  .navbar .menu-items {
    width: 100vw;
    height: 100vh;
    transform: translateY(-100%);
    transition: transform 0.5s ease-in-out;
    margin: 0px auto;
    margin-left: -20px;
    margin-top: -47px;
    background-color: #fff;
    position: absolute;
    z-index: 6;
    opacity: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .navbar .menu-items > li > button {
    margin: 0px auto;
    margin-top: 0px;
    margin-bottom: 20px;
    font-weight: 400;
    font-size: 16px;
    line-height: 30px;
    width: 160px;
    height: 33px;
    border: 1px solid #939393;
    background-color: #fff;
    border-radius: 65px;
    color: #3d3535;
    transition: 0.2s all ease-in-out;

    &:focus {
      background-color: #ffdb9d;
    }

    &:focus::after {
      background-color: #fff;
    }
  }

  .nav-container input[type='checkbox']:checked ~ .menu-items {
    transform: translateX(0);
    opacity: 1;
    transition: 0.6s all ease-in-out;
  }
  button:active ~ .menu-items {
    transform: translateX(100);
    transition: 0.7s all ease-in-out;
  }

  input {
    margin-left: 12px;
    display: none;
  }
`;

const buttonContainer = css`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 45px;
`;

const resetButton = css`
  width: 130px;
  height: 35px;
  color: #588777;
  border-radius: 30px;
  border: none;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  background: #ffffff;
  transition: 0.3s ease-in-out;
  border: 1px solid #588777;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 30px;

  &:active {
    background-color: #fff;
  }
`;
const confirmButton = css`
  width: 130px;
  height: 35px;
  padding-left: 20px;
  color: #fff;
  border-radius: 30px;
  border: none;
  background: #588777;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  background-image: url('/checked.png');
  background-repeat: no-repeat;
  background-size: 25px;
  background-position-y: center;
  background-position-x: 6px;
  transition: 0.3s ease-in-out;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 30px;

  &:active {
    background-color: #fff;
  }
`;

const filterContainer = css`
  font-weight: 400;
  font-size: 16px;
  display: flex;
  margin-top: -20px;

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

const textContainer = css`
  width: 95%;
  display: inline-flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 19px;
  font-weight: 300px;
  padding: 0px 10px;
  margin-bottom: -15px;
  margin-top: -15px;

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
    line-height: 0px;
    text-decoration: underline;
    text-underline-offset: 3px;
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

const tagAndDistrict = css`
  display: flex;
  gap: 14px;
  margin-top: 5px;
  margin-bottom: 15px;
  width: 100%;
`;

// type Props = {
//   posts?: {
//     id: number;
//     title: string;
//     price: number;
//     description: string;
//     street: string;
//     district: number;
//     userId: User['id'];
//     url: Photo['url'][];
//     name: Tag['name'];
//     tagId: Tag['id'];
//   }[];

//   tags: {
//     id: number;
//     name: string;
//   }[];
// };

// export default function Posts(props: Props) {
//   const [filterTagId, setFilterTagId] = useState<number>();
//   const [filterSelected, setFilterSelected] = useState<number>();
//   const [onFilter, setOnFilter] = useState<boolean>(false);
export default function Posts(props) {
  const [filterTagId, setFilterTagId] = useState();
  const [filterSelected, setFilterSelected] = useState();
  const [onFilter, setOnFilter] = useState(false);

  return (
    <div>
      <SlideInFromLeft>
        <Head>
          <title>FoodShare posts</title>
          <meta name="description" content="Welcome to FoodShare" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main css={mainContainer}>
          <div css={filterContainer}>
            <button onClick={() => setOnFilter(true)}>
              <Image
                src="/filter.png"
                width="28px"
                height="28px"
                alt="filter icon"
              />
              Filter
            </button>

            <button onClick={() => setOnFilter(true)}>Sort by:</button>
            <p>Most recent</p>
          </div>

          {onFilter ? (
            <div className="navbar">
              <div className="container nav-container">
                <input className="checkbox" type="checkbox" />
                <div className="menu-items">
                  <div className="dropdown-menu">
                    <p>Sort by</p>
                    <select>
                      <option>Most recent</option>
                      <option>A-Z</option>
                      <option>Price</option>
                    </select>
                    <p>District</p>
                    <select>
                      <option>1010</option>
                      <option>1020</option>
                      <option>1030</option>
                    </select>
                    <p>Tags</p>
                  </div>
                  {props.tags.map((tag) => {
                    return (
                      <li key={`tag-${tag.id}`}>
                        <button
                          key={`tag-${tag.id}`}
                          value={tag.id}
                          onClick={(event) => {
                            setFilterTagId(Number(event.currentTarget.value));
                          }}
                        >
                          {tag.name}
                        </button>
                      </li>
                    );
                  })}

                  <div css={buttonContainer}>
                    <button
                      css={resetButton}
                      onClick={() => {
                        setFilterSelected(0);
                        setOnFilter(false);
                      }}
                    >
                      Reset
                    </button>

                    <button
                      css={confirmButton}
                      onClick={() => {
                        setFilterSelected(filterTagId);
                        setOnFilter(false);
                      }}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ''
          )}

          {!props.posts ? (
            <div>
              <p>There are no posts yet</p>
            </div>
          ) : (
            props.posts
              .filter((post) => {
                let isInTheList = true;

                if (filterSelected !== post.tagId) {
                  isInTheList = false;
                }

                // if (filterSelected && filterSelected !== post.tagId) {
                //   isInTheList = false;
                // }

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

                    {post.url[0] ? (
                      <Link
                        href={`/posts/${post.id}`}
                        key={`url-${post.url[0]}`}
                      >
                        <a>
                          <CldImage
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

                    {!post.url[0] && (
                      <Link
                        href={`/posts/${post.id}`}
                        key={`url-${post.url[0]}`}
                      >
                        <a>
                          <Image
                            src="/ramen-illustration.png"
                            width="350px"
                            height="186px"
                            alt="Post placeholder image"
                          />
                        </a>
                      </Link>
                    )}

                    <div css={tagAndDistrict}>
                      <Image
                        src={`/${post.name}-tag.png`}
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
      </SlideInFromLeft>
    </div>
  );
}

export async function getServerSideProps(context) {
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
    props: {
      posts: posts,
      tags: tags,
    },
  };
}

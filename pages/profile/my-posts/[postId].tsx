import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import { CldImage } from 'next-cloudinary';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { SlideInFromRight } from '../../../components/Animations/SlideInFromRight';
import HeaderWithSession from '../../../components/HeaderWithSession';
import { Photo } from '../../../database/images';
import { getPostByPostId, Post } from '../../../database/posts';
import { getAllTags, Tag } from '../../../database/tags';
import { parseIntFromContextQuery } from '../../../utils/contextQuery';

const mainStyles = css`
  margin-top: 47px;
  padding-bottom: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  @keyframes moveToLeft {
    from {
    }
    to {
      -webkit-transform: translateX(-100%);
      transform: translateX(-100%);
    }
  }

  input {
    width: 100%;
    border: none;
    border-radius: 30px;
    line-height: 21px;
    text-align: center;
    margin-bottom: 10px;
    color: #3d3535;
    outline: none;
    background: none;
    height: 33px;
    border: 1px solid #b2bfb6;

    &:focus,
    &:active {
      outline: none;
    }
  }
`;

const imageContainer = css`
  overflow: hidden;
  max-height: 10%;
  overflow-x: scroll;
  white-space: nowrap;
  max-width: 100%;
  display: inline-block;
  scroll-snap-type: x mandatory;

  span {
    scroll-snap-align: start;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  img {
    object-fit: cover;
    overflow-x: visible;
  }
`;

const uploadImagesContainer = css`
  border: 1px solid #b2bfb6;
  border-radius: 15px;
  width: 180px;
  height: 162px;
  margin: 0 auto;
  position: relative;
  margin-bottom: 30px;

  div {
    margin-top: 6px;
    margin-left: 9px;
    gap: 4px;
  }

  input {
    width: 50px;
    height: 50px;
    background: #ffdb9d;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 10px;
    background-image: url('/kamera.png');
    background-size: 37px 36px;
    background-repeat: no-repeat;
    background-position-y: center;
    background-position-x: 6px;
    border: none;
    position: absolute;
    top: 35%;
    left: 36%;
    padding: 50px 0 0 0;
    transition: 0.3s ease-in-out;

    ::-webkit-file-upload-button {
      display: none;
    }

    &:active {
      opacity: 0.8;
    }
  }

  img {
    border-radius: 10px;
  }
`;

const titleContainer = css`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: -60px auto;
  margin-top: 10px;
  background-color: none;

  input {
    font-size: 19px;
    font-weight: 600;
    border: 1px solid #ddd;
    width: 90%;
  }
`;
const tagNameContainer = css`
  width: 160px;
  height: 33px;
  background: #ccc;
  border-radius: 65px;
  margin-left: 20px;
  margin-top: 60px;
  margin-bottom: 20px;
  text-align: center;
  line-height: 31px;
  font-weight: 600;
  font-size: 18px;

  input {
    display: none;
  }
`;

const tagsOnEditContainer = css`
  margin-top: 65px;
  justify-content: space-between;
  display: flex;

  label {
    display: flex;
    line-height: 39px;
  }
  input {
    margin-right: 8px;
    width: 16px;
  }
`;
const descriptionContainer = css`
  margin: 3px auto;
  margin-top: -45px;
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    font-size: 19px;
    font-weight: 600;
    margin-right: 64%;
  }

  textarea {
    margin-top: -13px;
    height: 138px;
    width: 90vw;
    font-family: 'Assistant';
    font-weight: 400;
    font-size: 16px;
    line-height: 21px;
    background: none;
    padding: 10px 20px;
    border: 1px solid #b2bfb6;
    border-radius: 15px;

    &:focus,
    &:active {
      outline: none;
    }
  }
`;

const locationContainer = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 27px;
  gap: 2px;
  width: 345px;
  margin: 0 auto;

  input {
    font-size: 16px;
  }
`;

const districtAndPriceContainer = css`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 345px;
  margin: 0 auto;
  margin-top: 15px;

  label {
    margin-right: 0;
    color: #a4a4a4;
    font-weight: 600;
  }
  label + label {
    margin-left: 50px;
  }
  input {
    width: 160px;
    font-size: 16px;
  }
`;

const priceInput = css`
  margin-left: -18px;
`;

const messageContainer = css`
  display: flex;
  justify-content: center;
  color: #c07e6e;

  position: relative;
  p {
    position: absolute;
    top: -17px;
  }
`;

const buttonContainer = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
`;

const editButton = css`
  width: 130px;
  height: 35px;
  background-color: #c07e6e;
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
    background-color: #e4b19b;
  }
`;

const deleteButton = css`
  border: none;
  background: none;
  margin-top: 20px;
`;

type Props = {
  post: {
    id: number;
    title: string;
    price: number;
    description: string;
    street: string;
    district: number;
    userId: number;
    url: Photo['url'][];
    tagId: Tag['id'];
    name: Tag['name'];
  };
  tags: Tag[];

  error: string;
};

export default function SingleUserPost(props: Props) {
  const [title, setTitle] = useState<string>(props.post.title);
  const [price, setPrice] = useState<number>(props.post.price);
  const [description, setDescription] = useState<string>(
    props.post.description,
  );
  const [street, setStreet] = useState<string>(props.post.street);
  const [district, setDistrict] = useState<number>(props.post.district);

  const [tagId, setTagId] = useState(props.post.tagId);
  const [tagName, setTagName] = useState(props.post.name);

  const [buttonText, setButtonText] = useState('Edit');

  const [onEdit, setOnEdit] = useState<boolean>(true);

  const [preview, setPreview] = useState<string[]>([]);

  const [message, setMessage] = useState<string>('');

  const router = useRouter();

  const handleFileChange = async (e: any) => {
    const files: (string | Blob)[] = Object.values(e.target.files);
    const imageLinks: string[] = [];

    if (files.length > 4) {
      setMessage('Amount of images exceeded');
      return;
    }

    for (const file of files) {
      const formData = new FormData();

      formData.append('file', file);
      formData.append('upload_preset', 'foodShare');

      const request = await fetch(
        'https://api.cloudinary.com/v1_1/dezeipn4z/image/upload',
        {
          method: 'POST',
          body: formData,
        },
      );

      const data = await request.json();

      imageLinks.push(data.secure_url);
    }

    setPreview(imageLinks);
  };

  async function savePostHandler(postId: number) {
    const response = await fetch(`/api/profile/posts/${postId}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
        price: price,
        description: description,
        street: street,
        district: district,
        urls: preview,
        tagId: tagId,
      }),
    });
    const updatedPost = (await response.json()) as Post;
    setOnEdit(true);
    setButtonText('Edit');

    return updatedPost;
  }

  async function deletePostHandler(postId: number) {
    const response = await fetch(`/api/profile/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        postId: postId,
      }),
    });

    const deletedPost = (await response.json()) as Post;
    await router.push(`/profile/my-posts`);
    return deletedPost;
  }

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
          Sorry, try the <Link href="/profile/my-posts">My Posts page</Link>
        </SlideInFromRight>
      </div>
    );
  }

  return (
    <>
      <HeaderWithSession />

      <SlideInFromRight>
        <Head>
          <title>My Post</title>
          <meta name="description" content="My post" />
        </Head>

        <main css={mainStyles}>
          <form onSubmit={(event) => event.preventDefault()}>
            {onEdit ? (
              <div>
                <div css={imageContainer}>
                  {props.post.url.map((url) => (
                    <span key={`url-${url}`}>
                      <CldImage
                        src={url}
                        width="393px"
                        height="321px"
                        alt={props.post.title}
                      />
                    </span>
                  ))}
                </div>

                {!props.post.url[0] && (
                  <Image
                    src="/ramen-illustration.png"
                    width="393px"
                    height="321px"
                    alt="placeholder ramen illustration"
                  />
                )}

                <div css={titleContainer}>
                  <input
                    value={title}
                    autoComplete="off"
                    disabled={onEdit}
                    onChange={(event) => setTitle(event.currentTarget.value)}
                  />
                </div>

                <div css={tagNameContainer}>
                  <label htmlFor="restrictions">
                    <input
                      value={tagId}
                      checked
                      name="restrictions"
                      type="radio"
                      disabled={onEdit}
                      onChange={(event) =>
                        setTagId(Number(event.currentTarget.value))
                      }
                    />
                    {tagName}
                  </label>
                </div>
              </div>
            ) : (
              <div>
                <div css={uploadImagesContainer}>
                  {preview.length ? (
                    <div>
                      {preview.map((url) => (
                        <span key={`preview-${url}`}>
                          <CldImage
                            width="80px"
                            height="73px"
                            src={String(url)}
                            alt="preview"
                          />
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div>
                      {!preview[0] &&
                        props.post.url.map((url) => (
                          <span key={`url-${url}`}>
                            <CldImage
                              src={url}
                              width="80px"
                              height="73px"
                              alt={props.post.title}
                            />
                          </span>
                        ))}
                    </div>
                  )}

                  <br />
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      multiple
                    />
                  </div>
                </div>
                <div css={titleContainer}>
                  <input
                    value={title}
                    autoComplete="off"
                    disabled={onEdit}
                    onChange={(event) => setTitle(event.currentTarget.value)}
                  />
                </div>
                <div css={tagsOnEditContainer}>
                  {props.tags.map((tag) => {
                    return (
                      <div key={`tag-${tag.id}`}>
                        <label htmlFor="restrictions">
                          <input
                            name="restrictions"
                            type="radio"
                            value={tag.id}
                            onChange={(event) => {
                              setTagId(Number(event.currentTarget.value));
                              setTagName(tag.name);
                            }}
                          />
                          {tag.name}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <br />
            <div css={descriptionContainer}>
              <h2>Description</h2>
              <textarea
                value={description}
                autoComplete="off"
                placeholder="Description"
                disabled={onEdit}
                onChange={(event) => setDescription(event.currentTarget.value)}
              />

              <br />
            </div>

            <div css={locationContainer}>
              <input
                value={street}
                autoComplete="off"
                placeholder="Street"
                disabled={onEdit}
                onChange={(event) => setStreet(event.currentTarget.value)}
              />
            </div>

            <div css={districtAndPriceContainer}>
              {onEdit ? (
                <input
                  value={district}
                  disabled={onEdit}
                  name="district"
                  onChange={(event) =>
                    setDistrict(parseInt(event.currentTarget.value))
                  }
                />
              ) : (
                <input
                  value={district}
                  autoComplete="off"
                  name="district"
                  type="number"
                  onChange={(event) =>
                    setDistrict(parseInt(event.currentTarget.value))
                  }
                />
              )}

              <label htmlFor="price">
                €
                <input
                  css={priceInput}
                  value={price}
                  autoComplete="off"
                  disabled={onEdit}
                  type="number"
                  onChange={(event) =>
                    setPrice(parseInt(event.currentTarget.value))
                  }
                />
              </label>
            </div>

            <div css={messageContainer}>
              <p>{message}</p>
            </div>

            <div css={buttonContainer}>
              <button
                css={editButton}
                onClick={async () => {
                  if (onEdit) {
                    setOnEdit(false);
                    setButtonText('Save');
                    setMessage('');
                  } else {
                    setMessage('Changes are saved');
                    await savePostHandler(props.post.id);
                  }
                }}
              >
                {buttonText}
              </button>

              <button
                css={deleteButton}
                onClick={() => deletePostHandler(props.post.id)}
              >
                <Image
                  src="/bin.png"
                  width="22px"
                  height="25px"
                  alt="delete icon"
                />
              </button>
            </div>
          </form>
        </main>
      </SlideInFromRight>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const postId = parseIntFromContextQuery(context.query.postId);

  const foundPost = postId && (await getPostByPostId(postId));

  const tags = await getAllTags();

  if (typeof foundPost === 'undefined') {
    return {
      props: {
        error: 'Post not found',
      },
    };
  }

  return {
    props: {
      post: foundPost || null,
      tags,
    },
  };
}

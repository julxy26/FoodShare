import { css } from '@emotion/react';
import { CldImage } from 'next-cloudinary';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Transition } from '../../../components/Animations/Transition';
import HeaderWithSession from '../../../components/HeaderWithSession';
import { getAllTags, Tag } from '../../../database/tags';

const mainStyles = css`
  margin-top: 44px;
  padding-bottom: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 90vh;

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
    border: 1px solid #bcbcbc;
    transition: 0.3s ease-in-out;

    &:focus,
    &:active {
      outline: none;
    }
  }

  @media (max-height: 750px) {
    padding-top: 160px;
    margin-bottom: 165px;
  }
`;

const uploadImagesContainer = css`
  border: 1px solid #b2bfb6;
  border-radius: 15px;
  width: 180px;
  height: 162px;
  margin: 2px auto;
  margin-bottom: 30px;
  position: relative;

  span {
    gap: 4px;
    top: 5px;
    left: 10px;
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
    padding: 50px 0 0 0;
    transition: 0.3s ease-in-out;
    position: absolute;
    top: 35%;
    left: 36%;

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
  width: 309px;
  height: 30px;

  label {
    font-weight: 600;
  }

  input {
    margin-top: 3px;
    font-size: 16px;
    width: 348px;
  }
`;

const tagsContainer = css`
  display: flex;
  flex-direction: column;
  margin: 0px auto;
  width: 348px;

  div {
    justify-content: space-between;
    display: flex;
  }
  p {
    font-weight: 600;
    margin-bottom: 0;
    margin-top: 80px;
  }
  label {
    display: flex;
    margin-left: 0px;
    line-height: 39px;
  }

  input {
    margin-right: 8px;
    width: 13px;
  }
`;
const descriptionContainer = css`
  margin: 3px auto;
  margin-top: -3px;

  label {
    font-weight: 600;
  }

  textarea {
    margin-top: 3px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100px;
    width: 100%;
    font-family: 'Assistant';
    font-weight: 400;
    font-size: 16px;
    line-height: 21px;
    background: none;
    padding: 10px 20px;
    border: 1px solid #bcbcbc;
    border-radius: 15px;

    &:focus,
    &:active {
      outline: none;
    }
  }
`;

const locationContainer = css`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  margin-top: 25px;
  background-color: none;
  width: 309px;
  height: 30px;

  label {
    font-weight: 600;
  }

  input {
    margin-top: 3px;
    font-size: 16px;
    width: 348px;
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
    font-weight: 600;
  }
  label + label {
    margin-left: 13px;
  }
  input {
    font-size: 16px;
    width: 165px;
  }
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

const addButton = css`
  width: 160px;
  height: 38px;
  background-color: #c07e6e;
  padding-left: 20px;
  color: #fff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 30px;
  border: none;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  background-image: url('/add.png');
  background-repeat: no-repeat;
  background-size: 24px;
  background-position-y: center;
  background-position-x: 5px;
  transition: 0.3s ease-in-out;

  &:active {
    background-color: #e4b19b;
  }
`;

type Props = {
  tags: Tag[];
};

export type AddPostResponseBody =
  | { errors: { message: string }[] }
  | { user: { username: string } };

export default function AddPost(props: Props) {
  const [title, setTitle] = useState<string>('');
  const [price, setPrice] = useState<number>();
  const [description, setDescription] = useState<string>('');
  const [street, setStreet] = useState<string>('');
  const [district, setDistrict] = useState<number>();
  const [preview, setPreview] = useState<string[]>([]);
  const [tagId, setTagId] = useState<number>();
  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const router = useRouter();
  const [message, setMessage] = useState<string>('');

  async function addPostHandler() {
    const response = await fetch('/api/profile/posts', {
      method: 'POST',
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

    const addPostResponseBody = (await response.json()) as AddPostResponseBody;

    if ('errors' in addPostResponseBody) {
      setErrors(addPostResponseBody.errors);
      return console.log(addPostResponseBody.errors);
    }

    await router.push(`/profile/my-posts`);
    return addPostResponseBody;
  }

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

  return (
    <>
      <HeaderWithSession />

      <Transition>
        <Head>
          <title>Add new Post</title>
          <meta name="description" content="Add new Post" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main css={mainStyles}>
          <form onSubmit={(event) => event.preventDefault()}>
            <div css={uploadImagesContainer}>
              {preview.length < 5 ? (
                <div>
                  {preview.map((url) => (
                    <span key={`url-${url}`}>
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
                ''
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                multiple
              />
            </div>

            <div css={titleContainer}>
              <label htmlFor="title">
                Title
                <input
                  name="title"
                  autoComplete="false"
                  value={title}
                  onChange={(event) => {
                    setTitle(event.currentTarget.value);
                    setErrors([]);
                  }}
                />
              </label>
            </div>

            <div css={tagsContainer}>
              <p>Restrictions</p>
              <div>
                {props.tags.map((tag) => {
                  return (
                    <div key={`tag-${tag.id}`}>
                      <label htmlFor="tags">
                        <input
                          name="restrictions"
                          type="radio"
                          value={tag.id}
                          onChange={(event) => {
                            setTagId(Number(event.currentTarget.value));
                            setErrors([]);
                          }}
                        />
                        {tag.name}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            <div css={descriptionContainer}>
              <label htmlFor="description">
                Description
                <textarea
                  name="description"
                  autoComplete="off"
                  value={description}
                  onChange={(event) => {
                    setDescription(event.currentTarget.value);
                    setErrors([]);
                  }}
                />
              </label>
            </div>

            <div css={locationContainer}>
              <label htmlFor="street">
                Street
                <input
                  name="street"
                  autoComplete="off"
                  value={street}
                  onChange={(event) => {
                    setStreet(event.currentTarget.value);
                    setErrors([]);
                  }}
                />
              </label>
            </div>

            <div css={districtAndPriceContainer}>
              <label htmlFor="district">
                District
                <input
                  value={district}
                  autoComplete="off"
                  name="district"
                  type="number"
                  onChange={(event) => {
                    setDistrict(parseInt(event.currentTarget.value));
                    setErrors([]);
                  }}
                />
              </label>

              <label htmlFor="price">
                Price
                <input
                  name="price"
                  autoComplete="off"
                  pattern="[0-9]"
                  type="number"
                  value={price}
                  onChange={(event) => {
                    setPrice(parseInt(event.currentTarget.value));
                    setErrors([]);
                  }}
                />
              </label>
            </div>

            <div css={messageContainer}>
              {errors.map((error) => {
                return <p key={error.message}>{error.message}</p>;
              })}
            </div>

            <div css={messageContainer}>
              <p>{message}</p>
            </div>

            <div css={buttonContainer}>
              <button
                css={addButton}
                onClick={async () => {
                  await addPostHandler();
                  errors[0] && setMessage('Post added!');
                }}
              >
                Add post
              </button>
            </div>
          </form>
        </main>
      </Transition>
    </>
  );
}

export async function getServerSideProps() {
  const tags = await getAllTags();

  return {
    props: {
      tags,
    },
  };
}

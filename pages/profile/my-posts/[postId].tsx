import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Photo } from '../../../database/images';
import { getSinglePostByPostId, Post } from '../../../database/posts';
import { getAllTags, Tag } from '../../../database/tags';
import { parseIntFromContextQuery } from '../../../utils/contextQuery';

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
        urls: Photo['urls'];
        tagId: Tag['id'];
        name: Tag['name'];
      };
      tags: Tag[];
    }
  | {
      error: string;
    };

export default function SingleUserPost(props: Props) {
  if ('error' in props) {
    return (
      <div>
        <Head>
          <title>Post not found</title>
          <meta name="description" content="Post not found" />
        </Head>
        <h1>{props.error}</h1>
        Sorry, try the <Link href="/profile/my-posts">My Posts page</Link>
      </div>
    );
  }

  const [title, setTitle] = useState<string>(props.post.title);
  const [price, setPrice] = useState<number>(props.post.price);
  const [description, setDescription] = useState<string>(
    props.post.description,
  );
  const [street, setStreet] = useState<string>(props.post.street);
  const [district, setDistrict] = useState<number>(props.post.district);
  const [imageUrls, setImageUrls] = useState(props.post.urls);
  const [tagId, setTagId] = useState(props.post.tagId);
  const [tagName, setTagName] = useState(props.post.name);

  const [buttonText, setButtonText] = useState('Edit');
  const [savedMessage, setSavedMessage] = useState('');

  const [onEdit, setOnEdit] = useState<boolean>(true);
  const router = useRouter();

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
        urls: imageUrls,
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

  return (
    <div>
      <Head>
        <title>{props.post.title}</title>
        <meta name="description" content={`${props.post.title}`} />
      </Head>

      <main>
        <form onSubmit={(event) => event.preventDefault()}>
          <input
            value={title}
            autoComplete="off"
            disabled={onEdit}
            onChange={(event) => setTitle(event.currentTarget.value)}
          />

          <button onClick={() => deletePostHandler(props.post.id)}>
            Delete
          </button>
          <br />

          {onEdit ? (
            <div>
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
          ) : (
            props.tags.map((tag) => {
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
            })
          )}

          <br />
          <Image src={props.post.urls} alt="" width="300px" height="300px" />
          <br />
          <input
            value={price}
            autoComplete="off"
            disabled={onEdit}
            type="number"
            onChange={(event) => setPrice(parseInt(event.currentTarget.value))}
          />
          <br />
          <input
            value={description}
            autoComplete="off"
            disabled={onEdit}
            onChange={(event) => setDescription(event.currentTarget.value)}
          />
          <br />
          <input
            value={street}
            autoComplete="off"
            disabled={onEdit}
            onChange={(event) => setStreet(event.currentTarget.value)}
          />
          <br />

          {onEdit ? (
            <select
              defaultValue={district}
              disabled={onEdit}
              name="district"
              onChange={(event) =>
                setDistrict(parseInt(event.currentTarget.value))
              }
            >
              <option value={district}>{district}</option>
            </select>
          ) : (
            <select
              defaultValue={district}
              name="district"
              onChange={(event) =>
                setDistrict(parseInt(event.currentTarget.value))
              }
            >
              <option value={district} hidden>
                {district}
              </option>
              <option value="1010">1010</option>
              <option value="1020">1020</option>
              <option value="1030">1030</option>
              <option value="1040">1040</option>
              <option value="1050">1050</option>
              <option value="1060">1060</option>
              <option value="1070">1070</option>
              <option value="1080">1080</option>
              <option value="1090">1090</option>
              <option value="1100">1100</option>
              <option value="1110">1110</option>
              <option value="1120">1120</option>
              <option value="1130">1130</option>
              <option value="1140">1140</option>
              <option value="1150">1150</option>
              <option value="1160">1160</option>
              <option value="1170">1170</option>
              <option value="1180">1180</option>
              <option value="1190">1190</option>
              <option value="1200">1200</option>
              <option value="1210">1210</option>
              <option value="1220">1220</option>
              <option value="1230">1230</option>
            </select>
          )}

          <br />
          <button
            onClick={() => {
              if (onEdit) {
                setOnEdit(false);
                setButtonText('Save');
                setSavedMessage('');
              } else {
                setSavedMessage('Changes are saved');
                savePostHandler(props.post.id);
              }
            }}
          >
            {buttonText}
          </button>
          {savedMessage}
        </form>
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const postId = parseIntFromContextQuery(context.query.postId);

  const foundPost = postId && (await getSinglePostByPostId(postId));

  if (typeof foundPost === 'undefined') {
    context.res.statusCode = 404;
    return {
      props: {
        error: 'Post not found',
      },
    };
  }

  const tags = await getAllTags();

  return {
    props: {
      post: foundPost,
      tags,
    },
  };
}

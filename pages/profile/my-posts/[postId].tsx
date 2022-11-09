import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getSinglePostByPostId, Post } from '../../../database/posts';
import { parseIntFromContextQuery } from '../../../utils/contextQuery';

type Props = {
  post: {
    id: number;
    title: string;
    price: number;
    description: string;
    street: string;
    district: number;
    userId: number;
    imageUrls: string | null;
  };
};

export default function SingleUserPost(props: Props) {
  const [title, setTitle] = useState<string>(props.post.title);
  const [price, setPrice] = useState<number>(props.post.price);
  const [description, setDescription] = useState<string>(
    props.post.description,
  );
  const [street, setStreet] = useState<string>(props.post.street);
  const [district, setDistrict] = useState<number>(props.post.district);
  const [imageUrls, setImageUrls] = useState([]);

  const [buttonText, setButtonText] = useState('Edit');

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
        imageUrls: imageUrls,
      }),
    });
    const updatedPostFromApi = (await response.json()) as Post;
    setOnEdit(true);
    setButtonText('Edit');
    return updatedPostFromApi;
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

  if (!props.post) {
    return (
      <div>
        <Head>
          <title>Post not found</title>
          <meta name="description" content="Post not found" />
        </Head>
        <main>
          <h1>Post not found</h1>
          Sorry, try the <Link href="/profile/my-posts">My Posts page</Link>
        </main>
      </div>
    );
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
          <Image src="/placeholder2.jpg" alt="" width="200" height="200" />
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
          <input
            value={district}
            autoComplete="off"
            disabled={onEdit}
            type="number"
            onChange={(event) =>
              setDistrict(parseInt(event.currentTarget.value))
            }
          />
          <br />
          <button
            onClick={() => {
              if (onEdit) {
                setOnEdit(false);
                setButtonText('Save');
              } else {
                savePostHandler(props.post.id);
              }
            }}
          >
            {buttonText}
          </button>
        </form>
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const postId = parseIntFromContextQuery(context.query.postId);

  if (typeof postId === 'undefined') {
    context.res.statusCode = 404;
    return {
      props: {
        error: 'Post not found',
      },
    };
  }
  const foundPost = await getSinglePostByPostId(postId);

  if (typeof foundPost === undefined) {
    context.res.statusCode = 404;
  }

  return {
    props: {
      post: foundPost,
    },
  };
}

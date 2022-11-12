import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Photo } from '../../../database/images';
import { getSinglePostByPostId, Post } from '../../../database/posts';
import { Tag } from '../../../database/tags';
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
    urls: Photo['urls'];
    name: Tag['name'];
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
  const [tag, setTag] = useState(props.post.name);

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
        imageUrls: imageUrls,
        tag: tag,
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

          <input
            value={tag}
            autoComplete="off"
            disabled={onEdit}
            onChange={(event) => setTag(event.currentTarget.value)}
          />

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
  console.log(foundPost);

  return {
    props: {
      post: foundPost,
    },
  };
}

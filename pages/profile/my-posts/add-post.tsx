import { css } from '@emotion/react';
import { redirect } from 'next/dist/server/api-utils';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import UploadImage, { Props } from '../../../components/UploadImage';
import { Post } from '../../../database/posts';

export default function AddPost(props: Props) {
  const [title, setTitle] = useState<string>('');
  const [price, setPrice] = useState<number>();
  const [description, setDescription] = useState<string>('');
  const [street, setStreet] = useState<string>('');
  const [district, setDistrict] = useState<number>();
  const [imageUrls, setImageUrls] = useState([]);

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
        imageUrls: imageUrls,
      }),
    });

    const postsFromApi = (await response.json()) as Post;

    return postsFromApi;
  }

  return (
    <div>
      <Head>
        <title>Add new Post</title>
        <meta name="description" content="Add new Post" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>New post</h1>

        <form onSubmit={(event) => event.preventDefault()}>
          <div>
            <UploadImage setImageUrl={props.setImageUrl} />
          </div>

          <label htmlFor="title">Title</label>
          <input
            name="title"
            autoComplete="false"
            value={title}
            onChange={(event) => setTitle(event.currentTarget.value)}
          />
          <br />
          <label htmlFor="price">Price</label>
          <input
            name="price"
            autoComplete="off"
            type="number"
            value={price}
            onChange={(event) => setPrice(parseInt(event.currentTarget.value))}
          />
          <br />
          <label htmlFor="description">Description</label>
          <input
            name="description"
            autoComplete="false"
            value={description}
            onChange={(event) => setDescription(event.currentTarget.value)}
          />
          <br />
          <label htmlFor="street">Street</label>
          <input
            name="street"
            autoComplete="false"
            value={street}
            onChange={(event) => setStreet(event.currentTarget.value)}
          />
          <br />
          <label htmlFor="district">District</label>
          <select
            name="district"
            onChange={(event) =>
              setDistrict(parseInt(event.currentTarget.value))
            }
          >
            <option value="" selected disabled hidden>
              Choose here
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
          <br />

          <button onClick={() => addPostHandler()}>
            <Link href="/profile/my-posts">Add</Link>
          </button>
        </form>
      </main>
    </div>
  );
}

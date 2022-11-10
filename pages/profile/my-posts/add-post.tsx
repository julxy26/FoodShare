import { css } from '@emotion/react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function AddPost() {
  const [title, setTitle] = useState<string>('');
  const [price, setPrice] = useState<number>();
  const [description, setDescription] = useState<string>('');
  const [street, setStreet] = useState<string>('');
  const [district, setDistrict] = useState<number>();
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
  const [imageLink, setImageLink] = useState('');
  const router = useRouter();

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
        urls: imageLink,
      }),
    });

    const postsFromApi = await response.json();
    await router.push(`/profile/my-posts`);
    return postsFromApi;
  }

  const handleFileChange = async (e: any) => {
    const newFile = e.target.files[0];
    if (!newFile) return;

    setPreview(URL.createObjectURL(newFile));

    const formData = new FormData();
    formData.append('file', newFile);
    formData.append('upload_preset', 'foodShare');

    const data = await fetch(
      'https://api.cloudinary.com/v1_1/dezeipn4z/image/upload',
      {
        method: 'POST',
        body: formData,
      },
    )
      .then((res) => res.json())
      .then((data) => {
        setImageLink(data.secure_url);
      })
      .catch((error) => console.log(error));
  };

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
            <label htmlFor="file">Upload an image</label>
            <input
              id="file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {!!preview && (
              <Image
                width={100}
                height={100}
                src={String(preview)}
                alt="preview"
              />
            )}
          </div>

          <label htmlFor="title">Title</label>
          <br />
          <input
            name="title"
            autoComplete="false"
            value={title}
            onChange={(event) => setTitle(event.currentTarget.value)}
          />
          <br />
          <label htmlFor="price">Price</label>
          <br />
          <input
            name="price"
            autoComplete="off"
            type="number"
            value={price}
            onChange={(event) => setPrice(parseInt(event.currentTarget.value))}
          />
          <br />
          <label htmlFor="description">Description</label>
          <br />
          <textarea
            name="description"
            autoComplete="off"
            value={description}
            onChange={(event) => setDescription(event.currentTarget.value)}
          />
          <br />
          <label htmlFor="street">Street</label>
          <br />
          <input
            name="street"
            autoComplete="on"
            value={street}
            onChange={(event) => setStreet(event.currentTarget.value)}
          />
          <br />
          <label htmlFor="district">District</label>
          <br />
          <select
            defaultValue=""
            name="district"
            onChange={(event) =>
              setDistrict(parseInt(event.currentTarget.value))
            }
          >
            <option value="" disabled hidden>
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

          <button onClick={async () => await addPostHandler()}>Add</button>
        </form>
      </main>
    </div>
  );
}

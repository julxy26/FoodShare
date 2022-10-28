import { sql } from './connect';

export type Post = {
  id: number;
  title: string;
  price: number;
  description: string;
  street: string;
  district: number;
  userId: number;
  imageUrl: string | null;
};

export async function getSinglePostByPostId(id: number) {
  const [post] = await sql<
    {
      title: string;
      price: number;
      description: string;
      street: string;
      district: number;
      imageUrl: string | null;
    }[]
  >`
  SELECT
    title,
    price,
    description,
    street,
    district,
    image_url
  FROM
    posts
  WHERE
    posts.id = ${id}
  `;

  return post;
}

export async function getPostsByUserId(userId: number) {
  const [posts] = await sql<
    {
      title: string;
      price: number;
      description: string;
      street: string;
      district: number;
      imageUrl: string | null;
    }[]
  >`
  SELECT
    title,
    price,
    description,
    street,
    district,
    image_url
  FROM
    posts,
    users
  WHERE
    users.id = ${userId}
  `;

  return posts;
}

export async function createPost(
  title: string,
  price: number,
  description: string,
  street: string,
  district: number,
  user_id: number,
  image_url: string,
) {
  const [post] = await sql<
    {
      title: string;
      price: number;
      description: string;
      street: string;
      district: number;
      imageUrl: string | null;
    }[]
  >`
  INSERT INTO posts
    (title, price, description, street, district, user_id, image_url)
  VALUES
    (${title}, ${price}, ${description}, ${street}, ${district}, ${user_id}, ${image_url})
  RETURNING
    title,
    price,
    description,
    street,
    district,
    image_url
  `;

  return post;
}

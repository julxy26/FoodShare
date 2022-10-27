import { sql } from './connect';

export type Posts = {
  id: number;
  title: string;
  price: number;
  description: string;
  street: string;
  district: number;
  userId: number;
  imageUrl: string;
};

export async function getPostsByUserId(userId: number) {
  const [posts] = await sql<
    {
      title: string;
      price: number;
      description: string;
      street: string;
      district: number;
      imageUrl: string;
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
      imageUrl: string;
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

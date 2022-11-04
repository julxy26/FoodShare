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
}[];

export async function deleteSinglePostByPostId(id: number) {
  const [post] = await sql<Post[]>`
    DELETE FROM
      posts
    WHERE
      id = ${id}
    RETURNING
      *
  `;
  return post;
}

export async function updateSinglePostById(
  title: string,
  price: number,
  description: string,
  street: string,
  district: number,
  imageUrl: string,
) {
  const [post] = await sql<Post[]>`
    UPDATE
      posts
    SET
    title = ${title},
    price = ${price},
    description = ${description},
    street = ${street},
    district = ${district},
    image_url = ${imageUrl}

    WHERE
      id = posts.id

    RETURNING *
  `;
  return post;
}

export async function getSinglePostByPostId(id: number) {
  const [post] = await sql<Post[]>`
  SELECT
    *
  FROM
    posts
  WHERE
    id = ${id}
  `;

  return post;
}

export async function getPostsByUserId(userId: number) {
  const posts = await sql<Post[]>`
  SELECT
    posts.id,
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
    ${userId} = posts.user_id
  `;

  if (!posts) return undefined;

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

import { sql } from './connect';

export type Post = {
  id: number;
  title: string;
  price: number;
  description: string;
  street: string;
  district: number;
  userId: number;
  imageUrls: string[] | null;
}[];

export async function getAllPosts() {
  const posts = await sql<Post[]>`
  SELECT
    id,
    title,
    price,
    description,
    street,
    district
  FROM
    posts
`;
  return posts;
}

export async function deletePostByPostId(id: number) {
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
  imageUrls: string[],
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
    image_urls = ${imageUrls}

    WHERE
      id = posts.id

    RETURNING *
  `;
  return post;
}

export async function getSinglePostByPostId(postId: number) {
  const [post] = await sql<Post[]>`
  SELECT
    *
  FROM
    posts
  WHERE
    id = ${postId}
  `;

  return post;
}

export async function getPostsByUserId(userId: number) {
  const posts = await sql<Post[]>`
  SELECT
    id,
    title,
    price,
    description,
    street,
    district,
    image_urls
  FROM
    posts
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
  image_urls: string[],
) {
  const post = await sql<
    {
      title: string;
      price: number;
      description: string;
      street: string;
      district: number;
      imageUrls: string;
    }[]
  >`
  INSERT INTO posts
    (title, price, description, street, district, user_id, image_urls)
  VALUES
    (${title}, ${price}, ${description}, ${street}, ${district}, ${user_id}, ${image_urls})
  RETURNING
    title,
    price,
    description,
    street,
    district,
    image_urls
  `;

  return post;
}

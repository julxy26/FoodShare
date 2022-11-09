import { sql } from './connect';
import { User } from './users';

export type Post = {
  id: number;
  title: string;
  price: number;
  description: string;
  street: string;
  district: number;
  userId: number;
};

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
) {
  const [post] = await sql<Post[]>`
    UPDATE
      posts
    SET
    title = ${title},
    price = ${price},
    description = ${description},
    street = ${street},
    district = ${district}
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
    district
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
  user_id: User['id'],
): Promise<any> {
  const post = await sql<
    {
      title: string;
      price: number;
      description: string;
      street: string;
      district: number;
    }[]
  >`
  INSERT INTO posts
    (title, price, description, street, district, user_id)
  VALUES
    (${title}, ${price}, ${description}, ${street}, ${district}, ${user_id})
  RETURNING
    *
  `;
  console.log(post);
  return post;
}

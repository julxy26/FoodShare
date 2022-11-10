import { sql } from './connect';
import { User } from './users';

export type Post = {
  id: number;
  title: string;
  price: number;
  description: string;
  street: string;
  district: number;
  userId: User['id'];
}[];

export async function getAllPosts() {
  const posts = await sql<Post[]>`
  SELECT
    posts.*,
    images.urls
  FROM
    posts,
    images
  WHERE
    images.post_id = posts.id
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

    RETURNING
      *
  `;
  return post;
}

export async function getSinglePostByPostId(postId: number) {
  const [post] = await sql<Post[]>`
  SELECT
    posts.*,
    images.urls
  FROM
    posts,
    images
  WHERE
    posts.id = ${postId}
  AND
    images.post_id = posts.id
  `;

  return post;
}

export async function getPostsByUserId(userId: number): Promise<any> {
  const posts = await sql<Post[]>`
  SELECT
    posts.*,
    images.urls
  FROM
    users,
    posts,
    images
  WHERE
    ${userId} = users.id
  AND
    images.post_id = posts.id
  AND
    posts.user_id = users.id
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
  return post;
}

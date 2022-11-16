import { sql } from './connect';
import { Photo } from './images';
import { Tag } from './tags';
import { User } from './users';

export type Post = {
  id: number;
  title: string;
  price: number;
  description: string;
  street: string;
  district: number;
  userId: User['id'];
};

export type PostWithImageAndTag = {
  id: number;
  title: string;
  price: number;
  description: string;
  street: string;
  district: number;
  userId: User['id'];
  imageUrl: Photo['urls'];
  tagId: Tag['id'];
};

export async function getAllPosts() {
  const posts = await sql<Post[]>`
   SELECT
    posts.*,
    images.urls,
    tags.*,
    posts_tags.*
  FROM
    posts,
    images,
    tags,
    posts_tags
  WHERE
    images.post_id = posts.id
  AND
    posts.id = posts_tags.post_id
  AND
    tags.id = posts_tags.tag_id
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
  id: number,
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
      id = ${id}
    RETURNING
      *
  `;
  return post;
}

export async function getSinglePostByPostId(postId: Post['id']) {
  const [post] = await sql<Post[]>`
  SELECT
    posts.*,
    images.urls,
    tags.name,
    posts_tags.*
  FROM
    posts,
    images,
    tags,
    posts_tags
  WHERE
    posts.id = ${postId}
  AND
    images.post_id = posts.id
  AND
    posts.id = posts_tags.post_id
  AND
    tags.id = posts_tags.tag_id
  `;

  return post;
}

export async function getPostsByUserId(userId: Post['userId']): Promise<any> {
  const posts = await sql<Post[]>`
  SELECT
    posts.*,
    images.urls,
    tags.name,
    posts_tags.*
  FROM
    users,
    posts,
    images,
    tags,
    posts_tags
  WHERE
    ${userId} = users.id
  AND
    images.post_id = posts.id
  AND
    posts.user_id = users.id
  AND
    posts.id = posts_tags.post_id
  AND
    tags.id = posts_tags.tag_id
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

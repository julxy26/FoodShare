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
  imageUrl: Photo['url'];
  tagId: Tag['id'];
};

export async function getPostsWithLimit(limit: number) {
  const posts = await sql<Post[]>`
   SELECT
    posts.*,
    tags.*,
    posts_tags.*
  FROM
    posts,
    tags,
    posts_tags
  WHERE
    posts.id = posts_tags.post_id
  AND
    tags.id = posts_tags.tag_id
  ORDER BY
    posts.id DESC
  LIMIT
    ${limit}
  `;
  const rawImages = posts.map((post) => {
    return sql<any[]>`
  SELECT
    url
  FROM
    images
  WHERE
    post_id = ${post.id}
  `;
  });

  const urls = await Promise.all(rawImages);

  const fullPosts = posts.map((post, index) => {
    return { ...post, url: urls[index]?.map((obj) => obj.url) };
  });

  if (!fullPosts) return undefined;

  return fullPosts;
}

export async function getAllPosts() {
  const posts = await sql<Post[]>`
   SELECT
    posts.*,
    tags.*,
    posts_tags.*
  FROM
    posts,
    tags,
    posts_tags
  WHERE
    posts.id = posts_tags.post_id
  AND
    tags.id = posts_tags.tag_id
  ORDER BY
    posts.id DESC
  `;

  const rawImages = posts.map((post) => {
    return sql<any[]>`
select url from images where  post_id = ${post.id}
`;
  });

  const urls = await Promise.all(rawImages);

  const fullPosts = posts.map((post, index) => {
    return { ...post, url: urls[index]?.map((obj) => obj.url) };
  });

  if (!fullPosts) return undefined;

  return fullPosts;
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

export async function updatePostById(
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

export async function getPostByPostId(postId: Post['id']) {
  const [post] = await sql<Post[]>`
  SELECT
    posts.*,
    tags.name,
    posts_tags.*
  FROM
    posts,
    tags,
    posts_tags
  WHERE
    posts.id = ${postId}
  AND
    posts.id = posts_tags.post_id
  AND
    tags.id = posts_tags.tag_id
  `;
  const rawImages = await sql<any[]>`
  SELECT
    url
  FROM
    images
  WHERE
    post_id = ${postId}
  `;

  const urls = await Promise.all(rawImages);

  const fullPost = { ...post, url: urls.map((obj: any) => obj.url) };

  if (!fullPost) return undefined;

  return fullPost;
}

export async function getPostsByUserId(userId: Post['userId']): Promise<any> {
  const posts = await sql<Post[]>`
  SELECT
    posts.*,
    tags.name,
    posts_tags.*
  FROM
    users,
    posts,
    tags,
    posts_tags
  WHERE
    ${userId} = users.id
  AND
    posts.user_id = users.id
  AND
    posts.id = posts_tags.post_id
  AND
    tags.id = posts_tags.tag_id
  ORDER BY
    posts.id DESC
  `;

  // loop over each post and get an array of promises with the urls for each post
  const rawImages = posts.map((post) => {
    return sql<any[]>`
  select url from images where  post_id = ${post.id}
  `;
  });

  // await until all the promises resolve
  const urls = await Promise.all(rawImages);

  // loop over the posts and add the array of images that correspond to them matching by index
  const fullPosts = posts.map((post, index) => {
    return { ...post, url: urls[index]?.map((obj) => obj.url) };
  });

  if (!fullPosts) return undefined;

  return fullPosts;
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

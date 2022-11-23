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
  userId: number;
}[];

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
  const posts = await sql<
    {
      id: number;
      title: string;
      price: number;
      description: string;
      street: string;
      district: number;
      userId: number | null;
    }[]
  >`
   SELECT
    posts.*
  FROM
    posts
  INNER JOIN
    posts_tags ON  posts.id = posts_tags.post_id
  ORDER BY
    posts.id DESC
  LIMIT
    ${limit}
  `;
  const rawImages = posts.map((post) => {
    return sql<{ url: string }[]>`
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

  if (!fullPosts[0]) return undefined;

  return fullPosts;
}

export async function getAllPosts() {
  const posts = await sql<
    {
      id: number;
      title: string;
      price: number;
      description: string;
      street: string;
      district: number;
      userId: number | null;
    }[]
  >`
   SELECT
    posts.*
  FROM
    posts
  INNER JOIN
    posts_tags ON posts.id = posts_tags.post_id
  ORDER BY
    posts.id DESC
  `;

  const rawImages = posts.map((post) => {
    return sql<{ url: string }[]>`
  SELECT url FROM images WHERE  post_id = ${post.id}
`;
  });

  const rawTags = posts.map((post) => {
    return sql<{ name: string }[]>`
  SELECT
    tags.name
  FROM
    posts_tags, tags
  WHERE
    posts_tags.post_id = ${post.id}
  AND
    tags.id = posts_tags.tag_id
`;
  });
  const urls = await Promise.all(rawImages);

  const tags = await Promise.all(rawTags);

  const fullPosts = posts.map((post, index) => {
    return {
      ...post,
      name: tags[index]?.map((obj) => obj.name),
      url: urls[index]?.map((obj) => obj.url),
    };
  });

  if (!fullPosts[0]) return undefined;

  return fullPosts;
}

export async function deletePostByPostId(id: number) {
  const [post] = await sql<
    {
      id: number;
      title: string;
      price: number;
      description: string;
      street: string;
      district: number;
      userId: number | null;
    }[]
  >`
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
  const [post] = await sql<
    {
      id: number;
      title: string;
      price: number;
      description: string;
      street: string;
      district: number;
      userId: number | null;
    }[]
  >`
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

export async function getPostByPostId(postId: number): Promise<object> {
  const [post] = await sql<
    {
      id: number;
      title: string;
      price: number;
      description: string;
      street: string;
      district: number;
      userId: number | null;
    }[]
  >`
  SELECT
    posts.*
  FROM
    posts
  INNER JOIN
    posts_tags ON posts_tags.post_id = posts.id
  WHERE
    posts.id = ${postId}
  ORDER BY
    posts.id DESC
  `;

  const rawImages = await sql<{ url: string }[]>`
  SELECT
    url
  FROM
    images
  WHERE
    post_id = ${post!.id}
`;

  const rawTag = await sql<{ name: string }[]>`
  SELECT
    tags.name
  FROM
    posts_tags, tags
  WHERE
    posts_tags.post_id = ${post!.id}
  AND
    tags.id = posts_tags.tag_id
`;

  const urls = await Promise.all(rawImages as { url: string }[]);

  const tag = await Promise.all(rawTag);

  const fullPost = {
    ...post,
    name: tag[0]?.name,
    url: urls.map((obj) => obj.url),
  };

  return fullPost;
}

export async function getPostsByUserId(userId: number): Promise<object> {
  const posts = await sql<
    {
      id: number;
      title: string;
      price: number;
      description: string;
      street: string;
      district: number;
      userId: number | null;
    }[]
  >`
  SELECT
    posts.*
  FROM
    posts
  INNER JOIN
    users ON ${userId} = users.id
  WHERE
    ${userId} = users.id
  ORDER BY
    posts.id DESC
  `;

  // loop over each post and get an array of promises with the urls for each post
  const rawImages = posts.map((post) => {
    return sql<{ url: string }[]>`
  SELECT url FROM images WHERE  post_id = ${post.id}
`;
  });

  const rawTags = posts.map((post) => {
    return sql<{ name: string }[]>`
  SELECT
    tags.name
  FROM
    posts_tags, tags
  WHERE
    posts_tags.post_id = ${post.id}
  AND
    tags.id = posts_tags.tag_id
`;
  });
  // await until all the promises resolve
  const urls = await Promise.all(rawImages);

  const tags = await Promise.all(rawTags);

  // loop over the posts and add the array of images that correspond to them matching by index
  const fullPosts = posts.map((post, index) => {
    return {
      ...post,
      name: tags[index]?.map((obj) => obj.name),
      url: urls[index]?.map((obj) => obj.url),
    };
  });
  return fullPosts;
}

export async function createPost(
  title: string,
  price: number,
  description: string,
  street: string,
  district: number,
  user_id: User['id'],
) {
  const post = await sql<
    {
      id: number;
      title: string;
      price: number;
      description: string;
      street: string;
      district: number;
      userId: number | null;
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

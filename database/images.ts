import { sql } from './connect';

export type Photo = {
  id: number;
  postId: number;
  urls: string;
}[];

export async function getImagesByPostId(postId: number) {
  const images = await sql<Photo[]>`
  SELECT
    post_id,
    urls
  FROM
    posts,
    images
  WHERE
    ${postId} = posts.id
  `;

  if (!images) return undefined;

  return images;
}

export async function createImage(post_id: number, urls: string) {
  const image = await sql<Photo[]>`
  INSERT INTO images
    (post_id, urls)
  VALUES
    (${post_id}, ${urls})
  RETURNING
    *
  `;

  return image;
}

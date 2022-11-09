import { sql } from './connect';
import { Post } from './posts';

export type Photo = {
  id: number;
  postId: Post['id'];
  urls: string;
}[];

export async function getImagesByPostId(postId: Post['id']) {
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

export async function createImage(post_id: Post['id'], urls: string) {
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

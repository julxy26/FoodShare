import { sql } from './connect';
import { Post } from './posts';

export type Photo = {
  id: number;
  postId: number;
  urls: string;
};

export async function getAllImages() {
  const images = await sql<Photo[]>`
  SELECT
    *
  FROM
    images
`;
  return images;
}

export async function updateImages(postId: Post['id'], urls: string) {
  const [image] = await sql<Photo[]>`
UPDATE
  images
SET
  urls = ${urls}
FROM
  posts
WHERE
  ${postId} = images.post_id
RETURNING
  *
`;
  return image;
}

export async function createImage(post_id: number, urls: string) {
  const photo = await sql<Photo[]>`
  INSERT INTO images
    (post_id, urls)
  VALUES
    (${post_id}, ${urls})
  RETURNING
    *
  `;

  return photo;
}

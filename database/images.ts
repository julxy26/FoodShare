import { sql } from './connect';

export type Photo = {
  id: number;
  postId: number;
  url: string;
};

export async function getImageIdByPost(postId: number) {
  const [image] = await sql<{ id: number }[]>`
  SELECT
    id
  FROM
    images
  WHERE
    post_id = ${postId}
  `;
  return image;
}

export async function getAllImages() {
  const images = await sql<
    { id: number; postId: number | null; url: string }[]
  >`
  SELECT
    *
  FROM
    images
`;
  return images;
}

export async function updateImages(postId: number, url: Photo['url']) {
  const image = await sql<{ url: string }[]>`
UPDATE
  images
SET
  url = ${url}
WHERE
  ${postId} = post_id
RETURNING
  url
`;
  return image;
}

export async function createImage(post_id: number, url: string) {
  const photo = await sql<{ id: number; postId: number | null; url: string }[]>`
  INSERT INTO images
    (post_id, url)
  VALUES
    (${post_id}, ${url})
  RETURNING
    *
  `;

  return photo;
}

export async function deleteImagesByPostId(postId: number) {
  const [image] = await sql<
    { id: number; postId: number | null; url: string }[]
  >`
    DELETE FROM
      images
    WHERE
      post_id = ${postId}
    RETURNING
      *
  `;
  return image;
}

import { sql } from './connect';
import { Post } from './posts';

export type Photo = {
  id: number;
  postId: number;
  url: string;
};

export async function getImageIdByPost(postId: Post['id']) {
  const [image] = await sql<Photo[]>`
  SELECT
    id,
  FROM
    images
  WHERE
    post_id = ${postId}
  `;
  return image;
}

export async function getAllImages() {
  const images = await sql<Photo[]>`
  SELECT
    *
  FROM
    images
`;
  return images;
}

export async function updateImages(postId: Post['id'], url: Photo['url']) {
  const image = await sql<Photo[]>`
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
  const photo = await sql<Photo[]>`
  INSERT INTO images
    (post_id, url)
  VALUES
    (${post_id}, ${url})
  RETURNING
    *
  `;

  return photo;
}

export async function deleteImagesByPostId(postId: Post['id']) {
  const [image] = await sql<Post[]>`
    DELETE FROM
      images
    WHERE
      post_id = ${postId}
    RETURNING
      *
  `;
  return image;
}

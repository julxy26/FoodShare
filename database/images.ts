import { sql } from './connect';

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

// export async function getImagesByPostId(postId: number) {
//   const [photos] = await sql<Photo[]>`
//   SELECT
//     posts.id as post_id,
//     images.urls as urls
//   FROM
//     posts,
//     images
//   WHERE
//     ${postId} = posts.id
//   AND
//     ${postId} = post_id
//   `;

//   if (!photos) return undefined;

//   return photos;
// }

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

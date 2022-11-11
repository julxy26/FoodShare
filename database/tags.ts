import { sql } from './connect';
import { Post } from './posts';

export type Tag = {
  id: number;
  name: string;
};

type postsTag = {
  id: number;
  postId: number;
  tagId: number;
};

export async function createPostsTags(postId: number, tagId: number) {
  const postsTag = await sql<postsTag[]>`
  INSERT INTO posts_tags
    (post_id, tag_id)
  SELECT
    (${postId}), (${tagId})
  RETURNING
    *
  `;
  return postsTag;
}

export async function getAllTags() {
  const tags = await sql<Tag[]>`
  SELECT
    *
  FROM
    tags
  `;

  return tags;
}

export async function getTagIdByTagName(name: string) {
  const tagId = await sql<Tag[]>`
  SELECT
    id
  FROM
    tags
  WHERE
    ${name} = tags.name
  `;
  return tagId;
}

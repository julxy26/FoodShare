import { sql } from './connect';
import { Post } from './posts';

export type Tag = {
  id: number;
  name: string;
};

export async function updateTag(postId: number, tagId: Tag['id']) {
  const tag = await sql<{ tagId: number | null; postId: number | null }[]>`
UPDATE
  posts_tags
SET
  tag_id = tags.id
FROM
  posts,
  tags
WHERE
  ${postId} = posts_tags.post_id
AND
  tags.id = ${tagId}

RETURNING
  posts_tags.tag_id,
  posts_tags.post_id
`;

  return tag;
}

export async function createPostsTags(postId: number, tagId: number) {
  const postsTag = await sql<
    { id: number; postId: number | null; tagId: number | null }[]
  >`
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
  const tagId = await sql<{ id: number }[]>`
  SELECT
    id
  FROM
    tags
  WHERE
    ${name} = tags.name
  `;
  return tagId;
}

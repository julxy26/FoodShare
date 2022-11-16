import { sql } from './connect';
import { Post } from './posts';

export type Tag = {
  id: number;
  name: string;
};

type PostsTag = {
  id: number;
  postId: number;
  tagId: number;
};

export async function updateTag(postId: Post['id'], tagId: Tag['id']) {
  const tag = await sql<PostsTag[]>`
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
  *

`;

  return tag;
}

export async function createPostsTags(postId: number, tagId: number) {
  const postsTag = await sql<PostsTag[]>`
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

import { sql } from './connect';

export type Tag = {
  id: number;
  name: string;
};

export async function getAllTags() {
  const tags = await sql<Tag[]>`
  SELECT
    *
  FROM
    tags
  `;

  return tags;
}

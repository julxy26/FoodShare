import { sql } from './connect';

export type Tag = {
  id: number;
  name: string;
};

export async function createTag(id: number, name: string) {
  const [tag] = await sql<
    {
      name: string;
    }[]
  >`
  INSERT INTO tags
    (name)
  VALUES
    (${name})
  RETURNING
    name
  `;

  return tag;
}

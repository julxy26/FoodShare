export async function up(sql) {
  await sql`
    CREATE TABLE posts_tags (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      post_id integer REFERENCES posts (id) ON DELETE CASCADE,
      tag_id integer REFERENCES tags (id)
    )
  `;
}

export async function down(sql) {
  await sql`
    DROP TABLE posts_tags
  `;
}

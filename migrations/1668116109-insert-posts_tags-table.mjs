export async function up(sql) {
  await sql`
    INSERT INTO posts_tags
      (post_id, tag_id)
    SELECT
      posts.id, tags.id
    FROM posts cross join tags
  `;
}

export async function down(sql) {
  await sql`
      DELETE FROM
				posts_tags
      USING
        posts, tags
      WHERE
        post_id = posts.id
      AND
        tag_id = tags.id
    `;
}

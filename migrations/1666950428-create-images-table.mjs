export async function up(sql) {
  await sql`
    CREATE TABLE images (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      post_id integer REFERENCES posts (id) ON DELETE CASCADE,
      urls varchar(500) NOT NULL
    )
  `;
}

export async function down(sql) {
  await sql`
    DROP TABLE images
  `;
}

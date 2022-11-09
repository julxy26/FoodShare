export async function up(sql) {
  await sql`
    CREATE TABLE images (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      post_id integer NOT NULL,
      urls varchar(200) NOT NULL
    )
  `;
}

export async function down(sql) {
  await sql`
    DROP TABLE images
  `;
}

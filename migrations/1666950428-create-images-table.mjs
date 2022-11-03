export async function up(sql) {
  await sql`
    CREATE TABLE images (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      post_id integer NOT NULL,
      urls varchar(90) NOT NULL
    )
  `;
}

export async function images(sql) {
  await sql`
    DROP TABLE images
  `;
}

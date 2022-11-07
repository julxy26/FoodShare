export async function up(sql) {
  await sql`
    CREATE TABLE posts (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      title varchar(90) NOT NULL ,
      price integer NOT NULL,
      description varchar(500) NOT NULL ,
      street varchar(100) NOT NULL,
      district integer NOT NULL,
      user_id integer REFERENCES users (id) ON DELETE CASCADE,
      image_urls varchar(100)
    )
  `;
}

export async function down(sql) {
  await sql`
    DROP TABLE posts
  `;
}

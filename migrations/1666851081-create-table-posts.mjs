export async function up(sql) {
  await sql`
    CREATE TABLE posts (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      title varchar(90) NOT NULL UNIQUE,
      price integer NOT NULL,
      description varchar(70) NOT NULL UNIQUE,
      street varchar(90) NOT NULL,
      district integer NOT NULL,
      user_id integer NOT NULL,
      image_url varchar(90)
    )
  `;
}

export async function down(sql) {
  await sql`
    DROP TABLE posts
  `;
}

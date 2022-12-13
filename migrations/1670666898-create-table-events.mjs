export async function up(sql) {
  await sql`
    CREATE TABLE events (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      title varchar(90) NOT NULL ,
      street varchar(100) NOT NULL,
      district integer NOT NULL,
      date date NOT NULL,
      time time NOT NULL,
      user_id integer REFERENCES users (id) ON DELETE CASCADE NOT NULL
    )
  `;
}

export async function down(sql) {
  await sql`
    DROP TABLE events
  `;
}

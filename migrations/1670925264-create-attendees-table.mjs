export async function up(sql) {
  await sql`
    CREATE TABLE attendees (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      event_id integer REFERENCES events (id) ON DELETE CASCADE NOT NULL,
      user_id integer
    )
  `;
}

export async function down(sql) {
  await sql`
    DROP TABLE attendees
  `;
}

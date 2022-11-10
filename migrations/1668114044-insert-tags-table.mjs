const tagNames = [
  { id: 1, name: 'Vegetarian' },
  { id: 2, name: 'Vegan' },
  { id: 3, name: 'No restrictions' },
];

export async function up(sql) {
  await sql`
    INSERT INTO tags ${sql(tagNames, 'id', 'name')}
  `;
}

export async function down(sql) {
  for (const tag of tagNames) {
    await sql`
      DELETE FROM
        tags
      WHERE
        name = ${tag.name}
    `;
  }
}

// export async function up(sql) {
//   await sql`
//     CREATE TABLE tags (
//       id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
//       name varchar(90) NOT NULL
//     )
//   `;
// }

// export async function down(sql) {
//   await sql`
//     DROP TABLE tags
//   `;
// }
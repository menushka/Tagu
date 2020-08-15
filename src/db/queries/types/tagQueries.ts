export class TagQueries {
  initalize = `
    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT UNIQUE NOT NULL
  );
  `;

  create = `
    INSERT INTO tags
    (name)
    VALUES
    (?)
  `;

  get = `
    SELECT id, name
    FROM tags
  `;

  updateByNameAndId = `
    UPDATE tags
    SET name = ?
    WHERE id = ?;
  `;

  removeById = `
    DELETE FROM tags
    WHERE id = ?;
  `;
}

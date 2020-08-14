class FileQueries {
  initalize = `
    CREATE TABLE IF NOT EXISTS files (
      id INTEGER PRIMARY KEY NOT NULL,
      path TEXT UNIQUE NOT NULL
    );
  `;

  create = `
    INSERT INTO files
    (path)
    VALUES
    (?)
  `;

  private _get = (part1: string, part2: string) => `
    SELECT id, path, tags, tag_ids
    FROM files
    INNER JOIN
      (
        SELECT file_id, group_concat(tags.name) as tags, group_concat(tags.id) as tag_ids FROM file_tags
        LEFT JOIN tags
        on file_tags.tag_id = tags.id
        ${part1}
        GROUP BY file_id
        ${part2}
      ) AS combined_tags
    ON files.id = combined_tags.file_id
  `;

  get = this._get('', '');

  getByTags = (num: number) => this._get(`WHERE tag_id IN (${Queries.buildBinds(num)})`, `HAVING COUNT(*) = ${num}`);

  deleteById = `
    DELETE FROM files
    WHERE id = ?
  `;
}

class FileTagsQueries {
  initalize = `
    CREATE TABLE IF NOT EXISTS file_tags (
      id INTEGER PRIMARY KEY NOT NULL,
      file_id int NOT NULL,
      tag_id int NOT NULL,
      FOREIGN KEY (file_id) REFERENCES files (id),
      FOREIGN KEY (tag_id) REFERENCES tags (id)
    );
  `;

  create = `
    INSERT INTO file_tags
    (file_id, tag_id)
    VALUES
    (?, ?)
  `;

  deleteByIds = (num: number) => `
    DELETE FROM file_tags
    WHERE id IN (${Queries.buildBinds(num)})
  `;

  deleteByFileId = `
    DELETE FROM file_tags
    WHERE file_id = ?
  `;
}

class TagQueries {
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

export class Queries {
  static file = new FileQueries();
  static fileTags = new FileTagsQueries();
  static tags = new TagQueries();

  static buildBinds = (num: number) => new Array(num).fill('?').join(',');
}

import { QueryUtils } from '../utils/queryUtils';

export class FileQueries {
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

  get = `
    SELECT id, path, tags, tag_ids
    FROM files
    INNER JOIN
      (
        SELECT file_id, group_concat(tags.name) as tags, group_concat(tags.id) as tag_ids FROM file_tags
        LEFT JOIN tags
        on file_tags.tag_id = tags.id
        GROUP BY file_id
      ) AS combined_tags
    ON files.id = combined_tags.file_id
  `;

  getByTags = (num: number) => `
    ${this.get}
    WHERE ${QueryUtils.buildWhereBinds(num, 'tag_ids')}
  `;

  deleteById = `
    DELETE FROM files
    WHERE id = ?
  `;
}

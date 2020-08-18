export class FileTagsQueries {
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

  deleteByFileId = `
    DELETE FROM file_tags
    WHERE file_id = ?
  `;

  deleteByTagId = `
    DELETE FROM file_tags
    WHERE tag_id = ?
  `;

  deleteByFileIdAndTagId = `
    DELETE FROM file_tags
    WHERE file_id = ? AND tag_id = ?
  `;
}

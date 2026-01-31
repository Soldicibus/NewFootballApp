import db from '../db/database.js';

export const PlayersModel = {
  create(data) {
    const stmt = db.prepare(`
      INSERT INTO players (
        first_name,
        second_name,
        third_name,
        role,
        country_id
      )
      VALUES (
        @first_name,
        @second_name,
        @third_name,
        @role,
        @country_id
      )
    `);

    const result = stmt.run(data);
    return this.findById(result.lastInsertRowid);
  },

  findById(id) {
    return db.prepare(`
      SELECT p.*, c.name AS country_name
      FROM players p
      LEFT JOIN countries c ON c.id = p.country_id
      WHERE p.id = ?
    `).get(id);
  },

  findAll() {
    return db.prepare(`
      SELECT p.*, c.name AS country_name
      FROM players p
      LEFT JOIN countries c ON c.id = p.country_id
      ORDER BY p.second_name
    `).all();
  },

  update(id, data) {
    const stmt = db.prepare(`
      UPDATE players SET
        first_name = COALESCE(@first_name, first_name),
        second_name = COALESCE(@second_name, second_name),
        third_name = COALESCE(@third_name, third_name),
        role = COALESCE(@role, role),
        country_id = COALESCE(@country_id, country_id)
      WHERE id = @id
    `);

    stmt.run({ ...data, id });
    return this.findById(id);
  },

  remove(id) {
    return db
      .prepare(`DELETE FROM players WHERE id = ?`)
      .run(id);
  }
};

import db from '../db/database.js';

export const AbilitiesModel = {
  create(playerId, data = {}) {
    const stmt = db.prepare(`
      INSERT INTO abilities (
        player_id,
        weak_foot_usage,
        weak_foot_accuracy,
        form,
        injury_resistance
      )
      VALUES (
        @player_id,
        @weak_foot_usage,
        @weak_foot_accuracy,
        @form,
        @injury_resistance
      )
    `);

    stmt.run({ player_id: playerId, ...data });
    return this.findByPlayerId(playerId);
  },

  findByPlayerId(playerId) {
    return db
      .prepare(`SELECT * FROM abilities WHERE player_id = ?`)
      .get(playerId);
  },

  updateByPlayerId(playerId, data) {
    const stmt = db.prepare(`
      UPDATE abilities SET
        weak_foot_usage = COALESCE(@weak_foot_usage, weak_foot_usage),
        weak_foot_accuracy = COALESCE(@weak_foot_accuracy, weak_foot_accuracy),
        form = COALESCE(@form, form),
        injury_resistance = COALESCE(@injury_resistance, injury_resistance)
      WHERE player_id = @player_id
    `);

    stmt.run({ ...data, player_id: playerId });
    return this.findByPlayerId(playerId);
  },

  removeByPlayerId(playerId) {
    return db
      .prepare(`DELETE FROM abilities WHERE player_id = ?`)
      .run(playerId);
  }
};

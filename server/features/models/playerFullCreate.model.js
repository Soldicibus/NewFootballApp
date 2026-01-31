import db from '../db/database.js';

export const createFullPlayer = db.transaction((data) => {
  // 1. player
  const playerResult = db.prepare(`
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
  `).run(data.player);

  const playerId = playerResult.lastInsertRowid;

  // 2. abilities
  const abilitiesResult = db.prepare(`
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
  `).run({
    player_id: playerId,
    ...data.abilities
  });

  const abilityId = abilitiesResult.lastInsertRowid;

  // 3. attack
  db.prepare(`
    INSERT INTO attack (ability_id)
    VALUES (?)
  `).run(abilityId);

  // 4. defence
  db.prepare(`
    INSERT INTO defence (ability_id)
    VALUES (?)
  `).run(abilityId);

  // 5. support
  db.prepare(`
    INSERT INTO support (ability_id)
    VALUES (?)
  `).run(abilityId);

  // 6. goalkeeping
  db.prepare(`
    INSERT INTO goalkeeping (ability_id)
    VALUES (?)
  `).run(abilityId);

  return {
    player_id: playerId,
    ability_id: abilityId
  };
});

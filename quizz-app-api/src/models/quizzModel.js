const { pool } = require("../config/db");
const {
  createQuizzSchema,
  updateQuizzSchema,
} = require("../schemas/quizzSchema");

const createQuizzModel = async (quizzData) => {
  const client = await pool.connect();

  try {
    const { error, value } = createQuizzSchema.validate(quizzData, {
      abortEarly: false,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message).join(", ");
      throw new Error(`Błąd walidacji: ${messages}`);
    }

    const {
      user_id,
      name,
      description,
      category_id,
      difficulty_level,
      duration,
      privacy,
    } = value;

    await client.query("BEGIN");

    const insertQuizzQuery = `
        INSERT INTO quizz (user_id, name, description, category_id, difficulty_level, duration, privacy)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, user_id, name, description, category_id, difficulty_level, duration, privacy
    `;

    const quizzResult = await client.query(insertQuizzQuery, [
      user_id,
      name,
      description,
      category_id,
      difficulty_level,
      duration,
      privacy,
    ]);

    const newQuizz = quizzResult.rows[0];

    await client.query("COMMIT");

    return newQuizz;
  } catch (err) {
    await client.query("ROLLBACK");
    throw new Error(`Błąd tworzenia quizzu: ${err.message}`);
  } finally {
    client.release();
  }
};

const updateQuizzModel = async (id, data) => {
  try {
    const { error, value } = updateQuizzSchema.validate(data, {
      abortEarly: false,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message).join(", ");
      throw new Error(`Bład walidacji: ${messages}`);
    }

    const fields = [];
    const values = [];
    let i = 1;

    for (const key in value) {
      fields.push(`${key} = $${i++}`);
      values.push(value[key]);
    }

    if (fields.length === 0) {
      throw new Error("Brak danych do aktualizacji.");
    }

    const query = `
      UPDATE quizz
      SET ${fields.join(", ")}
      WHERE id = $${i}
      RETURNING id, user_id, name, description, category_id, difficulty_level, duration, privacy
    `;

    values.push(id);

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  } catch (err) {
    throw new Error(`Błąd aktualizacji quizzu: ${err.message}`);
  }
};

const deleteQuizzModel = async (id) => {
  try {
    const query = `DELETE FROM quizz WHERE id = $1 RETURNING id`;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  } catch (err) {
    throw new Error(`Błąd podczas usuwania quizzu: ${err.message}`);
  }
};

const getAllQuizzModel = async () => {
  try {
    const query = `
    SELECT
      q.id,
      q.user_id,
      u.username,
      q.name,
      q.description,
      q.category_id,
      c.name AS category_name,
      q.difficulty_level,
      q.duration,
      q.privacy
      FROM quizz q
      JOIN users u ON q.user_id = u.id
      JOIN category c ON q.category_id = c.id
    `;

    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    throw new Error(`Błąd podczas pobierania quizzów: ${err.message}`);
  }
};

const getAllQuizzsByUserModel = async (user_id) => {
  try {
    const query = `
      SELECT
      q.id,
      q.user_id,
      u.username,
      q.name,
      q.description,
      q.category_id,
      c.name AS category_name,
      q.difficulty_level,
      q.duration,
      q.privacy
      FROM quizz q
      JOIN users u ON q.user_id = u.id
      JOIN category c ON q.category_id = c.id
      WHERE q.user_id = $1
      `;

    const result = await pool.query(query, [user_id]);
    return result.rows;
  } catch (err) {
    throw new Error(
      `Błąd podczas pobierania wszystkich quizzów użytkownika: ${err.message}`
    );
  }
};

const getQuizzByUserModel = async (id) => {
  try {
    const query = `
      SELECT
      q.id,
      q.user_id,
      u.username,
      q.name,
      q.description,
      q.category_id,
      c.name AS category_name,
      q.difficulty_level,
      q.duration,
      q.privacy
      FROM quizz q
      JOIN users u ON q.user_id = u.id
      JOIN category c ON q.category_id = c.id
      WHERE q.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (err) {
    throw new Error(`Błąd podczas pobierania quizzu: ${err.message}`);
  }
};

const searchQuizzModel = async (searchTerm) => {
  try {
    const query = `
      SELECT
        q.id,
        q.user_id,
        u.username,
        q.name,
        q.description,
        q.category_id,
        c.name AS category_name,
        q.difficulty_level,
        q.duration,
        q.privacy
      FROM quizz q
      JOIN users u ON q.user_id = u.id
      JOIN category c ON q.category_id = c.id
      WHERE 
        q.name ILIKE $1 OR 
        q.description ILIKE $1 OR 
        c.name = $1 OR 
        q.difficulty_level = $1
    `;

    const result = await pool.query(query, [`%${searchTerm}%`]);
    return result.rows;
  } catch (err) {
    throw new Error(`Błąd podczas wyszukiwania quizzów: ${err.message}`);
  }
};

const getFullQuizzModel = async (id) => {
  try {
    const query = `
      SELECT
        q.id AS quizz_id,
        q.user_id,
        u.username,
        q.name AS quizz_name,
        q.description,
        q.category_id,
        c.name AS category_name,
        q.difficulty_level,
        q.duration,
        q.privacy,
        qe.id AS question_id,
        qe.type_id,
        qt.name AS question_type,
        qe.question,
        qe.image_url,
        a.id AS answer_id,
        a.text AS answer_text,
        a.is_answer,
        a.points,
        a.hint
      FROM quizz q
      JOIN users u ON q.user_id = u.id
      JOIN category c ON q.category_id = c.id
      JOIN questions qe ON q.id = qe.quizz_id
      JOIN question_type qt ON qe.type_id = qt.id
      JOIN question_answer a ON qe.id = a.question_id
      WHERE q.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows;
  } catch (err) {
    throw new Error(`Błąd podczas pobierania quizzu: ${err.message}`);
  }
};

module.exports = {
  createQuizzModel,
  updateQuizzModel,
  deleteQuizzModel,
  getAllQuizzModel,
  getAllQuizzsByUserModel,
  getQuizzByUserModel,
  searchQuizzModel,
  getFullQuizzModel,
};

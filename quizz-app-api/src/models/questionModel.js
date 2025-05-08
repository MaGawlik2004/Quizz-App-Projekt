const { pool } = require("../config/db");
const {
  createQuestionSchema,
  updateQuestionSchema,
} = require("../schemas/quizzSchema");

const createQuestionModel = async (questionData) => {
  const client = await pool.connect();

  try {
    const { error, value } = createQuestionSchema.validate(questionData, {
      abortEarly: false,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message).join(", ");
      throw new Error(`Błąd walidacji: ${messages}`);
    }

    const { quizz_id, type_id, question, image_url } = value;

    await client.query("BEGIN");

    const insertQuestionQuery = `
      INSERT INTO questions (quizz_id, type_id, question, image_url)
      VALUES ($1, $2, $3, $4)
      RETURNING id, quizz_id, type_id, question, image_url
    `;

    const questionResult = await client.query(insertQuestionQuery, [
      quizz_id,
      type_id,
      question,
      image_url,
    ]);

    const newQuestion = questionResult.rows[0];

    await client.query("COMMIT");
    return newQuestion;
  } catch (err) {
    await client.query("ROLLBACK");
    throw new Error(`Błąd podczas tworzenia pytania: ${err.message}`);
  } finally {
    client.release();
  }
};

const updateQuestionModel = async (id, data) => {
  try {
    const { error, value } = updateQuestionSchema.validate(data, {
      abortEarly: false,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message).join(", ");
      throw new Error(`Błąd walidacji: ${messages}`);
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
      UPDATE questions
      SET ${fields.join(", ")}
      WHERE id = $${i}
      RETURNING id, quizz_id, type_id, question, image_url
    `;

    values.push(id);

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  } catch (err) {
    throw new Error(`Błąd aktualizacji pytania: ${err.message}`);
  }
};

const deleteQuestionModel = async (id) => {
  try {
    const query = `DELETE FROM questions WHERE id = $1 RETURNING id`;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  } catch (err) {
    throw new Error(`Błąd podczas usuwania pytania: ${err.message}`);
  }
};

const getAllQuestionByQuizzModel = async (quizz_id) => {
  try {
    const query = `
      SELECT
        q.id,
        q.quizz_id,
        qu.name AS quizz_name,
        q.type_id,
        t.name AS question_type,
        q.question,
        q.image_url
      FROM questions q
      JOIN quizz qu ON q.quizz_id = qu.id
      JOIN question_type t ON q.type_id = t.id
      WHERE q.quizz_id = $1
    `;

    const result = await pool.query(query, [quizz_id]);
    return result.rows;
  } catch (err) {
    throw new Error(`Błąd podczas pobierania pytań z quizzu: ${err.message}`);
  }
};

module.exports = {
  getQuizzByUserModel,
  createQuestionModel,
  updateQuestionModel,
  deleteQuestionModel,
  getAllQuestionByQuizzModel,
};

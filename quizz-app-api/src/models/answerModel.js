const { pool } = require("../config/db");
const {
  createAnswerSchema,
  updateAnswerSchema,
} = require("../schemas/quizzSchema");

const createAnswerModel = async (answerData) => {
  const client = await pool.connect();

  try {
    const { error, value } = createAnswerSchema.validate(answerData, {
      abortEarly: false,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message).join(", ");
      throw new Error(`Błąd walidacji: ${messages}`);
    }

    const { question_id, text, is_answer, points, hint } = value;

    await client.query("BEGIN");

    const insertAnswerQuery = `
    INSERT INTO question_answer (question_id, text, is_answer, points, hint)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, question_id, text, is_answer, points, hint
    `;

    const answerResult = await client.query(insertAnswerQuery, [
      question_id,
      text,
      is_answer,
      points,
      hint,
    ]);

    const newAnswer = answerResult.rows[0];
    await client.query("COMMIT");
    return newAnswer;
  } catch (err) {
    await client.query("ROLLBACK");
    throw new Error(`Błąd podczas tworzenia odpowiedzi: ${err.message}`);
  } finally {
    client.release();
  }
};

const updateAnswerModel = async (id, data) => {
  try {
    const { error, value } = updateAnswerSchema.validate(data, {
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
      throw new Error(`Brak danych do aktualizacji`);
    }

    const query = `
      UPDATE question_answer
      SET ${fields.join(", ")}
      WHERE id = $${i}
      RETURNING id, question_id, text, is_answer, points, hint
    `;

    values.push(id);

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  } catch (err) {
    throw new Error(`Błąd aktualizacji odpowiedzi: ${err.message}`);
  }
};

const deleteAnswerModel = async (id) => {
  try {
    const query = `DELETE FROM question_answer WHERE id = $1 RETURNING id`;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  } catch (err) {
    throw new Error(`Błąd podczas usuwania odpowiedzi: ${err.message}`);
  }
};

const getAllAnswersByQuestionModel = async (question_id) => {
  try {
    const query = `
      SELECT
        a.id,
        a.question_id,
        ques.question,
        a.text,
        a.is_answer,
        a.points,
        a.hint
      FROM question_answer a
      JOIN questions ques ON a.question_id = ques.id
      WHERE a.question_id = $1
    `;

    const result = await pool.query(query, [question_id]);
    return result.rows;
  } catch (err) {
    throw new Error(
      `Błąd podczas pobierania odpowiedzi do pytania: ${err.message}`
    );
  }
};

module.exports = {
  createAnswerModel,
  updateAnswerModel,
  deleteAnswerModel,
  getAllAnswersByQuestionModel,
};

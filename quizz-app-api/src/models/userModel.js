const { pool } = require("../config/db");
const bcrypt = require("bcrypt");
const { createUserSchema, updateUserSchema } = require("../schemas/userSchema");

const hashedPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const createUser = async (userData) => {
  const client = await pool.connect();

  try {
    const { error, value } = createUserSchema.validate(userData, {
      abortEarly: false,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message).join(", ");
      throw new Error(`Błąd walidacji: ${messages}`);
    }

    const {
      username,
      email,
      password,
      first_name,
      last_name,
      role,
      provider = "local",
      providerUserId,
    } = value;

    const password_hash =
      provider === "local" ? await hashedPassword(password) : null;

    await client.query("BEGIN");

    const insertUserQuery = `
        INSERT INTO users (username, email, password_hash, role, first_name, last_name)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, username, email, role, first_name, last_name, created_at
    `;

    const userResult = await client.query(insertUserQuery, [
      username,
      email,
      password_hash,
      role,
      first_name,
      last_name,
    ]);

    const newUser = userResult.rows[0];

    if (provider !== "local") {
      const insertSocialQuery = `
            INSERT INTO social_account (user_id, provider, provider_user_id)
            VALUES ($1, $2, $3)
        `;
      await client.query(insertSocialQuery, [
        newUser.id,
        provider,
        providerUserId,
      ]);
    }

    await client.query("COMMIT");
    return newUser;
  } catch (err) {
    await client.query("ROLLBACK");

    if (err.code === "23505" && err.message.includes("users_email_key")) {
      throw new Error("Podany email jest już zajęty");
    }

    throw new Error(`Błąd tworzenia użytkownika: ${err.message}`);
  } finally {
    client.release();
  }
};

const getUserByEmail = async (email) => {
  try {
    const query = `
            SELECT 
                u.id, u.username, u.email, u.password_hash, u.role,
                u.first_name, u.last_name, u.created_at,
                sa.provider, sa.provider_user_id
            FROM users u
            LEFT JOIN social_account sa ON u.id = sa.user_id
            WHERE u.email = $1
        `;
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  } catch (err) {
    throw new Error(
      `Błąd podczas pobierania użytkownika po emailu: ${err.message}`
    );
  }
};

const getUserById = async (id) => {
  try {
    const query = `
            SELECT 
                u.id, u.username, u.email, u.password_hash, u.role,
                u.first_name, u.last_name, u.created_at,
                sa.provider, sa.provider_user_id
            FROM users u
            LEFT JOIN social_account sa ON u.id = sa.user_id
            WHERE u.id = $1
        `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  } catch (err) {
    throw new Error(
      `Błąd podczas pobierania użytkownika po ID: ${err.message}`
    );
  }
};

const updateUser = async (id, data) => {
  try {
    // Walidacja danych wejściowych
    const { error, value } = updateUserSchema.validate(data, {
      abortEarly: false,
    });
    if (error) {
      const messages = error.details.map((d) => d.message).join(", ");
      throw new Error(`Błąd walidacji: ${messages}`);
    }

    const fields = [];
    const values = [];
    let i = 1;

    // Budowanie dynamicznego zapytania
    for (const key in value) {
      if (key === "password") {
        value.password_hash = await hashedPassword(value.password);
        fields.push(`password_hash = $${i++}`);
        values.push(value.password_hash);
      } else {
        fields.push(`${key} = $${i++}`);
        values.push(value[key]);
      }
    }

    // Sprawdzanie, czy są dane do aktualizacji
    if (fields.length === 0) {
      throw new Error("Brak danych do aktualizacji.");
    }

    // Zapytanie SQL
    const query = `
        UPDATE users
        SET ${fields.join(", ")}
        WHERE id = $${i}
        RETURNING id, username, email, role, first_name, last_name, created_at  
    `;

    // Dodanie id użytkownika do wartości
    values.push(id);

    // Wykonanie zapytania
    const result = await pool.query(query, values);
    return result.rows[0] || null; // Zwrócenie zaktualizowanego użytkownika
  } catch (err) {
    throw new Error(`Błąd aktualizacji użytkownika: ${err.message}`);
  }
};

const deleteUser = async (id) => {
  try {
    const query = `DELETE FROM users WHERE id = $1 RETURNING id`;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  } catch (err) {
    throw new Error(`Błąd podczas usuwania użytkownika: ${err.message}`);
  }
};

const checkIfLoginSuccessfull = async (email, plainPassword) => {
  try {
    const user = await getUserByEmail(email);
    if (!user || !user.password_hash) {
      return false;
    }
    const isMatch = await bcrypt.compare(plainPassword, user.password_hash);
    return isMatch ? user : false;
  } catch (err) {
    throw new Error(`Błąd podczas logowania: ${err.message}`);
  }
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  deleteUser,
  checkIfLoginSuccessfull,
};

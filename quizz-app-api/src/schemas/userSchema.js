const Joi = require("joi");

const createUserSchema = Joi.object({
  username: Joi.string().max(100).required().messages({
    "string.empty": "Nazwa użytkownika jest wymagana",
    "string.max": "Nazwa użytkownika nie może przekraczać {#limit} znaków",
    "any.required": "Nazwa użytkownika jest wymagana",
  }),

  email: Joi.string().email().max(255).required().messages({
    "string.empty": "Email jest wymagany",
    "string.email": "Email musi być poprawny",
    "string.max": "Email nie może przekraczać {#limit} znaków",
    "any.required": "Email jest wymagany",
  }),

  password: Joi.when("provider", {
    is: "local",
    then: Joi.string().min(8).max(255).required().messages({
      "string.empty": "Hasło jest wymagane",
      "string.min": "Hasło musi mieć przynajmniej {#limit} znaków",
      "string.max": "Hasło nie może przekraczać {#limit} znaków",
      "any.required": "Hasło jest wymagane",
    }),
    otherwise: Joi.forbidden(),
  }),

  first_name: Joi.string().max(100).required().messages({
    "string.empty": "Imię jest wymagane",
    "string.max": "Imię nie może przekraczać {#limit} znaków",
    "any.required": "Imię jest wymagane",
  }),

  last_name: Joi.string().max(100).required().messages({
    "string.empty": "Nazwisko jest wymagane",
    "string.max": "Nazwisko nie może przekraczać {#limit} znaków",
    "any.required": "Nazwisko jest wymagane",
  }),

  provider: Joi.string()
    .valid("local", "google", "facebook")
    .default("local")
    .messages({
      "any.only": "Dostawca może być tylko 'local', 'google' lub 'facebook'",
    }),

  providerUserId: Joi.when("provider", {
    not: "local",
    then: Joi.string().required().messages({
      "string.empty": "Identyfikator konta społecznościowego jest wymagany",
      "any.required": "Identyfikator konta społecznościowego jest wymagany",
    }),
    otherwise: Joi.forbidden(),
  }),

  role: Joi.string().valid("user", "admin").default("user").messages({
    "any.only": "Rola musi być 'user' lub 'admin'",
  }),
});

const updateUserSchema = Joi.object({
  username: Joi.string().max(100).messages({
    "string.max": "Nazwa użytkownika nie może przekraczać {#limit} znaków",
  }),

  email: Joi.string().email().max(255).messages({
    "string.email": "Email musi być poprawny",
    "string.max": "Email nie może przekraczać {#limit} znaków",
  }),

  password: Joi.string().min(8).max(255).messages({
    "string.min": "Hasło musi mieć przynajmniej {#limit} znaków",
    "string.max": "Hasło nie może przekraczać {#limit} znaków",
  }),

  first_name: Joi.string().max(100).messages({
    "string.max": "Imię nie może przekraczać {#limit} znaków",
  }),

  last_name: Joi.string().max(100).messages({
    "string.max": "Nazwisko nie może przekraczać {#limit} znaków",
  }),

  role: Joi.string().valid("user", "admin").messages({
    "any.only": "Rola musi być 'user' lub 'admin'",
  }),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
};

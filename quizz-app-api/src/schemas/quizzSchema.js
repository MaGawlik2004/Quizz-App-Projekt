const Joi = require("joi");

const createQuizzSchema = Joi.object({
  name: Joi.string().max(40).required().messages({
    "string.empty": "Nazwa quizzu jest wymagana.",
    "string.max": "Nazwa quizzu nie może przekroczyć 40 znaków",
    "any.required": "Nazwa quizzu jest wymagana.",
  }),

  description: Joi.string().required().messages({
    "string.empty": "Opis jest wymagany.",
    "any.required": "Opis jest wymagany.",
  }),

  difficulty_level: Joi.string().max(20).required().messages({
    "string.empty": "Poziom ciężkości jest wymagana.",
    "string.max": "Poziom ciężkości nie może przekroczyć 20 znaków",
    "any.required": "Poziom ciężkości jest wymagana.",
  }),

  duration: Joi.number().required().messages({
    "string.empty": "Czas trwania jest wymagana.",
    "any.required": "Czas trwania jest wymagana.",
  }),

  privacy: Joi.string().max(20).required().messages({
    "string.empty": "Prywatność jest wymagana.",
    "string.max": "Prywatność nie może przekroczyć 20 znaków",
    "any.required": "Prywatność jest wymagana.",
  }),
});

const createQuestionSchema = Joi.object({
  question: Joi.string().max(255).required().messages({
    "string.empty": "Pytanie jest wymagane.",
    "string.max": "Pytanie nie może przekroczyć 255 znaków.",
    "any.required": "Pytanie jest wymagane.",
  }),
});

const createAnswerSchema = Joi.object({
  text: Joi.string().required().messages({
    "string.empty": "Odpowiedź jest wymagana",
    "any.required": "Odpowiedż jest wymagana",
  }),

  is_answer: Joi.boolean().required().messages({
    "any.required": "Musisz zaznaczyć, czy odpowiedź jest poprawna.",
    "boolean.base":
      "Wartość odpowiedzi musi być typu prawda/fałsz (true/false).",
  }),

  points: Joi.number().required().messages({
    "number.base": "Punktacja musi być liczbą.",
    "any.required": "Punktacja jest wymagana.",
  }),

  hint: Joi.string().required().messages({
    "string.empty": "Podpowiedź jest wymagana.",
    "any.required": "Podpowiedź jest wymagana.",
  }),
});

const updateQuizzSchema = Joi.object({
  name: Joi.string().max(40).messages({
    "string.empty": "Nazwa quizzu jest wymagana.",
    "string.max": "Nazwa quizzu nie może przekroczyć 40 znaków",
  }),

  description: Joi.string().messages({
    "string.empty": "Opis jest wymagany.",
  }),

  difficulty_level: Joi.string().max(20).messages({
    "string.empty": "Poziom ciężkości jest wymagana.",
    "string.max": "Poziom ciężkości nie może przekroczyć 20 znaków",
  }),

  duration: Joi.number().messages({
    "string.empty": "Czas trwania jest wymagana.",
  }),

  privacy: Joi.string().max(20).messages({
    "string.empty": "Prywatność jest wymagana.",
    "string.max": "Prywatność nie może przekroczyć 20 znaków",
  }),
});

const updateQuestionSchema = Joi.object({
  question: Joi.string().max(255).messages({
    "string.empty": "Pytanie jest wymagane.",
    "string.max": "Pytanie nie może przekroczyć 255 znaków.",
  }),
});

const updateAnswerSchema = Joi.object({
  text: Joi.string().messages({
    "string.empty": "Odpowiedź jest wymagana",
  }),

  is_answer: Joi.boolean().messages({
    "boolean.base":
      "Wartość odpowiedzi musi być typu prawda/fałsz (true/false).",
  }),

  points: Joi.number().messages({
    "number.base": "Punktacja musi być liczbą.",
  }),

  hint: Joi.string().messages({
    "string.empty": "Podpowiedź jest wymagana.",
  }),
});

module.exports = {
  createQuizzSchema,
  createQuestionSchema,
  createAnswerSchema,
  updateQuizzSchema,
  updateQuestionSchema,
  updateAnswerSchema,
};

const { pool } = require("../config/db");
const {
  createAnswerSchema,
  updateAnswerSchema,
} = require("../schemas/quizzSchema");

const createAnswerModel = a;

const updateAnswerModel = a;

const deleteAnswerModel = a;

const getAllAnswersByQuestionModel = a;

module.exports = {
  createAnswerModel,
  updateAnswerModel,
  deleteAnswerModel,
  getAllAnswersByQuestionModel,
};

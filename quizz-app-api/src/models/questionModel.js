const { pool } = require("../config/db");
const {
  createQuestionSchema,
  updateQuestionSchema,
} = require("../schemas/quizzSchema");

const createQuestionModel = a;

const updateQuestionModel = a;

const deleteQuestionModel = a;

const getAllQuestionByQuizzModel = a;

module.exports = {
  getQuizzByUserModel,
  createQuestionModel,
  updateQuestionModel,
  deleteQuestionModel,
  getAllQuestionByQuizzModel,
};

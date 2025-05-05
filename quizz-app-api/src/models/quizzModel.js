const { pool } = require("../config/db");
const {
  createQuizzSchema,
  updateQuizzSchema,
} = require("../schemas/quizzSchema");

const createQuizzModel = a;

const updateQuizzModel = a;

const deleteQuizzModel = a;

const getAllQuizzModel = a;

const getQuizzsByUserModel = a;

const getQuizzByUserModel = a;

const searchQuizzModel = a;

const getFullQuizzModel = a;

module.exports = {
  createQuizzModel,
  updateQuizzModel,
  deleteQuizzModel,
  getAllQuizzModel,
  getQuizzsByUserModel,
  getQuizzByUserModel,
  searchQuizzModel,
  getFullQuizzModel,
};

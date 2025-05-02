const express = require("express");
const router = express.Router();

const {
  registerUser,
  getUser,
  updateUserController,
  deleteUserController,
  loginUser,
} = require("../controllers/userController");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/:id", getUser);

router.put("/:id", updateUserController);

router.delete("/:id", deleteUserController);

module.exports = router;

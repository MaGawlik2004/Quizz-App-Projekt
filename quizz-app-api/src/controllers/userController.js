const {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  deleteUser,
  checkIfLoginSuccessfull,
} = require("../models/userModel");

const registerUser = async (req, res) => {
  try {
    const userData = req.body;
    const userExists = await getUserByEmail(userData.email);

    if (userExists) {
      return res
        .status(400)
        .json({ message: "Użytkownik z tym emailem już istniej." });
    }

    const newUser = await createUser(userData);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Użytkownik nie znaleziony." });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUserController = async (req, res) => {
  try {
    const updatedUser = await updateUser(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ message: "Użtykownik nie znaleziony." });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteUserController = async (req, res) => {
  try {
    const deleted = await deleteUser(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Użytkonik nie znalenizony." });
    }
    res.status(200).json({ message: "Użytkonik został usunięty." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await checkIfLoginSuccessfull(email, password);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Nieprawidłowy email lub hasło." });
    }

    res.status(200).json({ message: "Zalogowano pomyślnie", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  registerUser,
  getUser,
  updateUserController,
  deleteUserController,
  loginUser,
};

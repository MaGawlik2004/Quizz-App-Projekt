const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const { notFound, errorHandler } = require("./src/middleware/errorMiddleware");
const userRoutes = require("./src/routes/userRoute");

dotenv.config();
const app = express();

//Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.get("/", (req, res) => {
  res.send("API dla Quizz App działa poprawnie");
});

app.use("/api/users", userRoutes);

//Error Handlers
app.use(notFound);
app.use(errorHandler);

app.listen(3003, () => {
  console.log("Server running on port 3003");
});

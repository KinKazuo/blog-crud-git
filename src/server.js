const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./config/db");
const blogRoutes = require("./routes/blogRoutes");
const errorHandler = require("./middlewares/errorHandler");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", blogRoutes);

app.use(express.static(path.join(__dirname, "..", "public")));

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

connectDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((e) => {
    console.error("DB connection failed:", e.message);
    process.exit(1);
  });

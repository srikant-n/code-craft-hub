const express = require("express");
const courseRoutes = require("./routes/courseRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to CodeCraftHub API"
  });
});

app.use("/api/courses", courseRoutes);

app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).json({
    error: "Internal server error"
  });
});

app.listen(PORT, () => {
  console.log(`CodeCraftHub API running at http://localhost:${PORT}`);
});


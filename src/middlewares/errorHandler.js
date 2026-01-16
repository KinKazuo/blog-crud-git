module.exports = function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation error",
      details: Object.values(err.errors).map(e => e.message)
    });
  }

  return res.status(500).json({ message: "Server error" });
};

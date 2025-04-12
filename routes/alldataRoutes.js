const express = require("express");
const {
  getAllData,
  getOverallRanking,
} = require("../controllers/alldataController");

const router = express.Router();

// Optional route params using regex pattern that matches empty or non-empty strings
router.get("/:leetcodeId?/:codeforcesId?", getAllData);
router.get("/ov/:leetcodeId?/:codeforcesId?", getOverallRanking);

module.exports = router;

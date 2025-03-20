const express = require("express");
const {
  getAllData,
  getOverallRanking,
} = require("../controllers/alldataController");

const router = express.Router();

router.get("/:leetcodeId/:codeforcesId", getAllData);
router.get("/ov/:leetcodeId/:codeforcesId", getOverallRanking);

module.exports = router;

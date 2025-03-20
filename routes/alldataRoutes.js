const express = require("express");
const { getAllData } = require("../controllers/alldataController");

const router = express.Router();

router.get("/:leetcodeId/:codeforcesId", getAllData);

module.exports = router;

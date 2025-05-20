const express = require("express");
const {
  getCodeforcesUser,
  getCodeforcesRatingHistory,
  getCodeforcesContestList,
  getCodeforcesSubmissions,
  getCodeforcesSolvedProblems,
  getCodeforcesCalenderData,
  getCodeforcesCorrectSubmissions,
  getCodeforcesSolvedProblemsTags,
} = require("../controllers/codeforcesController");

const router = express.Router();

router.get("/:username", getCodeforcesUser);
router.get("/contests", getCodeforcesContestList);
// router.get("/rating/:username", getCodeforcesRatingHistory);
router.get("/rating/:username", async (req, res) => {
  try {
    const data = await getCodeforcesRatingHistory(req.params.username);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/submissions/:username", getCodeforcesSubmissions);
router.get("/solved/:username", getCodeforcesSolvedProblems);
router.get("/CalenderData/:username", getCodeforcesCalenderData);
router.get("/correctSubmissions/:username", getCodeforcesCorrectSubmissions);
router.get("/solvedProblemsTags/:username", getCodeforcesSolvedProblemsTags);

module.exports = router;

const express = require("express");
const {
  getLeetCodeStats,
  getLeetCodeCalendar,
  getLeetCodeLast20Submissions,
  getLeetCodeContestData,
  getAttendedLeetcodeContestData,
} = require("../controllers/leetcodeController");

const router = express.Router();

router.get("/:username", getLeetCodeStats);
router.get("/submissioncal/:username", getLeetCodeCalendar);
router.get("/last20Sub/:username", getLeetCodeLast20Submissions);
router.get("/contest/:username", getLeetCodeContestData);
// router.get("/attendedContest/:username", getAttendedLeetcodeContestData);
router.get("/attendedContest/:username", async (req, res) => {
  try {
    const data = await getAttendedLeetcodeContestData(req.params.username);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

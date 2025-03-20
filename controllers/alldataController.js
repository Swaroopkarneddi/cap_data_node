const { getAttendedLeetcodeContestData } = require("./leetcodeController");
const { getCodeforcesRatingHistory } = require("./codeforcesController");

const getAllData = async (req, res) => {
  const { leetcodeId, codeforcesId } = req.params;

  try {
    const [leetcodeContests, codeforcesRatingHistory] = await Promise.all([
      getAttendedLeetcodeContestData(leetcodeId), // Pass username directly
      getCodeforcesRatingHistory(codeforcesId), // Pass username directly
    ]);

    res.json({
      leetcodeAttendedContests: leetcodeContests,
      codeforcesRatingHistory: codeforcesRatingHistory,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllData };

const { getAttendedLeetcodeContestData } = require("./leetcodeController");
const { getCodeforcesRatingHistory } = require("./codeforcesController");

const getAllData = async (req, res) => {
  const { leetcodeId, codeforcesId } = req.params;

  try {
    const [leetcodeContests, codeforcesRatingHistory] = await Promise.all([
      getAttendedLeetcodeContestData(leetcodeId),
      getCodeforcesRatingHistory(codeforcesId),
    ]);

    if (!Array.isArray(leetcodeContests)) {
      return res.status(404).json({ error: "Invalid LeetCode username" });
    }

    if (!Array.isArray(codeforcesRatingHistory)) {
      return res.status(404).json({ error: "Invalid Codeforces username" });
    }

    res.json({
      leetcodeAttendedContests: leetcodeContests,
      codeforcesRatingHistory: codeforcesRatingHistory,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOverallRanking = async (req, res) => {
  const { leetcodeId, codeforcesId } = req.params;

  try {
    const [leetcodeContests, codeforcesRatingHistory] = await Promise.all([
      getAttendedLeetcodeContestData(leetcodeId),
      getCodeforcesRatingHistory(codeforcesId),
    ]);

    if (!Array.isArray(leetcodeContests)) {
      return res.status(404).json({ error: "Invalid LeetCode username" });
    }

    if (!Array.isArray(codeforcesRatingHistory)) {
      return res.status(404).json({ error: "Invalid Codeforces username" });
    }

    let totalRanking = 0;
    let totalRating = 0;
    let count = 0;

    // Process LeetCode contests
    leetcodeContests.forEach((contest) => {
      totalRanking += contest.ranking;
      totalRating += contest.rating;
      count++;
    });

    // Process Codeforces contests
    codeforcesRatingHistory.forEach((contest) => {
      totalRanking += contest.rank;
      totalRating += contest.newRating;
      count++;
    });

    const averageRanking = count > 0 ? totalRanking / count : 0;
    const averageRating = count > 0 ? totalRating / count : 0;

    res.json({
      leetcodeAttendedContests: leetcodeContests,
      codeforcesRatingHistory: codeforcesRatingHistory,
      overallRanking: Math.round(averageRanking),
      overallRating: Math.round(averageRating),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllData, getOverallRanking };

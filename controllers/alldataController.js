const { getAttendedLeetcodeContestData } = require("./leetcodeController");
const { getCodeforcesRatingHistory } = require("./codeforcesController");

const getAllData = async (req, res) => {
  const { leetcodeId, codeforcesId } = req.params;

  const leetcodePromise = leetcodeId
    ? getAttendedLeetcodeContestData(leetcodeId).catch(() => [])
    : Promise.resolve([]);
  const codeforcesPromise = codeforcesId
    ? getCodeforcesRatingHistory(codeforcesId).catch(() => [])
    : Promise.resolve([]);

  try {
    const [leetcodeContests, codeforcesRatingHistory] = await Promise.all([
      leetcodePromise,
      codeforcesPromise,
    ]);

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

  const leetcodePromise = leetcodeId
    ? getAttendedLeetcodeContestData(leetcodeId).catch(() => [])
    : Promise.resolve([]);
  const codeforcesPromise = codeforcesId
    ? getCodeforcesRatingHistory(codeforcesId).catch(() => [])
    : Promise.resolve([]);

  try {
    const [leetcodeContests, codeforcesRatingHistory] = await Promise.all([
      leetcodePromise,
      codeforcesPromise,
    ]);

    let totalRanking = 0;
    let totalRating = 0;
    let count = 0;

    leetcodeContests.forEach((contest) => {
      totalRanking += contest.ranking || 0;
      totalRating += contest.rating || 0;
      count++;
    });

    codeforcesRatingHistory.forEach((contest) => {
      totalRanking += contest.rank || 0;
      totalRating += contest.newRating || 0;
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

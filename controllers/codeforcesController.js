const axios = require("axios");

const getCodeforcesUser = async (req, res) => {
  const { username } = req.params;
  try {
    const response = await axios.get(
      `https://codeforces.com/api/user.info?handles=${username}`
    );

    if (response.data.status !== "OK" || !response.data.result.length) {
      return res.status(404).json({ error: "Invalid Codeforces username" });
    }

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCodeforcesRatingHistory = async (username) => {
  try {
    const response = await axios.get(
      `https://codeforces.com/api/user.rating?handle=${username}`
    );

    if (response.data.status !== "OK") {
      throw new Error("Invalid Codeforces username");
    }

    return response.data.result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getCodeforcesContestList = async (req, res) => {
  try {
    const response = await axios.get("https://codeforces.com/api/contest.list");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCodeforcesSubmissions = async (req, res) => {
  const { username } = req.params;
  try {
    const response = await axios.get(
      `https://codeforces.com/api/user.status?handle=${username}`
    );

    if (response.data.status !== "OK") {
      return res.status(404).json({ error: "Invalid Codeforces username" });
    }

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCodeforcesSolvedProblems = async (req, res) => {
  const { username } = req.params;
  try {
    const response = await axios.get(
      `https://codeforces.com/api/user.status?handle=${username}`
    );

    if (response.data.status !== "OK") {
      return res.status(404).json({ error: "Invalid Codeforces username" });
    }

    const submissions = response.data.result;
    const solvedProblems = new Set(
      submissions
        .filter((sub) => sub.verdict === "OK")
        .map((sub) => sub.problem.name)
    );
    res.json(Array.from(solvedProblems));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const getCodeforcesCalenderData = async (req, res) => {
  const { username } = req.params;
  try {
    const response = await axios.get(
      `https://codeforces.com/api/user.status?handle=${username}`
    );

    if (response.data.status !== "OK") {
      return res.status(404).json({ error: "Invalid Codeforces username" });
    }

    const submissions = response.data.result;
    const submissionMap = {}; // Format: { 'YYYY-MM-DD': count }

    // Get the date 11 months ago from start of current month
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    const startTimestamp = startDate.getTime();

    for (const submission of submissions) {
      const createdAt = new Date(submission.creationTimeSeconds * 1000);
      if (createdAt < startDate) continue; // Skip old data

      const dateKey = createdAt.toISOString().split("T")[0]; // 'YYYY-MM-DD'
      submissionMap[dateKey] = (submissionMap[dateKey] || 0) + 1;
    }

    // Organize by month
    const monthlyData = {}; // { 'YYYY-MM': { days: [...] } }

    Object.entries(submissionMap).forEach(([dateStr, count]) => {
      const [year, month, day] = dateStr.split("-");
      const key = `${year}-${month}`;
      const dayIndex = parseInt(day) - 1;

      if (!monthlyData[key]) {
        const daysInMonth = new Date(year, month, 0).getDate();
        monthlyData[key] = {
          name: MONTH_NAMES[parseInt(month) - 1],
          days: Array.from({ length: daysInMonth }, () => ({ submissions: 0 })),
        };
      }

      monthlyData[key].days[dayIndex].submissions = count;
    });

    // Sort and limit to last 12 months
    const sortedMonthKeys = Object.keys(monthlyData).sort().slice(-12);

    const months = sortedMonthKeys.map((key) => monthlyData[key]);

    // Calculate statistics
    let totalSubmissions = 0;
    let totalActiveDays = 0;
    let maxStreak = 0;
    let currentStreak = 0;
    let previousDate = null;

    const allDates = Object.keys(submissionMap).sort();

    for (const dateStr of allDates) {
      const count = submissionMap[dateStr];
      totalSubmissions += count;
      totalActiveDays++;

      const currentDate = new Date(dateStr);
      if (previousDate) {
        const diff = (currentDate - previousDate) / (1000 * 60 * 60 * 24);
        currentStreak = diff === 1 ? currentStreak + 1 : 1;
      } else {
        currentStreak = 1;
      }

      maxStreak = Math.max(maxStreak, currentStreak);
      previousDate = currentDate;
    }

    return res.json({
      totalSubmissions,
      totalActiveDays,
      maxStreak,
      months,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCodeforcesUser,
  getCodeforcesRatingHistory,
  getCodeforcesContestList,
  getCodeforcesSubmissions,
  getCodeforcesSolvedProblems,
  getCodeforcesCalenderData,
};

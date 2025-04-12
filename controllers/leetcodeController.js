const axios = require("axios");

const getLeetCodeStats = async (req, res) => {
  const { username } = req.params;
  const query = `{
    matchedUser(username: "${username}") {
      username
      submitStats: submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
      } 
    }
  }`;

  try {
    const response = await axios.post("https://leetcode.com/graphql", {
      query,
    });

    const matchedUser = response.data.data.matchedUser;
    if (!matchedUser) {
      return res.status(404).json({ error: "Invalid LeetCode username" });
    }

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLeetCodeCalendar = async (req, res) => {
  const { username } = req.params;
  const query = `
    query userProfileCalendar($username: String!, $year: Int) {
      matchedUser(username: $username) {
        userCalendar(year: $year) {
          activeYears
          streak
          totalActiveDays
          dccBadges {
            timestamp
            badge { name icon }
          }
          submissionCalendar
        }
      }
    }`;

  try {
    const response = await axios.post("https://leetcode.com/graphql", {
      query,
      variables: { username },
    });

    const matchedUser = response.data.data.matchedUser;
    if (!matchedUser || !matchedUser.userCalendar) {
      return res.status(404).json({ error: "Invalid LeetCode username" });
    }

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLeetCodeCalendardata = async (req, res) => {
  const { username } = req.params;
  const query = `
    query userProfileCalendar($username: String!, $year: Int) {
      matchedUser(username: $username) {
        userCalendar(year: $year) {
          submissionCalendar
        }
      }
    }`;

  try {
    const response = await axios.post("https://leetcode.com/graphql", {
      query,
      variables: { username },
    });

    const matchedUser = response?.data?.data?.matchedUser;
    let submissionCalendar = {};

    if (matchedUser && matchedUser.userCalendar?.submissionCalendar) {
      submissionCalendar = JSON.parse(
        matchedUser.userCalendar.submissionCalendar
      );
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const oneYearAgoTimestamp = currentTimestamp - 365 * 24 * 60 * 60;

    const filteredEntries = Object.entries(submissionCalendar)
      .filter(([timestamp]) => Number(timestamp) >= oneYearAgoTimestamp)
      .sort((a, b) => Number(a[0]) - Number(b[0]));

    let totalSubmissions = 0;
    let totalActiveDays = 0;
    let currentStreak = 0;
    let maxStreak = 0;
    let prevDay = null;

    filteredEntries.forEach(([timestamp, submissions]) => {
      const date = new Date(Number(timestamp) * 1000);
      const currentDay = Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
      totalSubmissions += submissions;

      if (submissions > 0) {
        totalActiveDays++;

        if (prevDay !== null && currentDay === prevDay + 1) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }

        maxStreak = Math.max(maxStreak, currentStreak);
        prevDay = currentDay;
      } else {
        currentStreak = 0;
      }
    });

    // Generate months data with 0 submissions by default
    const months = Array.from({ length: 12 }, (_, index) => {
      const monthDate = new Date();
      monthDate.setDate(1);
      monthDate.setMonth(monthDate.getMonth() - (11 - index));

      const year = monthDate.getFullYear();
      const month = monthDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      const days = Array.from({ length: daysInMonth }, (_, dayIndex) => {
        return { submissions: 0 };
      });

      // Fill in submission data if available
      filteredEntries.forEach(([timestamp, submissions]) => {
        const date = new Date(Number(timestamp) * 1000);
        if (date.getFullYear() === year && date.getMonth() === month) {
          days[date.getDate() - 1] = { submissions };
        }
      });

      return {
        name: monthDate.toLocaleString("en-US", { month: "short" }),
        days,
      };
    });

    res.json({
      totalSubmissions,
      totalActiveDays,
      maxStreak,
      months,
    });
  } catch (error) {
    // Return 0-filled data in case of error (like network, username not found, etc.)
    const months = Array.from({ length: 12 }, (_, index) => {
      const monthDate = new Date();
      monthDate.setDate(1);
      monthDate.setMonth(monthDate.getMonth() - (11 - index));
      const daysInMonth = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth() + 1,
        0
      ).getDate();
      return {
        name: monthDate.toLocaleString("en-US", { month: "short" }),
        days: Array(daysInMonth).fill({ submissions: 0 }),
      };
    });

    res.json({
      totalSubmissions: 0,
      totalActiveDays: 0,
      maxStreak: 0,
      months,
    });
  }
};

const getLeetCodeLast20Submissions = async (req, res) => {
  const { username } = req.params;
  const limit = 20;
  const query = `
    query recentAcSubmissions($username: String!, $limit: Int!) {
      recentAcSubmissionList(username: $username, limit: $limit) {
        id title titleSlug timestamp
      }
    }`;

  try {
    const response = await axios.post("https://leetcode.com/graphql", {
      query,
      variables: { username, limit },
    });

    if (!response.data.data.recentAcSubmissionList) {
      return res.status(404).json({ error: "Invalid LeetCode username" });
    }

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLeetCodeContestData = async (req, res) => {
  const { username } = req.params;
  const query = `
    query userContestRankingInfo($username: String!) {
      userContestRanking(username: $username) {
        attendedContestsCount rating globalRanking totalParticipants topPercentage
        badge { name }
      }
      userContestRankingHistory(username: $username) {
        attended trendDirection problemsSolved totalProblems finishTimeInSeconds rating ranking
        contest { title startTime }
      }
    }`;

  try {
    const response = await axios.post("https://leetcode.com/graphql", {
      query,
      variables: { username },
    });

    const data = response.data.data;
    if (!data.userContestRanking && !data.userContestRankingHistory) {
      return res.status(404).json({ error: "Invalid LeetCode username" });
    }

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAttendedLeetcodeContestData = async (username) => {
  const query = `
    query userContestRankingInfo($username: String!) { 
      userContestRankingHistory(username: $username) { 
        attended trendDirection problemsSolved totalProblems finishTimeInSeconds rating ranking 
        contest { title startTime } 
      } 
    }`;

  try {
    const response = await axios.post("https://leetcode.com/graphql", {
      query,
      variables: { username },
    });

    const history = response.data.data.userContestRankingHistory;
    if (!history) {
      throw new Error("Invalid LeetCode username");
    }

    return history.filter((contest) => contest.attended === true);
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getLeetCodeStats,
  getLeetCodeCalendar,
  getLeetCodeLast20Submissions,
  getLeetCodeContestData,
  getAttendedLeetcodeContestData,
  getLeetCodeCalendardata,
};

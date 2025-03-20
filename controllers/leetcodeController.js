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
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const getAttendedLeetcodeContestData = async (username) => {
//   const query = `
//     query userContestRankingInfo($username: String!) {
//       userContestRankingHistory(username: $username) {
//         attended
//         trendDirection
//         problemsSolved
//         totalProblems
//         finishTimeInSeconds
//         rating
//         ranking
//         contest {
//           title
//           startTime
//         }
//       }
//     }
//   `;

//   try {
//     const response = await axios.post("https://leetcode.com/graphql", {
//       query,
//       variables: { username },
//     });

//     const attendedContests =
//       response.data.data.userContestRankingHistory.filter(
//         (contest) => contest.attended === true
//       );

//     return attendedContests;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };
const getAttendedLeetcodeContestData = async (username) => {
  const query = `query userContestRankingInfo($username: String!) { 
    userContestRankingHistory(username: $username) { 
      attended trendDirection problemsSolved totalProblems finishTimeInSeconds rating ranking 
      contest { title startTime } 
    } 
  }`;

  try {
    const response = await axios.post("https://leetcode.com/graphql", {
      query,
      variables: { username }, // Use the passed `username`
    });

    return response.data.data.userContestRankingHistory.filter(
      (contest) => contest.attended === true
    );
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
};

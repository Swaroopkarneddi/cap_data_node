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

// const getLeetCodeCalendardata = async (req, res) => {
//   const { username } = req.params;
//   const query = `
//     query userProfileCalendar($username: String!, $year: Int) {
//       matchedUser(username: $username) {
//         userCalendar(year: $year) {
//           submissionCalendar
//         }
//       }
//     }`;

//   try {
//     const response = await axios.post("https://leetcode.com/graphql", {
//       query,
//       variables: { username },
//     });
//     res.json(response.data);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const axios = require("axios");

// const getLeetCodeCalendardata = async (req, res) => {
//   const { username } = req.params;
//   const query = `
//     query userProfileCalendar($username: String!, $year: Int) {
//       matchedUser(username: $username) {
//         userCalendar(year: $year) {
//           activeYears
//           streak
//           totalActiveDays
//           submissionCalendar
//         }
//       }
//     }`;

//   try {
//     const response = await axios.post("https://leetcode.com/graphql", {
//       query,
//       variables: { username },
//     });

//     const calendarData = response.data.data.matchedUser.userCalendar;
//     const submissionCalendar = JSON.parse(calendarData.submissionCalendar);

//     // Convert timestamps to Date objects and organize them by month
//     const months = [
//       "Jan",
//       "Feb",
//       "Mar",
//       "Apr",
//       "May",
//       "Jun",
//       "Jul",
//       "Aug",
//       "Sep",
//       "Oct",
//       "Nov",
//       "Dec",
//     ];
//     const daysInMonth = {
//       Jan: 31,
//       Feb: 28,
//       Mar: 31,
//       Apr: 30,
//       May: 31,
//       Jun: 30,
//       Jul: 31,
//       Aug: 31,
//       Sep: 30,
//       Oct: 31,
//       Nov: 30,
//       Dec: 31,
//     };

//     const formattedData = {
//       totalSubmissions: Object.values(submissionCalendar).reduce(
//         (a, b) => a + b,
//         0
//       ),
//       totalActiveDays: calendarData.totalActiveDays,
//       maxStreak: calendarData.streak,
//       months: months.map((month, index) => {
//         const monthIndex = index + 1;
//         const daysArray = Array.from(
//           { length: daysInMonth[month] },
//           (_, day) => {
//             const date = new Date(
//               `${monthIndex}-${day + 1}-${new Date().getFullYear()}`
//             );
//             const timestamp = Math.floor(date.getTime() / 1000); // Convert to UNIX timestamp
//             return { submissions: submissionCalendar[timestamp] || 0 };
//           }
//         );
//         return { name: month, days: daysArray };
//       }),
//     };

//     res.json(formattedData);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

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

    const submissionCalendar = JSON.parse(
      response.data.data.matchedUser.userCalendar.submissionCalendar
    );

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const oneYearAgoTimestamp = currentTimestamp - 365 * 24 * 60 * 60;

    const filteredData = Object.entries(submissionCalendar).filter(
      ([timestamp]) => timestamp >= oneYearAgoTimestamp
    );

    let totalSubmissions = 0;
    let totalActiveDays = 0;
    let maxStreak = 0;
    let currentStreak = 0;

    const months = Array(12)
      .fill(null)
      .map((_, index) => {
        const monthDate = new Date();
        monthDate.setMonth(monthDate.getMonth() - (11 - index));

        const daysInMonth = new Date(
          monthDate.getFullYear(),
          monthDate.getMonth() + 1,
          0
        ).getDate();

        const days = Array(daysInMonth).fill({ submissions: 0 });

        filteredData.forEach(([timestamp, submissions]) => {
          const date = new Date(Number(timestamp) * 1000);
          if (
            date.getMonth() === monthDate.getMonth() &&
            date.getFullYear() === monthDate.getFullYear()
          ) {
            days[date.getDate() - 1] = { submissions };
            totalSubmissions += submissions;
            totalActiveDays++;
            currentStreak++;
            maxStreak = Math.max(maxStreak, currentStreak);
          } else {
            currentStreak = 0;
          }
        });

        return {
          name: monthDate.toLocaleString("en-US", { month: "short" }),
          days,
        };
      });

    const dummyData = {
      totalSubmissions,
      totalActiveDays,
      maxStreak,
      months,
    };

    res.json(dummyData);
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
  getLeetCodeCalendardata,
};

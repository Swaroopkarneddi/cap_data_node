const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 5000;

app.use(express.json());

app.get("/leetcode/:username", async (req, res) => {
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
});

// get calender data

app.get("/leetcode/submissioncal/:username", async (req, res) => {
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
        badge {
          name
          icon
        }
      }
      submissionCalendar
    }
  }
}
  `;

  try {
    const response = await axios.post("https://leetcode.com/graphql", {
      query,
      variables: { username },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//get last 20 submissions
app.get("/leetcode/last20Sub/:username", async (req, res) => {
  const { username } = req.params;
  const limit = 20;
  const query = `
    query recentAcSubmissions($username: String!, $limit: Int!) {
  recentAcSubmissionList(username: $username, limit: $limit) {
    id
    title
    titleSlug
    timestamp
  }
}
  `;

  try {
    const response = await axios.post("https://leetcode.com/graphql", {
      query,
      variables: { username, limit },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/leetcode/contest/:username", async (req, res) => {
  const { username } = req.params;
  const query = `
    query userContestRankingInfo($username: String!) {
      userContestRanking(username: $username) {
        attendedContestsCount
        rating
        globalRanking
        totalParticipants
        topPercentage
        badge {
          name
        }
      }
      userContestRankingHistory(username: $username) {
        attended
        trendDirection
        problemsSolved
        totalProblems
        finishTimeInSeconds
        rating
        ranking
        contest {
          title
          startTime
        }
      }
    }
  `;

  try {
    const response = await axios.post("https://leetcode.com/graphql", {
      query,
      variables: { username },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// codeforces

app.get("/codeforces/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const response = await axios.get(
      `https://codeforces.com/api/user.info?handles=${username}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Codeforces user rating history
app.get("/codeforces/rating/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const response = await axios.get(
      `https://codeforces.com/api/user.rating?handle=${username}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Codeforces contest list
app.get("/codeforces/contests", async (req, res) => {
  try {
    const response = await axios.get("https://codeforces.com/api/contest.list");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get recent submissions by user
app.get("/codeforces/submissions/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const response = await axios.get(
      `https://codeforces.com/api/user.status?handle=${username}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get solved problems by user
app.get("/codeforces/solved/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const response = await axios.get(
      `https://codeforces.com/api/user.status?handle=${username}`
    );
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
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const axios = require("axios");

const getCodeforcesUser = async (req, res) => {
  const { username } = req.params;
  try {
    const response = await axios.get(
      `https://codeforces.com/api/user.info?handles=${username}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const getCodeforcesRatingHistory = async (req, res) => {
//   const { username } = req.params;
//   try {
//     const response = await axios.get(
//       `https://codeforces.com/api/user.rating?handle=${username}`
//     );
//     res.json(response.data);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
const getCodeforcesRatingHistory = async (username) => {
  try {
    const response = await axios.get(
      `https://codeforces.com/api/user.rating?handle=${username}`
    );
    return response.data.result; // Extract the needed data
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

module.exports = {
  getCodeforcesUser,
  getCodeforcesRatingHistory,
  getCodeforcesContestList,
  getCodeforcesSubmissions,
  getCodeforcesSolvedProblems,
};

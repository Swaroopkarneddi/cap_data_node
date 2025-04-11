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

module.exports = {
  getCodeforcesUser,
  getCodeforcesRatingHistory,
  getCodeforcesContestList,
  getCodeforcesSubmissions,
  getCodeforcesSolvedProblems,
};

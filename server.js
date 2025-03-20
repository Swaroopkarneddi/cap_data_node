const express = require("express");
const leetcodeRoutes = require("./routes/leetcodeRoutes");
const codeforcesRoutes = require("./routes/codeforcesRoutes");
const alldataRoutes = require("./routes/alldataRoutes");

const app = express();
const PORT = 5000;

app.use(express.json());

app.use("/leetcode", leetcodeRoutes);
app.use("/codeforces", codeforcesRoutes);
app.use("/alldata", alldataRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

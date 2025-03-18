Competitive Programming API

This is a simple Express.js API that fetches user data from LeetCode and Codeforces using their public APIs. It provides endpoints to retrieve user profiles, contest rankings, submissions, and solved problems.

Features

Fetch LeetCode user profile and submission statistics.

Fetch LeetCode contest rankings and history.

Fetch Codeforces user profile and rating history.

Fetch Codeforces contests and recent submissions.

Fetch Codeforces solved problems.

Installation & Setup

Prerequisites

Node.js (Ensure Node.js is installed)

npm (Comes with Node.js)

Steps to Install and Run

Clone the repository:

git clone https://github.com/your-username/competitive-programming-api.git
cd competitive-programming-api

Install dependencies:

npm install

Start the server:

node index.js

or (if using nodemon for auto-reloading)

npm install -g nodemon
nodemon index.js

The server will run at:

http://localhost:5000

API Endpoints

LeetCode

Get LeetCode Profile:GET /leetcode/:usernameExample: GET /leetcode/swaroop

Get LeetCode Contest Info:GET /leetcode/contest/:usernameExample: GET /leetcode/contest/swaroop

Codeforces

Get Codeforces Profile:GET /codeforces/:usernameExample: GET /codeforces/tourist

Get Codeforces Rating History:GET /codeforces/rating/:usernameExample: GET /codeforces/rating/tourist

Get Codeforces Contests:GET /codeforces/contests

Get Codeforces Submissions:GET /codeforces/submissions/:usernameExample: GET /codeforces/submissions/tourist

Get Codeforces Solved Problems:GET /codeforces/solved/:usernameExample: GET /codeforces/solved/tourist

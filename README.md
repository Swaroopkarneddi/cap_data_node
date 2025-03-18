# Competitive Programming API

This is a simple Express.js API that fetches user data from LeetCode and Codeforces using their public APIs. It provides endpoints to retrieve user profiles, contest rankings, submissions, and solved problems.

## Features

- Fetch LeetCode user profile and submission statistics.
- Fetch LeetCode contest rankings and history.
- Fetch Codeforces user profile and rating history.
- Fetch Codeforces contests and recent submissions.
- Fetch Codeforces solved problems.

## Installation & Setup

### Prerequisites

- **Node.js** (Ensure Node.js is installed)
- **npm** (Comes with Node.js)

### Steps to Install and Run

#### Clone the repository:

```sh
git clone https://github.com/your-username/competitive-programming-api.git
cd competitive-programming-api
```

#### Install dependencies:

```sh
npm install
```

#### Start the server:

```sh
node index.js
```

or (if using nodemon for auto-reloading):

```sh
npm install -g nodemon
nodemon index.js
```

The server will run at:

```
http://localhost:5000
```

## API Endpoints

### LeetCode

- **Get LeetCode Profile:**

  ```
  GET /leetcode/:username
  ```

  Example: `GET /leetcode/swaroop`

- **Get LeetCode calander Info:**

  ```
  GET /leetcode/submissioncal/:username
  ```

  Example: `GET /leetcode/submissioncal/swaroop`

- **Get LeetCode Contest Info:**

  ```
  GET /leetcode/contest/:username
  ```

  Example: `GET /leetcode/contest/swaroop`

- **Get LeetCode last 20 problems Info:**

  ```
  GET /leetcode/last20Sub/:username
  ```

  Example: `GET /leetcode/last20Sub/swaroop`

### Codeforces

- **Get Codeforces Profile:**

  ```
  GET /codeforces/:username
  ```

  Example: `GET /codeforces/tourist`

- **Get Codeforces Rating History:**

  ```
  GET /codeforces/rating/:username
  ```

  Example: `GET /codeforces/rating/tourist`

- **Get Codeforces Contests:**

  ```
  GET /codeforces/contests
  ```

- **Get Codeforces Submissions:**

  ```
  GET /codeforces/submissions/:username
  ```

  Example: `GET /codeforces/submissions/tourist`

- **Get Codeforces Solved Problems:**
  ```
  GET /codeforces/solved/:username
  ```
  Example: `GET /codeforces/solved/tourist`

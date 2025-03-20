````markdown
# Code Statistics API

This project provides an API that fetches statistics for programming platforms such as **LeetCode** and **Codeforces**. It allows fetching user statistics, submission history, contest data, and more.

## Technologies Used

- **Node.js** (Backend Framework)
- **Express** (API Framework)
- **Axios** (HTTP Client for API Requests)
- **GraphQL** (For LeetCode queries)

## Setup

### Prerequisites

Before you start, make sure you have the following installed:

- **Node.js** (LTS version is recommended)
- **npm** (Node Package Manager)

### Steps to Set Up

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```
````

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   npm start
   ```

   The server will be running at `http://localhost:5000`.

## API Endpoints

### LeetCode Routes

- **/leetcode/:username**  
  Method: `GET`  
  Description: Fetches statistics for a given LeetCode user.  
  Response: LeetCode user statistics, including submission numbers for different difficulties.

- **/leetcode/submissioncal/:username**  
  Method: `GET`  
  Description: Fetches the LeetCode user submission calendar.  
  Response: Calendar of user submissions, streaks, badges, and activity.

- **/leetcode/last20Sub/:username**  
  Method: `GET`  
  Description: Fetches the last 20 submissions of the user on LeetCode.  
  Response: List of the last 20 submissions.

- **/leetcode/contest/:username**  
  Method: `GET`  
  Description: Fetches contest data for the user.  
  Response: User contest data, including rankings, attended contests, and rating.

- **/leetcode/attendedContest/:username**  
  Method: `GET`  
  Description: Fetches attended contest data for the user on LeetCode.  
  Response: Attended contest data, including ranking and performance.

### Codeforces Routes

- **/codeforces/:username**  
  Method: `GET`  
  Description: Fetches Codeforces user information.  
  Response: Codeforces user details.

- **/codeforces/contests**  
  Method: `GET`  
  Description: Fetches a list of available contests on Codeforces.  
  Response: List of available contests.

- **/codeforces/rating/:username**  
  Method: `GET`  
  Description: Fetches rating history for a user on Codeforces.  
  Response: Codeforces rating history.

- **/codeforces/submissions/:username**  
  Method: `GET`  
  Description: Fetches submission history for a user on Codeforces.  
  Response: List of submissions made by the user.

- **/codeforces/solved/:username**  
  Method: `GET`  
  Description: Fetches a list of problems solved by a user on Codeforces.  
  Response: List of problems that the user has solved.

### All Data Route

- **/alldata/:leetcodeId/:codeforcesId**  
  Method: `GET`  
  Description: Fetches combined data from both LeetCode and Codeforces for a given user.  
  Response: Combined statistics for LeetCode and Codeforces.

## Example Requests

### LeetCode Example

- Fetch user stats:

  ```http
  GET http://localhost:5000/leetcode/johndoe
  ```

- Fetch the last 20 submissions for the user:
  ```http
  GET http://localhost:5000/leetcode/last20Sub/johndoe
  ```

### Codeforces Example

- Fetch user information:

  ```http
  GET http://localhost:5000/codeforces/johndoe
  ```

- Fetch the user's rating history:
  ```http
  GET http://localhost:5000/codeforces/rating/johndoe
  ```

## Error Handling

If an error occurs while fetching data from the APIs, the response will return an error message with a 500 status code.

```

This Markdown file contains the entire setup and API details, ready for use in a repository or documentation.
```

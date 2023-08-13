const express = require("express");
const app = express();
const port = 3001;

const USERS = [];

const QUESTIONS = [
  {
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
    ],
  },
];
``;

const SUBMISSION = [];

app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Both Email and Password are required");
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesn't exist)

  const user = USERS.find((user) => user.email === email);
  if (user) {
    return res.status(409).send("User with this email already exists!");
  }

  USERS.push({ email, password });

  // return back 200 status code to the client
  res.status(200).send("User successfully registered!");
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Both email and password are required");
  }

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const user = USERS.find((user) => user.email === email);
  if (!user) {
    return res.status(401).send("User not found");
  }

  if (user.password !== password) {
    return res.status(401).send("Incorrect password");
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  const token = getRandomToken();

  res.status(200).json({ message: "Login Successful", token });
});

function getRandomToken() {
  const tokenLength = 16;
  const alphabet =
    "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let token = "";
  for (let i = 1; i < tokenLength; i++) {
    const char = Math.floor(Math.random() * alphabet.length);
    token += alphabet[char];
  }
  return token;
}

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.status(200).json(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  const userID = req.query.userID;
  const problemID = req.query.problemID;

  if (!userID || !problemID) {
    return res.status(400).send("Both UserID and ProblemID are required");
  }

  const userSubmissions = SUBMISSION.filter((submission) => {
    return (
      submission.userID === parseInt(userID) &&
      submission.problemID === parseInt(problemID)
    );
  });

  res.status(200).json(userSubmissions);
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  const userID = req.body.userID;
  const problemID = req.body.problemID;
  const submissionText = req.body.submission;

  if (!userID || !problemID || !submissionText) {
    return res
      .status(400)
      .send("userID, problemID and submission are required");
  }

  const isAccepted = Math.random() < 0.5;

  // Store the submission in the SUBMISSION array above
  SUBMISSION.push({
    userID,
    problemID,
    submission: submissionText,
    result: isAccepted,
  });

  if (isAccepted) {
    res.status(200).json({ message: "Submission accepted" });
  } else {
    res.status(200).json({ message: "Submission rejected" });
  }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});

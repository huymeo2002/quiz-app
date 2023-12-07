import connect from "./connectDb.js";
import express from "express";
import asyncHandler from "express-async-handler";
import { Question, Attempt } from "./model.js";
import cors from "cors";

connect();

// const express = require('express');

const app = express();

app.use(cors());

app.use(express.json());

// app.use('/attemps', mainRoutes);

export const getCorrectAnswers = async (questionsList) => {
  const obj = {};
  for (const questionsChildList of questionsList) {
    obj[questionsChildList._id] = questionsChildList.correctAnswers;
  }
  return obj;
};

const randomIntFromInterval = (min, max) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const getArrNumber = (max, size) => {
  const ranArr = [];
  if (!size || size === 0) {
    return;
  }

  do {
    const randomNumber = randomIntFromInterval(0, max);

    if (!ranArr.includes(randomNumber)) {
      ranArr.push(randomNumber);
    }
  } while (ranArr.length < size);

  return ranArr;
};

export const getRandomQuestions = (max, size, arr) => {
  const randomArr = [];
  for (const ele of getArrNumber(max, size)) {
    randomArr.push(arr[ele]);
  }

  return randomArr;
};

export const checkUserAnswer = async (userAnswers, correctAnswers) => {
  let result = 0;
  for (const userAnswersChild in userAnswers) {
    if (parseInt(userAnswers.userAnswersChild) === correctAnswers) {
      result++;
    }
  }
  return result;
};

export const handleScoreText = (score) => {
  if (score < 5) return "Practice more to improve it :D";
  if (score >= 5 && score < 7) return "Good, keep up!";
  if (score >= 7 && score < 9) return "Well done!";
  if (score >= 9 && score <= 10) return "Perfect!!!";
  else return "";
};

const createAttempt = asyncHandler(async (req, res) => {
  const questions = await Question.find({});
  const questionsRandomArr = getRandomQuestions(14, 10, questions);
  const newAttempt = new Attempt({
    questions: questionsRandomArr,
    startedAt: new Date(),
    score: 0,
    completed: false,
  });

  const attempt = await newAttempt.save();

  if (newAttempt) {
    res.status(201);
    res.json(attempt);
  } else {
    res.status(404);
    throw new Error("Having problems creating attempt!");
  }
});

const updateAttempt = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const attempt = await Attempt.findById(id);
  const questions = attempt.questions;
  const getCorrAnswers = await getCorrectAnswers(questions);
  const userAnswers = req.body.userAnswers;
  const result = await checkUserAnswer(userAnswers, getCorrAnswers);

  if (attempt) {
    attempt.score = result;
    attempt.userAnswers = userAnswers;
    attempt.correctAnswers = getCorrAnswers;
    attempt.scoreText = handleScoreText(result);
    attempt.completed = true;

    const updatedAttempt = await attempt.save();
    res.json(updatedAttempt);
  }
});

const router = express.Router();

router.route("/").post(createAttempt);
router.route("/:id/submit").post(updateAttempt);

app.use("/attempts", router);

app.listen(3000, function () {
  console.log("Listening on port 3000!");
});

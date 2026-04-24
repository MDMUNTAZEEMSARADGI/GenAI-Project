const mongoose = require("mongoose");

/**
 * - Job description schema : String
 * - Resume text : String
 * - Self description : String
 *
 * - matchScore : Number
 *
 * - Technical questions :
 *   [{
 *       questions:"",
 *       intension:"",
 *       answer:""
 *   }]
 *
 *  - Behavioral questions
 * [{
 *       questions:"",
 *       intension:"",
 *       answer:""
 *   }]
 *
 *  - Skill gaps :
 *   [{
 *     skill : "",
 *     severity :{
 *      type:String,
 *      enum:["low","medium","high"]
 *     }
 *    }]
 *
 *  - Preparation plan :
 *    [{
 *     day : Number,
 *     focus : String,
 *     tasks : [String]
 *    }]
 */

const technicalQuestionSChema = new mongoose.Schema(
  {
    questions: {
      type: String,
      required: [true, "Technical question is required"],
    },
    intenstion: {
      type: String,
      required: [true, "intenstion is required"],
    },
    answers: {
      type: String,
      required: [true, "Anser is required"],
    },
  },
  { _id: false },
);

const behavioralQuestionSchema = new mongoose.Schema(
  {
    questions: {
      type: String,
      required: [true, "Technical question is required"],
    },
    intenstion: {
      type: String,
      required: [true, "intenstion is required"],
    },
    answers: {
      type: String,
      required: [true, "Anser is required"],
    },
  },
  { _id: false },
);

const skillSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      enum: ["low", "medium", "high"],
      required: [true, "Skill is required"],
    },
  },
  { _id: false },
);

const preparationPlanSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: [true, "Day is required"],
  },
  focus: {
    type: String,
    required: [true, "focus is required"],
  },
  tasks: [
    {
      type: String,
      required: [true, "Tasks is required"],
    },
  ],
});

// we can also use meta data
const interviewReportSchema = new mongoose.Schema(
  {
    jobDescription: {
      type: String,
      required: [true, "Job description is required"],
    },
    resume: {
      type: String,
    },
    selfDescription: {
      type: String,
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    technicalQuestion: [technicalQuestionSChema],
    behavioralQuestion: [behavioralQuestionSchema],
    skill: [skillSchema],
    preparationPlan: [preparationPlanSchema],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true },
);

const interviewReportModel = mongoose.model(
  "interviewReports",
  interviewReportSchema,
);

module.exports = interviewReportModel;

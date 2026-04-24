const { Router } = require("express");
const authMiddlware = require("../middlewares/auth.middleware");
const interviewController = require("../controllers/interview.controller");
const upload = require("../middlewares/file.middlware");

const interviewRouter = Router();

/**
 * @route /api/interview/
 * @description Generate new interview report on the basis of user selfd description, resume pdf and job description
 * @access Private
 */

interviewRouter.post("/", authMiddlware.authUser, upload.single("resume"),interviewController.generateInterviewReportController);

module.exports = interviewRouter;

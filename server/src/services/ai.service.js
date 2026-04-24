const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A score between 0 to 100 indicating how well the candidate's profile match the job description ",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical questions can be asked in the interview"),
        intention: z
          .string()
          .describe(
            "The intention of the interviewer behind asking the question",
          ),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "The technical questions that can be asked in the inteview along with their intention and how to answer them",
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical questions can be asked in the interview"),
        intention: z
          .string()
          .describe(
            "The intention of the interviewer behind asking the question",
          ),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Behavioral questions that can be asked in the inteview along with their intention and how to answer them",
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z
          .enum(["low", "medium", "high"])
          .describe(
            "The severity of this skill gap, i.e How important is the skill for them",
          ),
      }),
    )
    .describe(
      "List of skill gaps, in the candidate's profile along with their severity",
    ),
  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe("The day number in the preparation plan, starting from 1"),
        focus: z
          .string()
          .describe(
            "The main focus of this day in the preparation plan, e.g. data structures, system designs, mock interview",
          ),
        task: z
          .string()
          .describe(
            "List of task to be done on this day to follow the preparation plan, e.g. read a specific book  ",
          ),
      }),
    )
    .describe(
      "A day wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
    ),
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
You MUST return STRICT JSON only.

DO NOT return arrays of strings.
Each item MUST be an object with ALL required fields.

Example format:

{
  "matchScore": 85,
  "technicalQuestions": [
    {
      "question": "Explain REST API",
      "intention": "Check API knowledge",
      "answer": "Explain principles like statelessness..."
    }
  ],
  "behavioralQuestions": [
    {
      "question": "Tell me about a challenge",
      "intention": "Check problem solving",
      "answer": "Use STAR method..."
    }
  ],
  "skillGaps": [
    {
      "skill": "Docker",
      "severity": "medium"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "Data Structures",
      "task": "Practice arrays and strings"
    }
  ]
}

Now generate FULL structured response for:

Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(interviewReportSchema),
    },
  });

  return JSON.parse(response.text);

//   console.log(response.text);
}

// testing
// async function invokeGeminiAI() {
//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash-lite",
//       contents: "HEllo gemini ! Exaplin what interview ?",
//     });
//     console.log(response.text);
//   } catch (error) {
//     console.error("Gemini Error:", error.message);
//   }
// }
// module.exports = invokeGeminiAI;

module.exports = generateInterviewReport;

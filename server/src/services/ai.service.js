const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A score between 0 and 100 indicating how well the candidate's profile matches the job describe",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Technical questions that can be asked in the interview along with their intention and how to answer them",
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z
          .enum(["low", "medium", "high"])
          .describe(
            "The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances",
          ),
      }),
    )
    .describe(
      "List of skill gaps in the candidate's profile along with their severity",
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
            "The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc.",
          ),
        tasks: z
          .array(z.string())
          .describe(
            "List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.",
          ),
      }),
    )
    .describe(
      "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
    ),
  title: z
    .string()
    .describe(
      "The title of the job for which the interview report is generated",
    ),
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
Return ONLY valid JSON.

DO NOT return arrays of strings.

Each question MUST be an object.

Correct format:

{
  "matchScore": 90,
  "technicalQuestions": [
    {
      "question": "What is React?",
      "intention": "Check fundamentals",
      "answer": "Explain virtual DOM..."
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
      "focus": "DSA",
      "tasks": ["Solve 5 problems"]
    }
  ],
  "title": "..."
}

IMPORTANT:
- technicalQuestions MUST be array of objects (NOT strings)
- DO NOT use this format: ["question", "..."]
- Always use key-value objects

Now generate report.

Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(interviewReportSchema),
    },
  });

  // return JSON.parse(response.text);
  let parsed;

  try {
    parsed = JSON.parse(response.text);

    // ✅ Validate with Zod (THIS IS KEY)
    const validated = interviewReportSchema.parse(parsed);

    return validated;
  } catch (err) {
    console.error("❌ AI INVALID RESPONSE:", response.text);
    throw new Error("AI response format incorrect");
  }

  // 🔥 FIX TECHNICAL QUESTIONS
  if (parsed.technicalQuestions) {
    parsed.technicalQuestions = formatQuestions(parsed.technicalQuestions);
  }

  // 🔥 FIX BEHAVIORAL QUESTIONS
  if (parsed.behavioralQuestions) {
    parsed.behavioralQuestions = formatQuestions(parsed.behavioralQuestions);
  }

  // 🔥 FIX SKILL GAPS
  if (parsed.skillGaps) {
    parsed.skillGaps = formatSkillGaps(parsed.skillGaps);
  }

  // 🔥 FIX PREPARATION PLAN
  if (parsed.preparationPlan) {
    parsed.preparationPlan = formatPreparation(parsed.preparationPlan);
  }

  return parsed;
}

//--
function formatQuestions(arr) {
  const result = [];

  for (let i = 0; i < arr.length; i += 6) {
    result.push({
      question: arr[i + 1],
      intention: arr[i + 3],
      answer: arr[i + 5],
    });
  }

  return result;
}

function formatSkillGaps(arr) {
  const result = [];

  for (let i = 0; i < arr.length; i += 4) {
    result.push({
      skill: arr[i + 1],
      severity: arr[i + 3],
    });
  }

  return result;
}

function formatPreparation(arr) {
  const result = [];

  for (let i = 0; i < arr.length; i += 6) {
    result.push({
      day: arr[i + 1],
      focus: arr[i + 3],
      tasks: [arr[i + 5]],
    });
  }

  return result;
}

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: {
      top: "20mm",
      bottom: "20mm",
      left: "15mm",
      right: "15mm",
    },
  });

  await browser.close();

  return pdfBuffer;
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const resumePdfSchema = z.object({
    html: z
      .string()
      .describe(
        "The HTML content of the resume which can be converted to PDF using any library like puppeteer",
      ),
  });

  const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(resumePdfSchema),
    },
  });

  const jsonContent = JSON.parse(response.text);

  const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

  return pdfBuffer;
}

module.exports = { generateInterviewReport, generateResumePdf };

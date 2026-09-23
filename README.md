# Math 172 Practice Lab

Open `index.html` in a browser, or upload all files in this folder to the root of a GitHub repository and deploy the repository to Netlify. No build command is needed; the publish directory is the repository root.

- Mixed practice shuffles all 34 questions. Objective mode shuffles questions within one objective. “Practice again” marks are saved in the browser and can form their own practice set.
- Questions 1–33 come from `PracticeExam_Student_Revised.docx`. Question 34 is an added graph question for LF3 so each objective listed in the source exam has practice.
- Equations from the Word document are stored as MathML in `questions.js`, which browsers render as text. `questions.json` is the editable question bank; after editing it, regenerate `questions.js` by assigning the array to `const QUESTION_BANK = ...;`.
- The graphs from questions 13, 14, and 33 are local image assets. Question 34 uses a local SVG. All assets work without external scripts or accounts.
- The source exam includes answers. Students should work each problem before revealing its answer. No automatic grading is implied.

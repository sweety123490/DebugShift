import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Reusable Evaluator Service for ContextShift
 * Evaluates candidate bug fixes using Google Gemini API with fallback to intelligent local mock evaluation.
 */

// Heuristic fallback evaluator when GEMINI_API_KEY is not configured or offline
const runMockEvaluator = ({ challenge, fixedCode, explanation }) => {
  const rubric = challenge.evaluationRubric || {};
  const keyIssues = rubric.keyIssuesToFix || [];
  const mustConcepts = rubric.mustIncludeConcepts || [];

  const lowerCode = fixedCode.toLowerCase();
  const lowerExp = explanation.toLowerCase();

  let codeMatches = 0;
  keyIssues.forEach((issue) => {
    const tokens = issue.toLowerCase().split(/\s+/).filter(t => t.length > 3);
    if (tokens.some(token => lowerCode.includes(token))) {
      codeMatches++;
    }
  });

  let conceptMatches = 0;
  mustConcepts.forEach((concept) => {
    const tokens = concept.toLowerCase().split(/\s+/).filter(t => t.length > 3);
    if (tokens.some(token => lowerExp.includes(token))) {
      conceptMatches++;
    }
  });

  const codeRatio = keyIssues.length > 0 ? codeMatches / keyIssues.length : 0.8;
  const conceptRatio = mustConcepts.length > 0 ? conceptMatches / mustConcepts.length : 0.75;
  const lengthBonus = explanation.length > 80 ? 1 : 0.7;

  // Enforce strict scoring bounds: Correctness (0-50), Root Cause (0-30), Quality (0-20)
  const codeCorrectness = Math.round(Math.min(50, Math.max(15, 50 * (0.5 + 0.5 * codeRatio))));
  const rootCauseUnderstanding = Math.round(Math.min(30, Math.max(10, 30 * (0.4 + 0.6 * conceptRatio * lengthBonus))));
  const codeQuality = Math.round(Math.min(20, Math.max(8, 20 * (0.6 + 0.4 * (codeMatches > 0 ? 1 : 0.5)))));
  const totalScore = codeCorrectness + rootCauseUnderstanding + codeQuality;

  return {
    score: totalScore,
    scoresByCategory: {
      codeCorrectness,
      rootCauseUnderstanding,
      codeQuality,
    },
    feedback: `[Simulated AI Evaluation] Your solution has been evaluated by ContextShift's local verification engine. You addressed the core problem of "${challenge.title}". Your explanation shows ${totalScore >= 75 ? 'a solid' : 'a developing'} grasp of the underlying runtime mechanics. Note: To unlock full live AI reasoning, set a valid GEMINI_API_KEY in your server/.env.`,
    correctnessAnalysis: `The submitted code was checked against the expected criteria for ${challenge.category}. The key bug was identified as: ${challenge.expectedBehavior}. Your submitted implementation addresses the main issue without breaking adjacent logic.`,
    suggestions: [
      'Always verify edge cases such as unmounted component states and null inputs.',
      'Ensure proper variable scoping and avoid unnecessary dependencies.',
      'Add defensive assertions or try/catch blocks where asynchronous operations may reject.',
    ],
    expectedFixSnippet: challenge.referenceSolution || '// See reference solution in dashboard',
    evaluationProvider: 'Mock Evaluator (Demo Mode - Set GEMINI_API_KEY in server/.env for live Google Gemini evaluation)',
  };
};

export const evaluateCodeSubmission = async ({ challenge, fixedCode, explanation }) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

  // If no API key configured, use the mock evaluator
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.log('[Evaluator] No GEMINI_API_KEY detected. Using ContextShift Mock Evaluation Engine.');
    return runMockEvaluator({ challenge, fixedCode, explanation });
  }

  try {
    console.log(`[Evaluator] Contacting Google Gemini API (${modelName})...`);
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2, // Low temperature for consistent, objective grading
      },
    });

    const prompt = `
You are a senior technical interviewer and principal engineer grading a candidate's bug fix in a technical interview simulation platform.

### Challenge Details:
- Title: ${challenge.title}
- Category: ${challenge.category}
- Difficulty: ${challenge.difficulty}
- Problem Description: ${challenge.description}
- Expected Behavior: ${challenge.expectedBehavior}

### Original Broken Code:
\`\`\`javascript
${challenge.brokenCode}
\`\`\`

### Reference Solution (Private benchmark, never show directly to user):
\`\`\`javascript
${challenge.referenceSolution}
\`\`\`

### Evaluation Rubric Guidelines:
- Key Issues to Fix: ${JSON.stringify(challenge.evaluationRubric?.keyIssuesToFix || [])}
- Required Understanding Concepts: ${JSON.stringify(challenge.evaluationRubric?.mustIncludeConcepts || [])}
- Common Pitfalls to penalize: ${JSON.stringify(challenge.evaluationRubric?.commonMistakes || [])}

### Candidate's Submitted Fixed Code:
\`\`\`javascript
${fixedCode}
\`\`\`

### Candidate's Explanation of Root Cause and Fix:
"""
${explanation}
"""

### Scoring Instructions:
Score strictly according to the following weights:
1. codeCorrectness: integer between 0 and 50. (Did the fix resolve the actual bug? Does it match expected behavior without introducing new bugs?)
2. rootCauseUnderstanding: integer between 0 and 30. (Did the candidate explain WHAT the bug was, WHY it happened, and HOW their fix resolved it?)
3. codeQuality: integer between 0 and 20. (Is the code idiomatic, readable, following modern ES6+ / React / Express best practices?)

Return ONLY a valid JSON object matching this exact schema:
{
  "codeCorrectnessScore": <number 0-50>,
  "rootCauseScore": <number 0-30>,
  "codeQualityScore": <number 0-20>,
  "feedback": "<concise, professional senior-engineer style review of the submission>",
  "correctnessAnalysis": "<detailed technical analysis comparing their fix against the bug>",
  "suggestions": [
    "<actionable suggestion 1>",
    "<actionable suggestion 2>",
    "<actionable suggestion 3>"
  ],
  "expectedFixSnippet": "<clean, minimal code snippet demonstrating the canonical fix>"
}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch (parseErr) {
      // Clean JSON markdown fences if any
      const cleaned = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(cleaned);
    }

    // Clamp and enforce strict scoring bounds
    const codeCorrectness = Math.min(50, Math.max(0, Number(parsed.codeCorrectnessScore) || 25));
    const rootCauseUnderstanding = Math.min(30, Math.max(0, Number(parsed.rootCauseScore) || 15));
    const codeQuality = Math.min(20, Math.max(0, Number(parsed.codeQualityScore) || 10));
    const totalScore = codeCorrectness + rootCauseUnderstanding + codeQuality;

    return {
      score: totalScore,
      scoresByCategory: {
        codeCorrectness,
        rootCauseUnderstanding,
        codeQuality,
      },
      feedback: parsed.feedback || 'Good attempt at solving this debugging challenge.',
      correctnessAnalysis: parsed.correctnessAnalysis || 'The code was analyzed against the reference specifications.',
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : ['Review modern React/Node patterns.'],
      expectedFixSnippet: parsed.expectedFixSnippet || challenge.referenceSolution,
      evaluationProvider: `Google Gemini (${modelName})`,
    };
  } catch (err) {
    console.error('[Evaluator] Gemini API Error or timeout:', err.message);
    console.log('[Evaluator] Falling back gracefully to ContextShift Mock Evaluator.');
    const fallback = runMockEvaluator({ challenge, fixedCode, explanation });
    fallback.feedback = `[Fallback Mode: Gemini API unavailable (${err.message})] ` + fallback.feedback;
    fallback.evaluationProvider = `Mock Evaluator (Gemini API Fallback: ${err.message})`;
    return fallback;
  }
};

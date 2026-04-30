import mongoose from 'mongoose';
import Problem from '../models/Problem.js';
import Testcase from '../models/Testcase.js';
import Submission from '../models/Submission.js';
import { mapJudge0StatusToVerdict, runWithJudge0 } from '../services/judge0Service.js';

function normalize(str) {
  return String(str ?? '').trim().replace(/\r\n/g, '\n');
}

async function ensureDefaultProblem() {
  const existing = await Problem.findOne().lean();
  if (existing) return existing;

  const created = await Problem.create({
    title: 'Two Sum',
    description:
      'Given two integers, print their sum. Read two space-separated integers from input and output a single integer.',
    inputFormat: 'A single line containing two integers a and b.',
    outputFormat: 'Print one integer: a + b.',
    constraints: '-10^9 <= a, b <= 10^9',
    difficulty: 'Easy',
    examples: [
      { input: '2 3', output: '5' },
      { input: '-1 4', output: '3' },
    ],
    starterCode: {
      javascript: "const fs = require('fs');\nconst [a, b] = fs.readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\nconsole.log(a + b);",
      python: 'a, b = map(int, input().split())\nprint(a + b)',
      java: 'import java.util.*;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int a = sc.nextInt();\n    int b = sc.nextInt();\n    System.out.println(a + b);\n  }\n}',
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  long long a, b;\n  cin >> a >> b;\n  cout << (a + b) << "\\n";\n  return 0;\n}',
    },
  });

  await Testcase.insertMany([
    { problemId: created._id, input: '2 3', expectedOutput: '5', isHidden: false },
    { problemId: created._id, input: '10 20', expectedOutput: '30', isHidden: false },
    { problemId: created._id, input: '-5 8', expectedOutput: '3', isHidden: true },
    { problemId: created._id, input: '0 0', expectedOutput: '0', isHidden: true },
  ]);

  return created.toObject();
}

export async function getProblems(req, res) {
  try {
    await ensureDefaultProblem();
    const problems = await Problem.find({})
      .select('_id title difficulty')
      .sort({ createdAt: 1 })
      .lean();

    return res.json(
      problems.map((problem) => ({
        id: String(problem._id),
        title: problem.title,
        difficulty: problem.difficulty,
      })),
    );
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getProblem(req, res) {
  try {
    const { id } = req.params;
    const defaultProblem = await ensureDefaultProblem();

    const problem =
      id === 'default'
        ? await Problem.findById(defaultProblem._id).lean()
        : mongoose.Types.ObjectId.isValid(id)
          ? await Problem.findById(id).lean()
          : null;

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    const visibleTestcases = await Testcase.find({
      problemId: problem._id,
      isHidden: false,
    })
      .select('input expectedOutput -_id')
      .lean();

    return res.json({
      ...problem,
      visibleTestcases,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function createProblem(req, res) {
  try {
    const {
      title,
      description,
      inputFormat,
      outputFormat,
      constraints,
      difficulty,
      examples,
      starterCode,
    } = req.body;

    if (!title || !description || !starterCode) {
      return res.status(400).json({
        error: 'title, description and starterCode are required',
      });
    }

    const created = await Problem.create({
      title,
      description,
      inputFormat: inputFormat || '',
      outputFormat: outputFormat || '',
      constraints: constraints || '',
      difficulty: difficulty || 'Easy',
      examples: Array.isArray(examples) ? examples : [],
      starterCode: {
        javascript: starterCode.javascript || '',
        python: starterCode.python || '',
        java: starterCode.java || '',
        cpp: starterCode.cpp || '',
      },
    });

    return res.status(201).json(created);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function createTestcase(req, res) {
  try {
    const { problemId, input, expectedOutput, isHidden } = req.body;
    if (!problemId || input == null || expectedOutput == null) {
      return res.status(400).json({
        error: 'problemId, input and expectedOutput are required',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(problemId)) {
      return res.status(400).json({ error: 'Invalid problemId' });
    }

    const problem = await Problem.findById(problemId).lean();
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    const created = await Testcase.create({
      problemId,
      input,
      expectedOutput,
      isHidden: Boolean(isHidden),
    });

    return res.status(201).json(created);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function runCode(req, res) {
  try {
    const { code, language, input } = req.body;
    if (!code || !language) {
      return res.status(400).json({ error: 'code and language are required' });
    }

    const result = await runWithJudge0({ code, language, input: input || '' });
    return res.json({
      stdout: result.stdout || '',
      stderr: result.stderr || '',
      compile_output: result.compile_output || '',
      status: result.status?.description || 'Unknown',
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function submitCode(req, res) {
  try {
    const { problemId, code, language, userId } = req.body;
    if (!problemId || !code || !language) {
      return res.status(400).json({ error: 'problemId, code and language are required' });
    }

    const problem = await Problem.findById(problemId).lean();
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    const testcases = await Testcase.find({ problemId: problem._id }).lean();
    if (!testcases.length) {
      return res.status(400).json({ error: 'No testcases configured for this problem' });
    }

    let verdict = 'ACCEPTED';
    let passedCount = 0;

    for (const testcase of testcases) {
      const result = await runWithJudge0({
        code,
        language,
        input: testcase.input,
      });

      const statusId = result.status?.id;
      if (statusId !== 3) {
        verdict = mapJudge0StatusToVerdict(statusId, result.status?.description);
        break;
      }

      const actual = normalize(result.stdout);
      const expected = normalize(testcase.expectedOutput);
      if (actual !== expected) {
        verdict = 'WRONG_ANSWER';
        break;
      }

      passedCount += 1;
    }

    await Submission.create({
      userId: userId || 'anonymous',
      problemId: String(problemId),
      code,
      language,
      verdict,
      createdAt: new Date(),
    });

    return res.json({
      verdict,
      total: testcases.length,
      passed: passedCount,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

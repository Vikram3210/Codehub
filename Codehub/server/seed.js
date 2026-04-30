import dotenv from 'dotenv';
import { connectCodeHubDB } from './config/db.js';
import Problem from './models/Problem.js';
import Testcase from './models/Testcase.js';

dotenv.config();

async function seed() {
  try {
    await connectCodeHubDB();

    let problem = await Problem.findOne({ title: 'Two Sum' });
    if (!problem) {
      problem = await Problem.create({
        title: 'Two Sum',
        description:
          'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        inputFormat: 'nums as comma-separated integers on first line, target on second line.',
        outputFormat: 'Two indices in array notation, e.g. [0,1].',
        constraints: 'Exactly one valid answer exists.',
        difficulty: 'Easy',
        examples: [
          { input: '[2,7,11,15]\\n9', output: '[0,1]' },
          { input: '[3,2,4]\\n6', output: '[1,2]' },
        ],
        starterCode: {
          javascript:
            'function twoSum(nums, target) {\n  // return [i, j]\n}\n\nconst fs = require("fs");\nconst lines = fs.readFileSync(0, "utf8").trim().split(/\\n/);\nconst nums = JSON.parse(lines[0]);\nconst target = Number(lines[1]);\nconsole.log(JSON.stringify(twoSum(nums, target)));',
          python:
            'def two_sum(nums, target):\n    pass\n\nimport json, sys\nlines = sys.stdin.read().strip().splitlines()\nnums = json.loads(lines[0])\ntarget = int(lines[1])\nprint(two_sum(nums, target))',
          java:
            'import java.util.*;\n\npublic class Main {\n  static int[] twoSum(int[] nums, int target) {\n    return new int[]{0, 1};\n  }\n\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String arrLine = sc.nextLine().trim();\n    int target = Integer.parseInt(sc.nextLine().trim());\n    arrLine = arrLine.substring(1, arrLine.length() - 1);\n    String[] parts = arrLine.split(",");\n    int[] nums = new int[parts.length];\n    for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i].trim());\n    int[] ans = twoSum(nums, target);\n    System.out.println("[" + ans[0] + "," + ans[1] + "]");\n  }\n}',
          cpp:
            '#include <bits/stdc++.h>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n  return {0, 1};\n}\n\nint main() {\n  string line;\n  getline(cin, line);\n  int target;\n  cin >> target;\n  line = line.substr(1, line.size() - 2);\n  stringstream ss(line);\n  vector<int> nums;\n  string token;\n  while (getline(ss, token, \',\')) nums.push_back(stoi(token));\n  auto ans = twoSum(nums, target);\n  cout << "[" << ans[0] << "," << ans[1] << "]" << endl;\n  return 0;\n}',
        },
      });
    }

    const count = await Testcase.countDocuments({ problemId: problem._id });
    if (!count) {
      await Testcase.insertMany([
        {
          problemId: problem._id,
          input: '[2,7,11,15]\n9',
          expectedOutput: '[0,1]',
          isHidden: false,
        },
        {
          problemId: problem._id,
          input: '[3,2,4]\n6',
          expectedOutput: '[1,2]',
          isHidden: true,
        },
      ]);
    }

    console.log('Seed complete');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
}

seed();

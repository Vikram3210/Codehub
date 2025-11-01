// src/services/api.js - NEW FILE

// Mock test cases for the challenge "Sum two numbers"
const mockTestCases = [
  { input: '2, 3', expectedOutput: '5' },
  { input: '10, 5', expectedOutput: '15' },
  { input: '0, 0', expectedOutput: '0' },
];

/**
 * Simulates sending user code to a secure execution environment.
 * @param {string} code The user's code to run.
 * @param {string} language The language identifier (e.g., 'javascript').
 * @returns {Promise<Array>} A promise that resolves to an array of test results.
 */
export async function runCode(code, language) {
  console.log(`Simulating code execution in ${language}:`, code);
  
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 1500)); 

  const results = mockTestCases.map((test, index) => {
    let output = '';
    let success = false;

    // --- MOCK EXECUTION LOGIC ---
    // In a real app, the backend executes the code, captures stdout, and runs assertions.
    // Here, we check if the code contains a specific expected pattern (e.g., a function that returns the sum).
    
    try {
      // Crude mock: check if the code defines a function that attempts to sum the inputs
      if (code.includes('function sum')) {
          // Use Function constructor to safely evaluate the core logic (DO NOT DO THIS IN PRODUCTION)
          // For the mock, we assume the code works if it includes the right keywords.
          const [a, b] = test.input.split(',').map(Number);
          const mockResult = a + b;
          output = String(mockResult); 
          success = output === test.expectedOutput;

      } else {
        // If the code structure is missing, fail the test
        output = 'Error: Function definition not found.';
        success = false;
      }
    } catch (e) {
      output = `Runtime Error: ${e.message}`;
      success = false;
    }
    // --- END MOCK EXECUTION LOGIC ---
    
    return {
      id: `test-${index + 1}`,
      input: test.input,
      expectedOutput: test.expectedOutput,
      actualOutput: output,
      status: success ? 'Passed' : 'Failed',
    };
  });

  return results;
}
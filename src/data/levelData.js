// Comprehensive Level Data for All Languages
// This file contains theory content and quiz questions for each level

export const LEVEL_DATA = {
  javascript: {
    js_00_intro: {
      order: 0,
      difficulty: 'easy',
      title: 'JavaScript: Introduction & Background',
      theory: `# Introduction to JavaScript

## When and why was JavaScript created?
JavaScript was created in 1995 by Brendan Eich at Netscape to add interactivity to web pages.

## Language level
JavaScript is a **high-level**, **interpreted**, **dynamically typed** language.

## Runtime
JavaScript runs in the browser and on servers via **Node.js**.

## Typical use cases
- Building interactive web pages
- Frontend frameworks (React, Vue, Angular)
- Backend services (Node.js/Express)

## Hello World
\`\`\`javascript
console.log('Hello, JavaScript!')
\`\`\`

## Tooling
- Package manager: npm/yarn/pnpm
- Bundlers: Vite, Webpack
- Transpilers: Babel, TypeScript
`,
      xp: 15,
      quiz: [
        {
          question: 'Who created JavaScript?',
          options: ['Guido van Rossum', 'Brendan Eich', 'James Gosling', 'Bjarne Stroustrup'],
          answer: 'Brendan Eich'
        },
        {
          question: 'JavaScript is primarily considered a…',
          options: ['Low-level language', 'High-level language', 'Assembly language', 'Machine language'],
          answer: 'High-level language'
        },
        {
          question: 'Which runtime lets JavaScript run on servers?',
          options: ['JVM', 'CLR', 'Node.js', 'CPython'],
          answer: 'Node.js'
        },
        {
          question: 'Which command prints text in JavaScript?',
          options: ['print()', 'console.log()', 'System.out.println()', 'echo'],
          answer: 'console.log()'
        }
      ]
    },
    js_01_variables: {
      order: 1,
      difficulty: 'easy',
      title: 'JavaScript: Variables & Data Types',
      theory: `# Variables in JavaScript

Variables are containers for storing data values. In JavaScript, you can declare variables using three keywords:

## Declaration Keywords:
- **const**: For values that will NOT be reassigned (recommended by default)
- **let**: For values that may change (block-scoped)
- **var**: Legacy keyword (avoid in modern JavaScript)

## Data Types:
- **String**: Text data (e.g., "Hello World")
- **Number**: Numeric data (e.g., 42, 3.14)
- **Boolean**: True/false values
- **Undefined**: Variable declared but not assigned
- **Null**: Intentionally empty value
- **Object**: Complex data structures
- **Array**: Ordered lists of values

## Best Practices:
- Use \`const\` by default
- Use \`let\` only when you need to reassign
- Avoid \`var\` in modern JavaScript
- Use descriptive variable names
- Initialize variables when possible`,
      xp: 20,
      quiz: [
        {
          question: 'Which keyword should be used for a value that will NOT be reassigned?',
          options: ['let', 'var', 'const', 'value'],
          answer: 'const'
        },
        {
          question: 'What is the type of the value `true`?',
          options: ['string', 'number', 'boolean', 'null'],
          answer: 'boolean'
        },
        {
          question: 'Which of the following is NOT a valid JavaScript variable name?',
          options: ['myVariable', 'user_name', '2ndPlace', '$price'],
          answer: '2ndPlace'
        },
        {
          question: 'What will be the output of: `console.log(typeof undefined)`?',
          options: ['"undefined"', '"null"', 'undefined', 'null'],
          answer: '"undefined"'
        }
      ]
    },
    js_01b_operators: {
      order: 1.5,
      difficulty: 'easy',
      title: 'JavaScript: Operators & Expressions',
      theory: `# JavaScript Operators & Expressions

## Arithmetic Operators:
\`\`\`javascript
let a = 10, b = 3;
a + b  // 13 (Addition)
a - b  // 7 (Subtraction)
a * b  // 30 (Multiplication)
a / b  // 3.33... (Division)
a % b  // 1 (Modulus/Remainder)
a ** b // 1000 (Exponentiation)
\`\`\`

## Comparison Operators:
\`\`\`javascript
5 == 5   // true (loose equality)
5 === 5  // true (strict equality)
5 != 3   // true (not equal)
5 !== "5" // true (strict not equal)
5 > 3    // true
5 < 3    // false
\`\`\`

## Logical Operators:
\`\`\`javascript
true && false  // false (AND)
true || false  // true (OR)
!true          // false (NOT)
\`\`\`

## Assignment Operators:
\`\`\`javascript
let x = 5;
x += 3;  // x = x + 3 (8)
x -= 2;  // x = x - 2 (6)
x *= 2;  // x = x * 2 (12)
\`\`\`

## Operator Precedence:
Operators are evaluated in a specific order (PEMDAS-like).`,
      xp: 20,
      quiz: [
        {
          question: 'What does `5 % 3` return?',
          options: ['1', '2', '1.67', '0'],
          answer: '2'
        },
        {
          question: 'What is the difference between `==` and `===`?',
          options: ['No difference', '=== checks type, == does not', '== checks type, === does not', 'Both check type'],
          answer: '=== checks type, == does not'
        },
        {
          question: 'What does `!true` return?',
          options: ['true', 'false', 'undefined', 'null'],
          answer: 'false'
        },
        {
          question: 'What does `x += 5` mean?',
          options: ['x = x + 5', 'x = 5', 'x = x * 5', 'x = x - 5'],
          answer: 'x = x + 5'
        }
      ]
    },
    js_02_functions: {
      order: 2,
      difficulty: 'intermediate',
      title: 'JavaScript: Functions & Scope',
      theory: `# Functions in JavaScript

Functions are reusable blocks of code that perform specific tasks.

## Function Declaration:
\`\`\`javascript
function greet(name) {
  return "Hello, " + name;
}
\`\`\`

## Function Expression:
\`\`\`javascript
const greet = function(name) {
  return "Hello, " + name;
};
\`\`\`

## Arrow Functions (ES6+):
\`\`\`javascript
const greet = (name) => {
  return "Hello, " + name;
};
\`\`\`

## Scope:
- **Global Scope**: Variables accessible everywhere
- **Function Scope**: Variables accessible within the function
- **Block Scope**: Variables accessible within blocks (let/const)

## Parameters vs Arguments:
- **Parameters**: Variables in function definition
- **Arguments**: Values passed when calling function

## Return Statement:
- Functions can return values using \`return\`
- Without \`return\`, function returns \`undefined\``,
      xp: 30,
      quiz: [
        {
          question: 'What keyword is used to declare a function?',
          options: ['func', 'function', 'def', 'method'],
          answer: 'function'
        },
        {
          question: 'What will this function return: `function test() { return 5; }`?',
          options: ['undefined', '5', 'null', 'function'],
          answer: '5'
        },
        {
          question: 'Which is the correct arrow function syntax?',
          options: ['() => {}', '=> () {}', 'function => {}', '() -> {}'],
          answer: '() => {}'
        },
        {
          question: 'What is the scope of a variable declared with `let` inside a function?',
          options: ['Global', 'Function', 'Block', 'Module'],
          answer: 'Block'
        }
      ]
    },
    js_03_arrays: {
      order: 3,
      difficulty: 'intermediate',
      title: 'JavaScript: Arrays & Loops',
      theory: `# Arrays and Loops in JavaScript

## Arrays:
Arrays are ordered collections of values, indexed starting from 0.

\`\`\`javascript
const fruits = ['apple', 'banana', 'orange'];
console.log(fruits[0]); // 'apple'
\`\`\`

## Array Methods:
- **push()**: Add element to end
- **pop()**: Remove last element
- **shift()**: Remove first element
- **unshift()**: Add element to beginning
- **length**: Get array length

## Loops:

### For Loop:
\`\`\`javascript
for (let i = 0; i < 5; i++) {
  console.log(i);
}
\`\`\`

### For...of Loop (Arrays):
\`\`\`javascript
for (const fruit of fruits) {
  console.log(fruit);
}
\`\`\`

### For...in Loop (Objects):
\`\`\`javascript
for (const key in object) {
  console.log(key, object[key]);
}
\`\`\`

### While Loop:
\`\`\`javascript
let i = 0;
while (i < 5) {
  console.log(i);
  i++;
}
\`\`\``,
      xp: 40,
      quiz: [
        {
          question: 'What is the index of the first element in an array?',
          options: ['1', '0', '-1', 'first'],
          answer: '0'
        },
        {
          question: 'Which method adds an element to the end of an array?',
          options: ['push()', 'pop()', 'shift()', 'unshift()'],
          answer: 'push()'
        },
        {
          question: 'What will this code output: `for (let i = 0; i < 3; i++) { console.log(i); }`?',
          options: ['0, 1, 2', '1, 2, 3', '0, 1, 2, 3', '1, 2'],
          answer: '0, 1, 2'
        },
        {
          question: 'Which loop is best for iterating over array elements?',
          options: ['for...in', 'for...of', 'while', 'do...while'],
          answer: 'for...of'
        }
      ]
    },
    js_04_objects: {
      order: 4,
      difficulty: 'advanced',
      title: 'JavaScript: Objects & Classes',
      theory: `# Objects and Classes in JavaScript

## Objects:
Objects are collections of key-value pairs (properties and methods).

\`\`\`javascript
const person = {
  name: 'John',
  age: 30,
  greet: function() {
    return 'Hello, I am ' + this.name;
  }
};
\`\`\`

## Object Access:
- **Dot Notation**: \`person.name\`
- **Bracket Notation**: \`person['name']\`

## Classes (ES6+):
\`\`\`javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  greet() {
    return 'Hello, I am ' + this.name;
  }
}

const john = new Person('John', 30);
\`\`\`

## Object Methods:
- **Object.keys()**: Get all keys
- **Object.values()**: Get all values
- **Object.entries()**: Get key-value pairs

## This Keyword:
- Refers to the current object context
- Behavior changes based on how function is called`,
      xp: 50,
      quiz: [
        {
          question: 'How do you access a property named "age" in an object?',
          options: ['object.age', 'object[age]', 'object["age"]', 'Both A and C'],
          answer: 'Both A and C'
        },
        {
          question: 'What does the `this` keyword refer to in a class method?',
          options: ['The global object', 'The class itself', 'The instance', 'undefined'],
          answer: 'The instance'
        },
        {
          question: 'Which method creates a new instance of a class?',
          options: ['new', 'create', 'instance', 'make'],
          answer: 'new'
        },
        {
          question: 'What will `Object.keys({a: 1, b: 2})` return?',
          options: ['[1, 2]', '["a", "b"]', '[{a: 1}, {b: 2}]', 'undefined'],
          answer: '["a", "b"]'
        }
      ]
    },
    js_05_async: {
      order: 5,
      difficulty: 'advanced',
      title: 'JavaScript: Async, Promises & Async/Await',
      theory: `# Async Programming in JavaScript

## Promises
A Promise represents an async result.

\`\`\`javascript
fetch('/api/data')
  .then(resp => resp.json())
  .then(data => console.log(data))
  .catch(err => console.error(err))
\`\`\`

## async/await
Syntactic sugar over Promises.

\`\`\`javascript
async function load() {
  try {
    const resp = await fetch('/api/data');
    const data = await resp.json();
    console.log(data);
  } catch (e) {
    console.error(e);
  }
}
\`\`\`

## Concurrency vs Parallelism
JS is single-threaded; async uses an event loop.`,
      xp: 60,
      quiz: [
        { question: 'A Promise represents…', options: ['A synchronous value', 'An async result', 'A thread', 'A generator'], answer: 'An async result' },
        { question: 'Which keyword waits for a Promise?', options: ['await', 'defer', 'yield', 'next'], answer: 'await' },
        { question: 'Where do you place error handling for async/await?', options: ['after await', 'try/catch', 'finally only', 'cannot handle'], answer: 'try/catch' },
        { question: 'JavaScript concurrency is managed by…', options: ['Threads', 'Event loop', 'Processes', 'Locks'], answer: 'Event loop' }
      ]
    },
    js_06_modules: {
      order: 6,
      difficulty: 'advanced',
      title: 'JavaScript: Modules & ES6 Features',
      theory: `# JavaScript Modules & ES6 Features

## ES6 Modules:
\`\`\`javascript
// export.js
export const PI = 3.14159;
export function circleArea(r) {
  return PI * r * r;
}

// import.js
import { PI, circleArea } from './export.js';
\`\`\`

## Default Exports:
\`\`\`javascript
// export default
export default class Calculator { }

// import
import Calculator from './calculator.js';
\`\`\`

## Destructuring:
\`\`\`javascript
const [a, b] = [1, 2];
const {name, age} = {name: 'John', age: 30};
\`\`\`

## Spread Operator:
\`\`\`javascript
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]
\`\`\`

## Template Literals:
\`\`\`javascript
const name = 'World';
const greeting = \`Hello, \${name}!\`;
\`\`\``,
      xp: 60,
      quiz: [
        {
          question: 'Which keyword exports a module?',
          options: ['export', 'module.exports', 'exports', 'All of the above'],
          answer: 'export'
        },
        {
          question: 'What does destructuring do?',
          options: ['Creates arrays', 'Extracts values from objects/arrays', 'Deletes variables', 'Imports modules'],
          answer: 'Extracts values from objects/arrays'
        },
        {
          question: 'What does the spread operator (...) do?',
          options: ['Copies arrays/objects', 'Multiplies values', 'Divides arrays', 'Nothing'],
          answer: 'Copies arrays/objects'
        },
        {
          question: 'Template literals use which characters?',
          options: ['Single quotes', 'Double quotes', 'Backticks', 'Parentheses'],
          answer: 'Backticks'
        }
      ]
    }
  },
  
  python: {
    py_00_intro: {
      order: 0,
      difficulty: 'easy',
      title: 'Python: Introduction & Background',
      theory: `# Introduction to Python

## When and why was Python created?
Python was created by Guido van Rossum in 1991 to emphasize readability and simplicity.

## Language level
Python is a **high-level**, **interpreted**, **dynamically typed** language.

## Typical use cases
- Data science, ML/AI
- Web development (Django/Flask/FastAPI)
- Scripting and automation

## Hello World
\`\`\`python
print('Hello, Python!')
\`\`\`

## Tooling
- Package manager: pip, pipenv, poetry
- Environments: venv, conda
`,
      xp: 15,
      quiz: [
        {
          question: 'Who created Python?',
          options: ['Linus Torvalds', 'Guido van Rossum', 'Brendan Eich', 'Dennis Ritchie'],
          answer: 'Guido van Rossum'
        },
        {
          question: 'Python is primarily considered a…',
          options: ['Low-level language', 'High-level language', 'Assembly language', 'Machine language'],
          answer: 'High-level language'
        },
        {
          question: 'Which code prints text in Python?',
          options: ['print()', 'console.log()', 'System.out.println()', 'cout <<'],
          answer: 'print()'
        },
        {
          question: 'Which framework is a Python web framework?',
          options: ['React', 'Django', 'Spring', 'Angular'],
          answer: 'Django'
        }
      ]
    },
    py_01_syntax_print: {
      order: 1,
      difficulty: 'easy',
      title: 'Python: Syntax & Print Statements',
      theory: `# Python Syntax and Print Statements

## Python Syntax:
Python uses indentation (whitespace) to define code blocks instead of curly braces.

\`\`\`python
if True:
    print("This is indented")
    print("This too")
\`\`\`

## Print Function:
The \`print()\` function outputs text to the console.

\`\`\`python
print("Hello, World!")
print("Number:", 42)
print("Multiple", "values", "separated", "by", "commas")
\`\`\`

## Print Options:
- **sep**: Separator between values (default: space)
- **end**: What to print at the end (default: newline)
- **file**: Where to print (default: console)

\`\`\`python
print("Hello", "World", sep="-", end="!")
# Output: Hello-World!
\`\`\`

## Comments:
- **Single line**: \`# This is a comment\`
- **Multi-line**: \`"""This is a docstring"""\`

## Variables:
Python variables don't need declaration:
\`\`\`python
name = "Python"
age = 30
is_awesome = True
\`\`\``,
      xp: 20,
      quiz: [
        {
          question: 'What character is used for single-line comments in Python?',
          options: ['//', '#', '/*', '--'],
          answer: '#'
        },
        {
          question: 'How do you print multiple values on the same line?',
          options: ['print("a", "b")', 'print("a" + "b")', 'print("a" "b")', 'All of the above'],
          answer: 'print("a", "b")'
        },
        {
          question: 'What does Python use instead of curly braces for code blocks?',
          options: ['Parentheses', 'Indentation', 'Semicolons', 'Keywords'],
          answer: 'Indentation'
        },
        {
          question: 'What is the default separator in print() function?',
          options: ['Comma', 'Space', 'Newline', 'Tab'],
          answer: 'Space'
        }
      ]
    },
    py_02_data_types: {
      order: 2,
      difficulty: 'easy',
      title: 'Python: Data Types & Structures',
      theory: `# Python Data Types and Data Structures

## Basic Data Types:
- **int**: Integer numbers (42, -5)
- **float**: Decimal numbers (3.14, -2.5)
- **str**: Text strings ("Hello", 'World')
- **bool**: Boolean values (True, False)
- **None**: Represents absence of value

## Data Structures:

### Lists:
\`\`\`python
fruits = ['apple', 'banana', 'orange']
numbers = [1, 2, 3, 4, 5]
mixed = [1, 'hello', True, 3.14]
\`\`\`

### Tuples:
\`\`\`python
coordinates = (10, 20)
colors = ('red', 'green', 'blue')
\`\`\`

### Dictionaries:
\`\`\`python
person = {
    'name': 'Alice',
    'age': 25,
    'city': 'New York'
}
\`\`\`

## Type Checking:
\`\`\`python
type(42)        # <class 'int'>
type("hello")   # <class 'str'>
type(True)      # <class 'bool'>
\`\`\`

## Mutable vs Immutable:
- **Mutable**: Lists, dictionaries (can be changed)
- **Immutable**: Strings, tuples, numbers (cannot be changed)`,
      xp: 30,
      quiz: [
        {
          question: 'Which data type is immutable in Python?',
          options: ['List', 'Dictionary', 'Tuple', 'Set'],
          answer: 'Tuple'
        },
        {
          question: 'What is the correct way to create a list?',
          options: ['list = (1, 2, 3)', 'list = [1, 2, 3]', 'list = {1, 2, 3}', 'list = <1, 2, 3>'],
          answer: 'list = [1, 2, 3]'
        },
        {
          question: 'What will `type(3.14)` return?',
          options: ['<class "int">', '<class "float">', '<class "str">', '<class "bool">'],
          answer: '<class "float">'
        },
        {
          question: 'Which is the correct way to access a dictionary value?',
          options: ['dict.key', 'dict[key]', 'dict->key', 'dict.get(key)'],
          answer: 'dict[key]'
        }
      ]
    },
    py_03_conditionals: {
      order: 3,
      difficulty: 'intermediate',
      title: 'Python: Conditionals & Control Flow',
      theory: `# Python Conditionals and Control Flow

## If Statements:
\`\`\`python
age = 18
if age >= 18:
    print("You are an adult")
elif age >= 13:
    print("You are a teenager")
else:
    print("You are a child")
\`\`\`

## Comparison Operators:
- **==**: Equal to
- **!=**: Not equal to
- **<**: Less than
- **>**: Greater than
- **<=**: Less than or equal
- **>=**: Greater than or equal

## Logical Operators:
- **and**: Both conditions must be true
- **or**: At least one condition must be true
- **not**: Reverses the boolean value

\`\`\`python
if age >= 18 and has_license:
    print("You can drive")
\`\`\`

## Truthiness:
- **Falsy values**: False, 0, "", [], {}, None
- **Truthy values**: Everything else

## Ternary Operator:
\`\`\`python
status = "adult" if age >= 18 else "minor"
\`\`\`

## Nested Conditionals:
\`\`\`python
if age >= 18:
    if has_license:
        print("You can drive")
    else:
        print("You need a license")
else:
    print("You are too young")
\`\`\``,
      xp: 40,
      quiz: [
        {
          question: 'Which operator checks if two values are equal?',
          options: ['=', '==', '===', 'equals'],
          answer: '=='
        },
        {
          question: 'What will this code print: `if 0: print("True") else: print("False")`?',
          options: ['True', 'False', 'Error', 'None'],
          answer: 'False'
        },
        {
          question: 'Which logical operator requires both conditions to be true?',
          options: ['and', 'or', 'not', 'both'],
          answer: 'and'
        },
        {
          question: 'What is the correct syntax for an if-elif-else statement?',
          options: ['if-else-elif', 'if-elif-else', 'if-elseif-else', 'if-else-elseif'],
          answer: 'if-elif-else'
        }
      ]
    },
    py_04_loops: {
      order: 4,
      difficulty: 'advanced',
      title: 'Python: Loops & Iteration',
      theory: `# Python Loops and Iteration

## For Loops:
\`\`\`python
# Iterate over a list
fruits = ['apple', 'banana', 'orange']
for fruit in fruits:
    print(fruit)

# Iterate with range
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

# Iterate with range(start, stop, step)
for i in range(0, 10, 2):
    print(i)  # 0, 2, 4, 6, 8
\`\`\`

## While Loops:
\`\`\`python
count = 0
while count < 5:
    print(count)
    count += 1
\`\`\`

## Loop Control:
- **break**: Exit the loop immediately
- **continue**: Skip to next iteration
- **else**: Execute when loop completes normally

\`\`\`python
for i in range(10):
    if i == 3:
        break  # Exit loop
    print(i)
else:
    print("Loop completed normally")
\`\`\`

## Enumerate:
\`\`\`python
fruits = ['apple', 'banana', 'orange']
for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")
\`\`\`

## List Comprehensions:
\`\`\`python
squares = [x**2 for x in range(5)]
# [0, 1, 4, 9, 16]
\`\`\``,
      xp: 50,
      quiz: [
        {
          question: 'What does `range(5)` generate?',
          options: ['[1, 2, 3, 4, 5]', '[0, 1, 2, 3, 4]', '[1, 2, 3, 4]', '[0, 1, 2, 3, 4, 5]'],
          answer: '[0, 1, 2, 3, 4]'
        },
        {
          question: 'Which keyword exits a loop immediately?',
          options: ['exit', 'break', 'stop', 'end'],
          answer: 'break'
        },
        {
          question: 'What will this code print: `for i in range(3): print(i)`?',
          options: ['1, 2, 3', '0, 1, 2', '0, 1, 2, 3', '1, 2'],
          answer: '0, 1, 2'
        },
        {
          question: 'Which keyword skips to the next iteration?',
          options: ['skip', 'continue', 'next', 'pass'],
          answer: 'continue'
        }
      ]
    },
    py_01b_operators: {
      order: 1.5,
      difficulty: 'easy',
      title: 'Python: Operators & Expressions',
      theory: `# Python Operators & Expressions

## Arithmetic Operators:
\`\`\`python
a = 10
b = 3
a + b  # 13 (Addition)
a - b  # 7 (Subtraction)
a * b  # 30 (Multiplication)
a / b  # 3.33... (Division)
a // b # 3 (Floor division)
a % b  # 1 (Modulus)
a ** b # 1000 (Exponentiation)
\`\`\`

## Comparison Operators:
\`\`\`python
5 == 5   # True
5 != 3   # True
5 > 3    # True
5 < 3    # False
5 >= 5   # True
5 <= 3   # False
\`\`\`

## Logical Operators:
\`\`\`python
True and False  # False
True or False   # True
not True        # False
\`\`\`

## Membership Operators:
\`\`\`python
'x' in 'example'  # True
'z' not in 'example'  # True
\`\`\`

## Identity Operators:
\`\`\`python
a is b      # Checks if same object
a is not b  # Checks if different objects
\`\`\``,
      xp: 20,
      quiz: [
        {
          question: 'What does `10 // 3` return?',
          options: ['3.33', '3', '4', '3.0'],
          answer: '3'
        },
        {
          question: 'Which operator checks membership?',
          options: ['in', 'contains', 'has', 'member'],
          answer: 'in'
        },
        {
          question: 'What does `not True` return?',
          options: ['True', 'False', 'None', 'Error'],
          answer: 'False'
        },
        {
          question: 'What is the difference between `==` and `is`?',
          options: ['No difference', '== compares values, is compares identity', 'is compares values, == compares identity', 'Both are same'],
          answer: '== compares values, is compares identity'
        }
      ]
    },
    py_05_oop_exceptions: {
      order: 5,
      difficulty: 'advanced',
      title: 'Python: OOP & Exceptions',
      theory: `# Python OOP & Exceptions

## Classes & Inheritance
\`\`\`python
class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        return f"{self.name} makes a sound"

class Dog(Animal):
    def speak(self):
        return f"{self.name} barks"

buddy = Dog('Buddy')
print(buddy.speak())
\`\`\`

## Exceptions
\`\`\`python
try:
    x = 1/0
except ZeroDivisionError as e:
    print('Error:', e)
finally:
    print('Cleanup')
\`\`\``,
      xp: 60,
      quiz: [
        { question: 'What method initializes a Python object?', options: ['__create__', '__init__', 'constructor', '__new__'], answer: '__init__' },
        { question: 'Which is true about inheritance?', options: ['Child cannot override', 'Child class extends parent', 'Parent depends on child', 'Not allowed'], answer: 'Child class extends parent' },
        { question: 'How do you raise an exception?', options: ['throw Error()', 'raise Exception()', 'except Exception', 'error()'], answer: 'raise Exception()' },
        { question: 'Which block handles exceptions?', options: ['catch', 'except', 'handle', 'final'], answer: 'except' }
      ]
    },
    py_06_modules_packages: {
      order: 6,
      difficulty: 'advanced',
      title: 'Python: Modules, Packages & Decorators',
      theory: `# Python Modules, Packages & Decorators

## Modules:
\`\`\`python
# math_utils.py
def add(a, b):
    return a + b

# main.py
import math_utils
result = math_utils.add(5, 3)
\`\`\`

## Packages:
\`\`\`python
# mypackage/__init__.py
# mypackage/utils.py

from mypackage import utils
\`\`\`

## Decorators:
\`\`\`python
def my_decorator(func):
    def wrapper():
        print("Before function")
        func()
        print("After function")
    return wrapper

@my_decorator
def say_hello():
    print("Hello!")
\`\`\`

## List Comprehensions (Advanced):
\`\`\`python
squares = [x**2 for x in range(10) if x % 2 == 0]
\`\`\`

## Generators:
\`\`\`python
def count_up_to(n):
    count = 1
    while count <= n:
        yield count
        count += 1
\`\`\``,
      xp: 60,
      quiz: [
        {
          question: 'How do you import a module?',
          options: ['import module', 'require module', 'include module', 'load module'],
          answer: 'import module'
        },
        {
          question: 'What is a decorator?',
          options: ['A function that modifies another function', 'A class', 'A variable', 'A loop'],
          answer: 'A function that modifies another function'
        },
        {
          question: 'What does `yield` do?',
          options: ['Returns a value', 'Creates a generator', 'Stops execution', 'Both A and B'],
          answer: 'Both A and B'
        },
        {
          question: 'What is a package in Python?',
          options: ['A single file', 'A directory with __init__.py', 'A variable', 'A function'],
          answer: 'A directory with __init__.py'
        }
      ]
    }
  },
  
  java: {
    java_00_intro: {
      order: 0,
      difficulty: 'easy',
      title: 'Java: Introduction & Background',
      theory: `# Introduction to Java

## When and why was Java created?
Java was created at Sun Microsystems in 1995 (James Gosling) with the motto "Write once, run anywhere".

## Language level
Java is a **high-level**, **compiled**, **statically typed** language running on the **JVM**.

## Typical use cases
- Enterprise backends
- Android apps
- Big data ecosystems

## Hello World
\`\`\`java
public class Main {
  public static void main(String[] args) {
    System.out.println("Hello, Java!");
  }
}
\`\`\`

## Tooling
- Build tools: Maven, Gradle
- Package manager: built into Maven/Gradle
`,
      xp: 15,
      quiz: [
        {
          question: 'Java runs on which virtual machine?',
          options: ['CLR', 'JVM', 'V8', 'CPython'],
          answer: 'JVM'
        },
        {
          question: 'Java is primarily…',
          options: ['Dynamically typed', 'Statically typed', 'Untyped', 'Type inferred only'],
          answer: 'Statically typed'
        },
        {
          question: 'Which build tool is common in Java?',
          options: ['npm', 'pip', 'Maven', 'cargo'],
          answer: 'Maven'
        },
        {
          question: 'Who is credited as the father of Java?',
          options: ['James Gosling', 'Dennis Ritchie', 'Ken Thompson', 'Anders Hejlsberg'],
          answer: 'James Gosling'
        }
      ]
    },
    java_01_basics: {
      order: 1,
      difficulty: 'easy',
      title: 'Java: Basics & Syntax',
      theory: `# Java Basics and Syntax

## Java Program Structure:
\`\`\`java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
\`\`\`

## Key Concepts:
- **Class**: Blueprint for objects
- **Method**: Function inside a class
- **main()**: Entry point of Java programs
- **System.out.println()**: Print to console

## Variables:
\`\`\`java
int age = 25;           // Integer
double price = 19.99;   // Decimal number
String name = "Java";    // Text
boolean isActive = true; // True/false
char grade = 'A';       // Single character
\`\`\`

## Data Types:
- **Primitive**: int, double, boolean, char, byte, short, long, float
- **Reference**: String, Arrays, Objects

## Naming Conventions:
- **Classes**: PascalCase (MyClass)
- **Methods/Variables**: camelCase (myMethod)
- **Constants**: UPPER_SNAKE_CASE (MAX_SIZE)

## Comments:
\`\`\`java
// Single line comment
/* Multi-line comment */
/** Documentation comment */
\`\`\``,
      xp: 20,
      quiz: [
        {
          question: 'What is the entry point of a Java program?',
          options: ['start()', 'main()', 'init()', 'begin()'],
          answer: 'main()'
        },
        {
          question: 'Which keyword is used to print to console in Java?',
          options: ['print()', 'System.out.println()', 'console.log()', 'printf()'],
          answer: 'System.out.println()'
        },
        {
          question: 'What is the correct way to declare an integer variable?',
          options: ['int x = 5;', 'integer x = 5;', 'var x = 5;', 'int x = "5";'],
          answer: 'int x = 5;'
        },
        {
          question: 'Which naming convention is used for Java classes?',
          options: ['camelCase', 'snake_case', 'PascalCase', 'kebab-case'],
          answer: 'PascalCase'
        }
      ]
    },
    java_01b_operators: {
      order: 1.5,
      difficulty: 'easy',
      title: 'Java: Operators & Expressions',
      theory: `# Java Operators & Expressions

## Arithmetic Operators:
\`\`\`java
int a = 10, b = 3;
a + b  // 13 (Addition)
a - b  // 7 (Subtraction)
a * b  // 30 (Multiplication)
a / b  // 3 (Integer division)
a % b  // 1 (Modulus)
\`\`\`

## Comparison Operators:
\`\`\`java
5 == 5   // true
5 != 3   // true
5 > 3    // true
5 < 3    // false
5 >= 5   // true
\`\`\`

## Logical Operators:
\`\`\`java
true && false  // false (AND)
true || false  // true (OR)
!true          // false (NOT)
\`\`\`

## Increment/Decrement:
\`\`\`java
int x = 5;
x++;  // x = 6 (Post-increment)
++x;  // x = 7 (Pre-increment)
x--;  // x = 6 (Post-decrement)
\`\`\`

## Ternary Operator:
\`\`\`java
int max = (a > b) ? a : b;
\`\`\``,
      xp: 20,
      quiz: [
        {
          question: 'What does `10 / 3` return in Java?',
          options: ['3.33', '3', '4', 'Error'],
          answer: '3'
        },
        {
          question: 'What is the difference between `++x` and `x++`?',
          options: ['No difference', '++x increments before use, x++ after', 'x++ increments before, ++x after', 'Both are same'],
          answer: '++x increments before use, x++ after'
        },
        {
          question: 'What does `!true` return?',
          options: ['true', 'false', '1', '0'],
          answer: 'false'
        },
        {
          question: 'What is the ternary operator syntax?',
          options: ['condition ? value1 : value2', 'if condition then value1 else value2', 'condition : value1 ? value2', 'value1 ? value2 : condition'],
          answer: 'condition ? value1 : value2'
        }
      ]
    },
    java_02_oop: {
      order: 2,
      difficulty: 'intermediate',
      title: 'Java: Object-Oriented Programming',
      timeLimit: 180,
      theory: `# Java Object-Oriented Programming

## Classes and Objects:
\`\`\`java
public class Car {
    // Fields (attributes)
    private String brand;
    private int year;
    
    // Constructor
    public Car(String brand, int year) {
        this.brand = brand;
        this.year = year;
    }
    
    // Methods (behaviors)
    public void start() {
        System.out.println("Car is starting...");
    }
    
    public String getBrand() {
        return brand;
    }
}
\`\`\`

## Creating Objects:
\`\`\`java
Car myCar = new Car("Toyota", 2020);
myCar.start();
\`\`\`

## OOP Principles:
- **Encapsulation**: Data hiding with private fields
- **Inheritance**: Classes can extend other classes
- **Polymorphism**: Same interface, different implementations
- **Abstraction**: Hide complex implementation details

## Access Modifiers:
- **public**: Accessible from anywhere
- **private**: Only within the same class
- **protected**: Same package or subclasses
- **default**: Same package only

## This Keyword:
- Refers to the current object instance
- Used to distinguish between instance variables and parameters

## Constructor Chaining & super

- Use "this(...)" to call another constructor in the same class.
- Use "super(...)" to call a superclass constructor.

\`\`\`java
public class Player extends Person {
    public Player(String name) {
        super(name); // call Person(String)
    }
}
\`\`\`

## Key Design Tips

- Prefer composition over inheritance when possible.
- Use interfaces when behaviour varies per implementation.
- Create immutable classes for shared data objects.
`,
      xp: 30,
      quiz: [
        {
          question: 'What keyword is used to create a new object?',
          options: ['new', 'create', 'make', 'instance'],
          answer: 'new',
          explanations: {
            new: 'The `new` keyword allocates memory and invokes the constructor, creating a fresh object instance.',
            create: '`create` is not a Java keyword; object construction must use `new` or factory methods.',
            make: '`make` does not exist in Java for instantiation; it is an informal verb, not syntax.',
            instance: '`instance` refers to an object conceptually, but it is not a keyword that creates one.'
          }
        },
        {
          question: 'Which access modifier makes a field accessible only within the same class?',
          options: ['public', 'private', 'protected', 'default'],
          answer: 'private',
          explanations: {
            public: '`public` exposes the member everywhere, which is the opposite of restricting it to the class.',
            private: '`private` hides the member so it can only be accessed inside the declaring class.',
            protected: '`protected` allows access from subclasses and same-package classes, not just the class itself.',
            default: 'The default (package-private) modifier lets any class in the same package access it.'
          }
        },
        {
          question: 'What does the `this` keyword refer to?',
          options: ['The class', 'The current object', 'The parent class', 'The method'],
          answer: 'The current object',
          explanations: {
            'The class': '`this` is an instance reference, not a pointer to the class definition.',
            'The current object': '`this` refers to the current object so you can access its fields and methods.',
            'The parent class': 'To reference the superclass you use `super`, while `this` stays on the current instance.',
            'The method': '`this` is not a method reference; it is the object on which the current method is executing.'
          }
        },
        {
          question: 'What is the purpose of a constructor?',
          options: ['To destroy objects', 'To initialize objects', 'To call methods', 'To create classes'],
          answer: 'To initialize objects',
          explanations: {
            'To destroy objects': 'Java relies on the garbage collector to destroy objects; constructors never destroy.',
            'To initialize objects': 'Constructors set up the initial state of new objects right after memory allocation.',
            'To call methods': 'Constructors can call methods, but their primary job is not generic method dispatch.',
            'To create classes': 'Classes are defined with the `class` keyword; constructors only run when instances are made.'
          }
        },
        {
          question: 'Which OOP principle hides internal data and exposes operations?',
          options: ['Encapsulation', 'Inheritance', 'Abstraction', 'Polymorphism'],
          answer: 'Encapsulation',
          explanations: {
            Encapsulation: 'Encapsulation keeps data private and exposes controlled accessors or methods.',
            Inheritance: 'Inheritance allows classes to reuse behaviour, not specifically hide data.',
            Abstraction: 'Abstraction focuses on exposing only essentials, but encapsulation is about sealing data.',
            Polymorphism: 'Polymorphism lets different types share an interface; it does not hide state.'
          }
        },
        {
          question: 'What does calling `super()` inside a subclass constructor achieve?',
          options: ['Invokes another constructor in the same class', 'Invokes the superclass constructor', 'Creates a new object', 'Calls the destructor'],
          answer: 'Invokes the superclass constructor',
          explanations: {
            'Invokes another constructor in the same class': 'Use `this(...)` to chain constructors inside the same class.',
            'Invokes the superclass constructor': '`super()` explicitly runs the parent constructor to set inherited state.',
            'Creates a new object': '`super()` does not instantiate; it configures the current object via the parent constructor.',
            'Calls the destructor': 'Java has no destructor keyword; cleanup is managed by the garbage collector.'
          }
        }
      ]
    },
    java_03_inheritance: {
      order: 3,
      difficulty: 'intermediate',
      title: 'Java: Inheritance & Polymorphism',
      timeLimit: 180,
      theory: `# Java Inheritance and Polymorphism

## Inheritance:
\`\`\`java
// Parent class
public class Vehicle {
    protected String brand;
    
    public Vehicle(String brand) {
        this.brand = brand;
    }
    
    public void start() {
        System.out.println("Vehicle is starting...");
    }
}

// Child class
public class Car extends Vehicle {
    private int doors;
    
    public Car(String brand, int doors) {
        super(brand);  // Call parent constructor
        this.doors = doors;
    }
    
    @Override
    public void start() {
        System.out.println("Car is starting...");
    }
}
\`\`\`

## Key Concepts:
- **extends**: Keyword for inheritance
- **super()**: Call parent constructor
- **@Override**: Indicates method overriding
- **protected**: Accessible to subclasses

## Polymorphism:
\`\`\`java
Vehicle vehicle = new Car("Toyota", 4);
vehicle.start();  // Calls Car's start() method
\`\`\`

## Method Overriding:
- Child class provides specific implementation
- Must have same signature as parent method
- Use @Override annotation

## Abstract Classes:
\`\`\`java
public abstract class Shape {
    public abstract double getArea();
    
    public void display() {
        System.out.println("Area: " + getArea());
    }
}
\`\`\`

## Interfaces vs Abstract Classes

- Interface = behaviour contract (all methods abstract by default).
- Abstract class = shared state + partial implementation.

## Polymorphism in Practice

\`\`\`java
List<Vehicle> fleet = List.of(new Car("Tesla", 4), new Bike("Ducati"));
for (Vehicle v : fleet) {
    v.start(); // dynamic dispatch based on runtime type
}
\`\`\``,
      xp: 40,
      quiz: [
        {
          question: 'What keyword is used for inheritance in Java?',
          options: ['inherits', 'extends', 'implements', 'super'],
          answer: 'extends',
          explanations: {
            inherits: '`inherits` describes the concept but is not valid Java syntax.',
            extends: '`extends` declares that a class inherits from another class.',
            implements: '`implements` is used for interfaces, not class inheritance.',
            super: '`super` accesses superclass members; it does not declare inheritance.'
          }
        },
        {
          question: 'What does the `super()` keyword do?',
          options: ['Calls parent constructor', 'Calls child constructor', 'Creates object', 'Destroys object'],
          answer: 'Calls parent constructor',
          explanations: {
            'Calls parent constructor': '`super()` executes the superclass constructor before the subclass initializes its own fields.',
            'Calls child constructor': 'Child constructors run automatically; `super()` specifically targets the parent.',
            'Creates object': 'The object already exists when the constructor runs; `super()` does not allocate memory.',
            'Destroys object': 'Java has no explicit destructor keyword; memory cleanup is automatic.'
          }
        },
        {
          question: 'What annotation indicates method overriding?',
          options: ['@Override', '@Overload', '@Extend', '@Super'],
          answer: '@Override',
          explanations: {
            '@Override': '`@Override` tells the compiler you intend to replace a superclass method.',
            '@Overload': 'Method overloading is a different concept and has no required annotation.',
            '@Extend': '`@Extend` is not a standard Java annotation.',
            '@Super': '`@Super` does not exist in Java; use `@Override` to mark overrides.'
          }
        },
        {
          question: 'Which access modifier allows access to subclasses?',
          options: ['public', 'private', 'protected', 'default'],
          answer: 'protected',
          explanations: {
            public: 'Public members are visible everywhere, not just to subclasses.',
            private: '`private` hides the member even from subclasses.',
            protected: '`protected` members are visible to subclasses (and package mates).',
            default: 'Package-private visibility excludes subclasses in different packages.'
          }
        },
        {
          question: 'Interfaces provide...',
          options: ['Implementation only', 'Multiple inheritance of type', 'Private constructors', 'State management'],
          answer: 'Multiple inheritance of type',
          explanations: {
            'Implementation only': 'Interfaces historically lacked implementation; default methods are optional, but the focus is type.',
            'Multiple inheritance of type': 'A class can implement many interfaces, gaining multiple type identities.',
            'Private constructors': 'Interfaces cannot declare constructors.',
            'State management': 'Interfaces cannot hold instance state; they may have constants but not mutable fields.'
          }
        },
        {
          question: 'Dynamic method dispatch happens...',
          options: ['At compile time', 'At runtime', 'During linking', 'Never in Java'],
          answer: 'At runtime',
          explanations: {
            'At compile time': 'Compile time binding is for static methods; virtual calls resolve later.',
            'At runtime': 'The JVM chooses the proper overridden implementation while the program runs.',
            'During linking': 'Java linking loads classes but does not pick overridden methods per invocation.',
            'Never in Java': 'Java relies heavily on runtime dispatch to support polymorphism.'
          }
        }
      ]
    },
    java_04_collections: {
      order: 4,
      difficulty: 'advanced',
      title: 'Java: Collections & Generics',
      timeLimit: 240,
      theory: `# Java Collections and Generics

## Collections Framework:
Java provides data structures to store and manipulate groups of objects.

## List Interface:
\`\`\`java
import java.util.ArrayList;
import java.util.List;

List<String> fruits = new ArrayList<>();
fruits.add("apple");
fruits.add("banana");
fruits.add("orange");

// Access elements
String first = fruits.get(0);
int size = fruits.size();
\`\`\`

## Map Interface:
\`\`\`java
import java.util.HashMap;
import java.util.Map;

Map<String, Integer> ages = new HashMap<>();
ages.put("Alice", 25);
ages.put("Bob", 30);

int aliceAge = ages.get("Alice");
\`\`\`

## Set Interface:
\`\`\`java
import java.util.HashSet;
import java.util.Set;

Set<String> uniqueNames = new HashSet<>();
uniqueNames.add("Alice");
uniqueNames.add("Bob");
uniqueNames.add("Alice");  // Duplicate, won't be added
\`\`\`

## Generics:
- Provide type safety at compile time
- Eliminate need for casting
- Make code more readable

## Common Methods:
- **add()**: Add element
- **remove()**: Remove element
- **size()**: Get number of elements
- **contains()**: Check if element exists`,
      xp: 50,
      quiz: [
        {
          question: 'Which interface is used for ordered collections?',
          options: ['Set', 'Map', 'List', 'Queue'],
          answer: 'List',
          explanations: {
            Set: 'Most `Set` implementations do not preserve insertion order.',
            Map: '`Map` stores key-value pairs and is not a simple ordered sequence.',
            List: '`List` guarantees positional access and preserves element order.',
            Queue: 'Queues focus on head/tail processing; ordering is tied to removal strategy, not positional indexing.'
          }
        },
        {
          question: 'What is the purpose of generics in Java?',
          options: ['Performance', 'Type safety', 'Memory management', 'Code organization'],
          answer: 'Type safety',
          explanations: {
            Performance: 'Generics do not change runtime performance; they are mostly erased at compile time.',
            'Type safety': 'Generics let the compiler enforce the types stored in a collection.',
            'Memory management': 'The garbage collector manages memory regardless of generics.',
            'Code organization': 'Generics aid readability but their core benefit is preventing type errors.'
          }
        },
        {
          question: 'Which collection automatically removes duplicates?',
          options: ['List', 'Set', 'Map', 'Array'],
          answer: 'Set',
          explanations: {
            List: 'Lists can store duplicates because they are positional sequences.',
            Set: '`Set` semantics guarantee that duplicate elements are not stored.',
            Map: 'Maps focus on unique keys but allow duplicate values; they are not purely collections.',
            Array: 'Arrays accept duplicates because they simply store values by index.'
          }
        },
        {
          question: 'What does `List<String>` mean?',
          options: ['List of strings', 'String list', 'Generic list', 'All of the above'],
          answer: 'All of the above',
          explanations: {
            'List of strings': '`List<String>` reads as “a list containing strings”.',
            'String list': 'Informally you can call it a “string list”, describing the same type.',
            'Generic list': 'It is a generic list parameterised with `String`.',
            'All of the above': 'All phrasings describe the same generic type signature.'
          }
        },
        {
          question: 'Which implementation provides constant-time `get()`?',
          options: ['LinkedList', 'ArrayList', 'HashSet', 'TreeSet'],
          answer: 'ArrayList',
          explanations: {
            LinkedList: '`LinkedList` must traverse nodes, so index access is O(n).',
            ArrayList: '`ArrayList` stores elements contiguously, giving O(1) random access.',
            HashSet: '`HashSet` is not index-based; it has no `get(index)` method.',
            TreeSet: '`TreeSet` is a sorted set without positional access.'
          }
        },
        {
          question: 'What does `Map.computeIfAbsent(key, k -> new ArrayList<>())` do?',
          options: ['Always removes key', 'Only updates existing values', 'Initializes value when missing', 'Throws exception if key absent'],
          answer: 'Initializes value when missing',
          explanations: {
            'Always removes key': '`computeIfAbsent` never removes keys; it adds or reuses values.',
            'Only updates existing values': 'It only calls the lambda if the key is missing, not when it already exists.',
            'Initializes value when missing': 'If the key is absent, it creates and stores a new `ArrayList`.',
            'Throws exception if key absent': 'The whole point is to avoid exceptions by creating the missing entry.'
          }
        }
      ]
    },
    java_05_concurrency: {
      order: 5,
      difficulty: 'advanced',
      title: 'Java: Concurrency & Streams',
      timeLimit: 240,
      theory: `# Java Concurrency & Streams

## Threads
\`\`\`java
new Thread(() -> System.out.println("Hello from thread")).start();
\`\`\`

## Executors
\`\`\`java
ExecutorService pool = Executors.newFixedThreadPool(4);
pool.submit(() -> doWork());
\`\`\`

## Streams
Functional-style operations over collections.

\`\`\`java
List<Integer> nums = List.of(1,2,3);
int sum = nums.stream().map(n -> n * 2).reduce(0, Integer::sum);
\`\`\`

## Synchronization & Futures
- Use "synchronized" blocks to guard shared state.
- CompletableFuture simplifies async pipelines.
- Always shut down executors to free threads.
`,
      xp: 60,
      quiz: [
        {
          question: 'Which creates a thread?',
          options: ['new Thread()', 'Thread()', 'make Thread', 'spawn'],
          answer: 'new Thread()',
          explanations: {
            'new Thread()': 'Invoking the `Thread` constructor with `new` creates a fresh thread (which you then start).',
            'Thread()': '`Thread()` without `new` is not valid syntax; you must instantiate the class.',
            'make Thread': '`make` is not a Java keyword; thread creation uses the `Thread` class constructor.',
            'spawn': '`spawn` is not part of Java’s threading API.'
          }
        },
        {
          question: 'What do Executors manage?',
          options: ['Memory', 'Thread pools', 'Streams', 'I/O only'],
          answer: 'Thread pools',
          explanations: {
            Memory: 'Garbage collection manages memory, not the `Executor` framework.',
            'Thread pools': 'Executors abstract over thread pools, queuing and running submitted tasks.',
            Streams: 'Streams process data pipelines; Executors schedule runnable tasks.',
            'I/O only': 'Executors can run any computation, not just I/O tasks.'
          }
        },
        {
          question: 'Streams are…',
          options: ['Parallel only', 'I/O only', 'Functional pipes over data', 'Threads'],
          answer: 'Functional pipes over data',
          explanations: {
            'Parallel only': 'Streams can be sequential or parallel; parallelism is optional.',
            'I/O only': 'Java streams process in-memory data, distinct from I/O streams.',
            'Functional pipes over data': 'The Stream API applies functional transformations over collections of data.',
            Threads: 'Streams use internal iteration but they are not themselves threads.'
          }
        },
        {
          question: 'Which reduces a stream to one value?',
          options: ['map', 'filter', 'reduce', 'collectFirst'],
          answer: 'reduce',
          explanations: {
            map: '`map` transforms each element but keeps the same count.',
            filter: '`filter` removes elements but may leave many values.',
            reduce: '`reduce` combines elements to produce a single summary result.',
            collectFirst: '`collectFirst` is not part of the Java Stream API.'
          }
        },
        {
          question: 'What does `ExecutorService.shutdown()` do?',
          options: ['Immediately kills threads', 'Prevents new tasks while finishing current ones', 'Restarts the pool', 'Blocks forever'],
          answer: 'Prevents new tasks while finishing current ones',
          explanations: {
            'Immediately kills threads': '`shutdown()` lets current tasks finish; `shutdownNow()` interrupts running tasks.',
            'Prevents new tasks while finishing current ones': '`shutdown()` stops new submissions and waits for active tasks to complete.',
            'Restarts the pool': 'There is no restart behaviour; shutdown transitions the pool toward termination.',
            'Blocks forever': 'The call returns immediately; you use `awaitTermination` to block.'
          }
        },
        {
          question: 'Which class represents async pipelines?',
          options: ['Thread', 'Runnable', 'CompletableFuture', 'FutureTask'],
          answer: 'CompletableFuture',
          explanations: {
            Thread: '`Thread` is a basic thread of execution, not a composition-friendly pipeline.',
            Runnable: '`Runnable` models a task with no return value; it lacks completion chaining.',
            CompletableFuture: '`CompletableFuture` models asynchronous computations with chaining and combination operations.',
            FutureTask: '`FutureTask` wraps a single computation but lacks the fluent API of `CompletableFuture`.'
          }
        }
      ]
    },
    java_06_lambdas_streams: {
      order: 6,
      difficulty: 'advanced',
      title: 'Java: Lambdas, Streams & Functional Programming',
      timeLimit: 240,
      theory: `# Java Lambdas & Functional Programming

## Lambda Expressions:
\`\`\`java
// Old way
Runnable r = new Runnable() {
    public void run() {
        System.out.println("Hello");
    }
};

// Lambda way
Runnable r = () -> System.out.println("Hello");
\`\`\`

## Stream API:
\`\`\`java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
numbers.stream()
    .filter(n -> n % 2 == 0)
    .map(n -> n * 2)
    .forEach(System.out::println);
\`\`\`

## Method References:
\`\`\`java
list.forEach(System.out::println);
list.sort(String::compareToIgnoreCase);
\`\`\`

## Optional:
\`\`\`java
Optional<String> name = Optional.of("Java");
name.ifPresent(System.out::println);
\`\`\`

## Functional Interfaces:
- Predicate, Function, Consumer, Supplier

## Parallel Streams & Collectors

\`\`\`java
long count = numbers.parallelStream()
                   .filter(n -> n % 2 == 0)
                   .count();

Map<Boolean, List<Integer>> grouped = numbers.stream()
    .collect(Collectors.partitioningBy(n -> n % 2 == 0));
\`\`\`
`,
      xp: 60,
      quiz: [
        {
          question: 'What is a lambda expression?',
          options: ['A class', 'An anonymous function', 'A variable', 'A loop'],
          answer: 'An anonymous function',
          explanations: {
            'A class': 'Classes are named type declarations; lambdas are short-lived function literals.',
            'An anonymous function': 'Lambdas are anonymous functions that implement functional interfaces.',
            'A variable': 'Variables hold values; a lambda can be assigned to a variable but is not itself one.',
            'A loop': 'Loops are control structures, not functional expressions.'
          }
        },
        {
          question: 'What does `filter()` do in streams?',
          options: ['Transforms elements', 'Selects elements matching condition', 'Sorts elements', 'Counts elements'],
          answer: 'Selects elements matching condition',
          explanations: {
            'Transforms elements': 'Use `map` to transform elements.',
            'Selects elements matching condition': '`filter` keeps only elements for which the predicate returns true.',
            'Sorts elements': 'Sorting is handled by `sorted()`.',
            'Counts elements': 'Counting is done via `count()`.'
          }
        },
        {
          question: 'What is `System.out::println`?',
          options: ['A lambda', 'A method reference', 'A class', 'A variable'],
          answer: 'A method reference',
          explanations: {
            'A lambda': 'It behaves similarly to a lambda but uses method reference syntax.',
            'A method reference': 'The `::` operator creates a method reference to reuse an existing method.',
            'A class': '`System.out` is a PrintStream instance, not a class definition.',
            'A variable': 'This expression is not a standalone variable; it references a method.'
          }
        },
        {
          question: 'What is Optional used for?',
          options: ['Handling null values safely', 'Creating arrays', 'Defining classes', 'Looping'],
          answer: 'Handling null values safely',
          explanations: {
            'Handling null values safely': '`Optional` wraps a possibly absent value to avoid direct null checks.',
            'Creating arrays': 'Arrays are created with the `new` keyword or literals, not `Optional`.',
            'Defining classes': '`class` keyword defines classes; Optional just wraps values.',
            Looping: 'Iterating is unrelated to Optional; use loops or stream operations.'
          }
        },
        {
          question: 'Which functional interface consumes a value and returns nothing?',
          options: ['Supplier', 'Predicate', 'Consumer', 'Function'],
          answer: 'Consumer',
          explanations: {
            Supplier: 'A Supplier provides values but accepts none.',
            Predicate: 'Predicates take a value and return a boolean.',
            Consumer: 'Consumers accept a value and perform an action without returning a result.',
            Function: 'Functions transform inputs into outputs.'
          }
        },
        {
          question: 'Parallel streams should be used when…',
          options: ['Operations are CPU bound and thread-safe', 'Operations depend on order', 'Collections are tiny', 'We need deterministic ordering'],
          answer: 'Operations are CPU bound and thread-safe',
          explanations: {
            'Operations are CPU bound and thread-safe': 'Parallel streams shine when work can be divided safely across cores.',
            'Operations depend on order': 'Order-sensitive tasks can behave unexpectedly with parallel execution.',
            'Collections are tiny': 'Small collections introduce more overhead than benefit when parallelised.',
            'We need deterministic ordering': 'Parallel streams may reorder results unless you take extra steps.'
          }
        }
      ]
    }
  },
  
  cpp: {
    cpp_00_intro: {
      order: 0,
      difficulty: 'easy',
      title: 'C++: Introduction & Background',
      theory: `# Introduction to C++

## When and why was C++ created?
C++ was created by Bjarne Stroustrup in 1985 as an extension of C with object-oriented features.

## Language level
C++ is a **mid-level** language (supports low-level memory manipulation with high-level abstractions).

## Typical use cases
- Systems programming, game engines, performance-critical apps

## Hello World
\`\`\`cpp
#include <iostream>
int main() {
  std::cout << "Hello, C++!" << std::endl;
  return 0;
}
\`\`\`

## Tooling
- Compilers: GCC/Clang/MSVC
- Build systems: CMake, Make
`,
      xp: 15,
      quiz: [
        {
          question: 'Who created C++?',
          options: ['Bjarne Stroustrup', 'Dennis Ritchie', 'Ken Thompson', 'Guido van Rossum'],
          answer: 'Bjarne Stroustrup'
        },
        {
          question: 'C++ is typically considered…',
          options: ['Low-level only', 'High-level only', 'Mid-level', 'Scripting language'],
          answer: 'Mid-level'
        },
        {
          question: 'Which command prints in modern C++?',
          options: ['printf', 'cout <<', 'System.out.println', 'print()'],
          answer: 'cout <<'
        },
        {
          question: 'Which build system is common for C++?',
          options: ['CMake', 'Maven', 'npm', 'pip'],
          answer: 'CMake'
        }
      ]
    },
    cpp_01_basics: {
      order: 1,
      difficulty: 'easy',
      title: 'C++: Basics & Syntax',
      theory: `# C++ Basics and Syntax

## Hello World Program:
\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}
\`\`\`

## Key Components:
- **#include**: Include header files
- **using namespace std**: Use standard library
- **int main()**: Entry point of program
- **cout**: Console output
- **endl**: End line (newline)

## Variables and Data Types:
\`\`\`cpp
int age = 25;              // Integer
double price = 19.99;      // Decimal number
char grade = 'A';          // Single character
string name = "C++";       // Text string
bool isActive = true;      // Boolean
\`\`\`

## Input/Output:
\`\`\`cpp
int number;
cout << "Enter a number: ";
cin >> number;
cout << "You entered: " << number << endl;
\`\`\`

## Comments:
\`\`\`cpp
// Single line comment
/* Multi-line comment */
\`\`\`

## Namespace:
- Avoids naming conflicts
- \`using namespace std;\` allows direct use of cout, cin, etc.`,
      xp: 20,
      quiz: [
        {
          question: 'What is the entry point of a C++ program?',
          options: ['start()', 'main()', 'init()', 'begin()'],
          answer: 'main()'
        },
        {
          question: 'Which operator is used for output in C++?',
          options: ['<<', '>>', '<<<', '>>>'],
          answer: '<<'
        },
        {
          question: 'What does `#include <iostream>` do?',
          options: ['Includes input/output library', 'Includes math library', 'Includes string library', 'Includes vector library'],
          answer: 'Includes input/output library'
        },
        {
          question: 'Which keyword is used for console input?',
          options: ['input', 'cin', 'read', 'get'],
          answer: 'cin'
        }
      ]
    },
    cpp_01b_operators: {
      order: 1.5,
      difficulty: 'easy',
      title: 'C++: Operators & Expressions',
      theory: `# C++ Operators & Expressions

## Arithmetic Operators:
\`\`\`cpp
int a = 10, b = 3;
a + b  // 13 (Addition)
a - b  // 7 (Subtraction)
a * b  // 30 (Multiplication)
a / b  // 3 (Integer division)
a % b  // 1 (Modulus)
\`\`\`

## Comparison Operators:
\`\`\`cpp
5 == 5   // true
5 != 3   // true
5 > 3    // true
5 < 3    // false
5 >= 5   // true
\`\`\`

## Logical Operators:
\`\`\`cpp
true && false  // false (AND)
true || false  // true (OR)
!true          // false (NOT)
\`\`\`

## Increment/Decrement:
\`\`\`cpp
int x = 5;
x++;  // x = 6 (Post-increment)
++x;  // x = 7 (Pre-increment)
\`\`\`

## Bitwise Operators:
\`\`\`cpp
a & b  // AND
a | b  // OR
a ^ b  // XOR
~a     // NOT
\`\`\``,
      xp: 20,
      quiz: [
        {
          question: 'What does `10 / 3` return in C++ (int division)?',
          options: ['3.33', '3', '4', 'Error'],
          answer: '3'
        },
        {
          question: 'What is the difference between `++x` and `x++`?',
          options: ['No difference', '++x increments before use', 'x++ increments before use', 'Both are same'],
          answer: '++x increments before use'
        },
        {
          question: 'What does `!true` return?',
          options: ['true', 'false', '1', '0'],
          answer: 'false'
        },
        {
          question: 'Which operator performs bitwise AND?',
          options: ['&&', '&', 'and', 'AND'],
          answer: '&'
        }
      ]
    },
    cpp_02_functions: {
      order: 2,
      difficulty: 'intermediate',
      title: 'C++: Functions & Scope',
      theory: `# C++ Functions and Scope

## Function Declaration:
\`\`\`cpp
#include <iostream>
using namespace std;

// Function declaration
int add(int a, int b);

int main() {
    int result = add(5, 3);
    cout << "Sum: " << result << endl;
    return 0;
}

// Function definition
int add(int a, int b) {
    return a + b;
}
\`\`\`

## Function Types:
- **void**: No return value
- **int, double, string**: Return specific type
- **Parameters**: Input values to function

## Function Overloading:
\`\`\`cpp
int add(int a, int b) {
    return a + b;
}

double add(double a, double b) {
    return a + b;
}
\`\`\`

## Scope:
- **Local**: Variables inside function
- **Global**: Variables outside all functions
- **Block**: Variables inside blocks {}

## Pass by Value vs Reference:
\`\`\`cpp
// Pass by value (creates copy)
void modify(int x) {
    x = 10;  // Original variable unchanged
}

// Pass by reference (modifies original)
void modify(int &x) {
    x = 10;  // Original variable changed
}
\`\`\``,
      xp: 30,
      quiz: [
        {
          question: 'What keyword indicates no return value?',
          options: ['null', 'void', 'empty', 'none'],
          answer: 'void'
        },
        {
          question: 'What is function overloading?',
          options: ['Same function name, different parameters', 'Different function names', 'Functions with same parameters', 'Functions that return void'],
          answer: 'Same function name, different parameters'
        },
        {
          question: 'What does the & symbol mean in function parameters?',
          options: ['Pass by value', 'Pass by reference', 'Pass by pointer', 'Pass by array'],
          answer: 'Pass by reference'
        },
        {
          question: 'Where are global variables declared?',
          options: ['Inside functions', 'Outside all functions', 'Inside classes', 'Inside namespaces'],
          answer: 'Outside all functions'
        }
      ]
    },
    cpp_03_oop: {
      order: 3,
      difficulty: 'intermediate',
      title: 'C++: Object-Oriented Programming',
      theory: `# C++ Object-Oriented Programming

## Classes and Objects:
\`\`\`cpp
class Car {
private:
    string brand;
    int year;
    
public:
    // Constructor
    Car(string b, int y) {
        brand = b;
        year = y;
    }
    
    // Methods
    void start() {
        cout << "Car is starting..." << endl;
    }
    
    string getBrand() {
        return brand;
    }
};
\`\`\`

## Access Specifiers:
- **private**: Only accessible within class
- **public**: Accessible from anywhere
- **protected**: Accessible to derived classes

## Creating Objects:
\`\`\`cpp
Car myCar("Toyota", 2020);
myCar.start();
string brand = myCar.getBrand();
\`\`\`

## Constructor:
- Special method called when object is created
- Same name as class
- No return type

## Destructor:
\`\`\`cpp
~Car() {
    cout << "Car destroyed" << endl;
}
\`\`\`

## This Pointer:
- Points to current object
- Used to access object members`,
      xp: 40,
      quiz: [
        {
          question: 'What keyword is used to create a new object?',
          options: ['new', 'create', 'make', 'instantiate'],
          answer: 'new'
        },
        {
          question: 'Which access specifier makes members accessible from anywhere?',
          options: ['private', 'public', 'protected', 'internal'],
          answer: 'public'
        },
        {
          question: 'What is a constructor?',
          options: ['Method that destroys objects', 'Method that initializes objects', 'Method that calls other methods', 'Method that returns values'],
          answer: 'Method that initializes objects'
        },
        {
          question: 'What does the ~ symbol indicate?',
          options: ['Constructor', 'Destructor', 'Method', 'Variable'],
          answer: 'Destructor'
        }
      ]
    },
    cpp_04_pointers: {
      order: 4,
      difficulty: 'advanced',
      title: 'C++: Pointers & Memory Management',
      theory: `# C++ Pointers and Memory Management

## Pointers:
Pointers store memory addresses of variables.

\`\`\`cpp
int x = 10;
int *ptr = &x;  // ptr points to x

cout << "Value: " << *ptr << endl;    // 10
cout << "Address: " << ptr << endl;    // Memory address
\`\`\`

## Pointer Operations:
- **&**: Address-of operator
- **\***: Dereference operator
- **new**: Allocate memory
- **delete**: Free memory

\`\`\`cpp
int *ptr = new int(42);  // Allocate memory
cout << *ptr << endl;    // 42
delete ptr;              // Free memory
\`\`\`

## Dynamic Memory:
\`\`\`cpp
// Allocate array
int *arr = new int[5];
for(int i = 0; i < 5; i++) {
    arr[i] = i * 2;
}
delete[] arr;  // Free array memory
\`\`\`

## Reference vs Pointer:
\`\`\`cpp
int x = 10;
int &ref = x;    // Reference (alias)
int *ptr = &x;   // Pointer (address)

ref = 20;        // Changes x
*ptr = 30;       // Changes x
\`\`\`

## Common Pitfalls:
- **Memory leaks**: Forgetting to delete
- **Dangling pointers**: Using freed memory
- **Null pointers**: Dereferencing null`,
      xp: 50,
      quiz: [
        {
          question: 'What does the & operator do?',
          options: ['Dereference', 'Get address', 'Multiply', 'Compare'],
          answer: 'Get address'
        },
        {
          question: 'What does the * operator do when used with pointers?',
          options: ['Get address', 'Dereference', 'Multiply', 'Allocate memory'],
          answer: 'Dereference'
        },
        {
          question: 'Which keyword allocates memory?',
          options: ['malloc', 'new', 'alloc', 'create'],
          answer: 'new'
        },
        {
          question: 'What is a memory leak?',
          options: ['Memory that is freed', 'Memory that is not freed', 'Memory that is allocated', 'Memory that is used'],
          answer: 'Memory that is not freed'
        }
      ]
    },
    cpp_05_templates: {
      order: 5,
      difficulty: 'advanced',
      title: 'C++: Templates & STL',
      theory: `# Templates & STL

## Function Templates
\`\`\`cpp
template <typename T>
T add(T a, T b) { return a + b; }
\`\`\`

## Class Templates
\`\`\`cpp
template <typename T>
class Box { T value; };
\`\`\`

## STL Containers
- vector, list, map, unordered_map

## Algorithms
- sort, find, accumulate

## Iterators
- Input, Output, Forward, Bidirectional, RandomAccess`,
      xp: 60,
      quiz: [
        { question: 'Templates enable…', options: ['Runtime polymorphism', 'Generic programming', 'Macros only', 'Reflection'], answer: 'Generic programming' },
        { question: 'Which is an STL container?', options: ['vector', 'arraylist', 'dict', 'queue<T> only'], answer: 'vector' },
        { question: 'Which header has algorithms like sort?', options: ['<algo>', '<algorithm>', '<sort>', '<stl>'], answer: '<algorithm>' },
        { question: 'Iterators provide…', options: ['Memory management', 'Container traversal', 'Threading', 'I/O'], answer: 'Container traversal' }
      ]
    },
    cpp_06_smart_pointers: {
      order: 6,
      difficulty: 'advanced',
      title: 'C++: Smart Pointers & Modern C++',
      theory: `# C++ Smart Pointers & Modern C++

## Smart Pointers (C++11+):
\`\`\`cpp
#include <memory>

// unique_ptr - exclusive ownership
std::unique_ptr<int> ptr = std::make_unique<int>(42);

// shared_ptr - shared ownership
std::shared_ptr<int> shared = std::make_shared<int>(42);

// weak_ptr - non-owning reference
std::weak_ptr<int> weak = shared;
\`\`\`

## Auto Keyword:
\`\`\`cpp
auto x = 10;        // int
auto name = "C++";  // const char*
\`\`\`

## Range-based For Loop:
\`\`\`cpp
std::vector<int> vec = {1, 2, 3};
for (auto& val : vec) {
    std::cout << val << std::endl;
}
\`\`\`

## Lambda Expressions:
\`\`\`cpp
auto add = [](int a, int b) { return a + b; };
int result = add(5, 3);
\`\`\`

## Move Semantics:
\`\`\`cpp
std::vector<int> vec1 = {1, 2, 3};
std::vector<int> vec2 = std::move(vec1);  // Move, not copy
\`\`\``,
      xp: 60,
      quiz: [
        {
          question: 'What is unique_ptr?',
          options: ['Shared pointer', 'Exclusive ownership pointer', 'Raw pointer', 'Array'],
          answer: 'Exclusive ownership pointer'
        },
        {
          question: 'What does `auto` do?',
          options: ['Nothing', 'Automatic type deduction', 'Creates variables', 'Deletes variables'],
          answer: 'Automatic type deduction'
        },
        {
          question: 'What is a lambda expression?',
          options: ['A class', 'An anonymous function', 'A variable', 'A loop'],
          answer: 'An anonymous function'
        },
        {
          question: 'What does `std::move()` do?',
          options: ['Copies data', 'Moves data (transfer ownership)', 'Deletes data', 'Nothing'],
          answer: 'Moves data (transfer ownership)'
        }
      ]
    }
  }
};

// Helper function to get level data
export function getLevelData(lang, levelId) {
  try {
    console.log('getLevelData called with:', { lang, levelId });
    console.log('Available languages:', Object.keys(LEVEL_DATA));
    
    if (lang && levelId && LEVEL_DATA[lang]) {
      console.log(`Levels available for ${lang}:`, Object.keys(LEVEL_DATA[lang]));
      
      if (LEVEL_DATA[lang][levelId]) {
        console.log('Level data found!', LEVEL_DATA[lang][levelId]);
        return LEVEL_DATA[lang][levelId];
      } else {
        console.warn(`Level ID "${levelId}" not found in ${lang}`);
      }
    } else {
      console.warn(`Language "${lang}" not found or levelId missing`);
    }
  } catch (error) {
    console.error('Error getting level data:', error);
  }
  return { 
    title: 'Level Not Found', 
    theory: 'Content coming soon.', 
    xp: 0, 
    quiz: [] 
  };
}


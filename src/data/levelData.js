// Comprehensive Level Data for All Languages
// This file contains theory content and quiz questions for each level

export const LEVEL_DATA = {
  javascript: {
    js_01_variables: {
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
    js_02_functions: {
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
    }
  },
  
  python: {
    py_01_syntax_print: {
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
    }
  },
  
  java: {
    java_01_basics: {
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
    java_02_oop: {
      title: 'Java: Object-Oriented Programming',
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
- Used to distinguish between instance variables and parameters`,
      xp: 30,
      quiz: [
        {
          question: 'What keyword is used to create a new object?',
          options: ['new', 'create', 'make', 'instance'],
          answer: 'new'
        },
        {
          question: 'Which access modifier makes a field accessible only within the same class?',
          options: ['public', 'private', 'protected', 'default'],
          answer: 'private'
        },
        {
          question: 'What does the `this` keyword refer to?',
          options: ['The class', 'The current object', 'The parent class', 'The method'],
          answer: 'The current object'
        },
        {
          question: 'What is the purpose of a constructor?',
          options: ['To destroy objects', 'To initialize objects', 'To call methods', 'To create classes'],
          answer: 'To initialize objects'
        }
      ]
    },
    java_03_inheritance: {
      title: 'Java: Inheritance & Polymorphism',
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
\`\`\``,
      xp: 40,
      quiz: [
        {
          question: 'What keyword is used for inheritance in Java?',
          options: ['inherits', 'extends', 'implements', 'super'],
          answer: 'extends'
        },
        {
          question: 'What does the `super()` keyword do?',
          options: ['Calls parent constructor', 'Calls child constructor', 'Creates object', 'Destroys object'],
          answer: 'Calls parent constructor'
        },
        {
          question: 'What annotation indicates method overriding?',
          options: ['@Override', '@Overload', '@Extend', '@Super'],
          answer: '@Override'
        },
        {
          question: 'Which access modifier allows access to subclasses?',
          options: ['public', 'private', 'protected', 'default'],
          answer: 'protected'
        }
      ]
    },
    java_04_collections: {
      title: 'Java: Collections & Generics',
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
          answer: 'List'
        },
        {
          question: 'What is the purpose of generics in Java?',
          options: ['Performance', 'Type safety', 'Memory management', 'Code organization'],
          answer: 'Type safety'
        },
        {
          question: 'Which collection automatically removes duplicates?',
          options: ['List', 'Set', 'Map', 'Array'],
          answer: 'Set'
        },
        {
          question: 'What does `List<String>` mean?',
          options: ['List of strings', 'String list', 'Generic list', 'All of the above'],
          answer: 'All of the above'
        }
      ]
    }
  },
  
  cpp: {
    cpp_01_basics: {
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
    cpp_02_functions: {
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


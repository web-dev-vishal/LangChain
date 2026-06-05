/**
 * Day 06 - TypedDict Demo → TypeScript-style typed objects in JS
 * Python equivalent: typeddict_demo.py
 *
 * Python's TypedDict provides type hints but does NOT enforce them at runtime.
 * In JS (without TypeScript), we use JSDoc annotations + plain objects.
 * This file shows the concept and equivalent runtime behavior.
 *
 * NOTE: For real runtime validation use Zod (see pydantic_demo.js).
 */

// --- TypedDict equivalent using JSDoc (documentation only, like Python's TypedDict) ---

/**
 * @typedef {Object} Student
 * @property {string} name
 * @property {number} age
 * @property {number} grade
 * @property {string} [email]
 */

/**
 * @typedef {Object} Course
 * @property {string} title
 * @property {string} instructor
 * @property {number} credits
 * @property {string[]} students
 */

// Create instances — no runtime enforcement (same as Python TypedDict)
/** @type {Student} */
const student1 = {
  name: "Alice",
  age: 20,
  grade: 3.8,
  email: "alice@university.edu",
};

/** @type {Student} */
const student2 = {
  name: "Bob",
  age: 22,
  grade: 3.5,
  // email is optional — can be omitted
};

/** @type {Course} */
const course = {
  title: "Introduction to AI",
  instructor: "Dr. Smith",
  credits: 3,
  students: ["Alice", "Bob", "Charlie"],
};

console.log("Student 1:", student1);
console.log("Student 2:", student2);
console.log("Course:", course);

// --- Accessing fields ---
console.log(`\n${student1.name} has a GPA of ${student1.grade}`);
console.log(`Course "${course.title}" has ${course.students.length} students`);

// --- NOTE about TypedDict vs Pydantic ---
// Just like Python's TypedDict, this does NOT validate types at runtime.
// Wrong types will silently work:
const broken = { name: 123, age: "not-a-number", grade: "A+" };
console.log("\nNo runtime error (like Python TypedDict):", broken);

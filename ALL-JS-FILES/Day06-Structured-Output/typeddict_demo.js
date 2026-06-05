// ============================================================
// FILE: typeddict_demo.js
// WHAT IT DOES: Shows how to define typed objects in JavaScript using JSDoc comments.
// WHY: In Python, TypedDict labels what fields an object should have.
//      In JS (without TypeScript), we use JSDoc comments to document types.
//      NOTE: This does NOT enforce types at runtime — it's just documentation.
// ============================================================

// --- Define a "Student" type using JSDoc ---
// This tells your code editor what fields a Student object should have
/**
 * @typedef {Object} Student
 * @property {string} name
 * @property {number} age
 * @property {number} grade
 * @property {string} [email]   ← square brackets mean optional
 */

/**
 * @typedef {Object} Course
 * @property {string} title
 * @property {string} instructor
 * @property {number} credits
 * @property {string[]} students  ← array of strings
 */

// Create student objects that match the Student type
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
  // email is not included — it's optional so that's fine
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

// Access fields normally
console.log(`\n${student1.name} has a GPA of ${student1.grade}`);
console.log(`Course "${course.title}" has ${course.students.length} students`);

// IMPORTANT: Unlike Zod/Pydantic, this does NOT validate at runtime
// Wrong types won't cause errors (same limitation as Python's TypedDict)
const broken = { name: 123, age: "not-a-number", grade: "A+" };
console.log("\nNo runtime error (like Python TypedDict):", broken);

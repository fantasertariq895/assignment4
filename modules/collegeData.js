const fs = require('fs');

class Data {
  constructor(students, courses) {
    this.students = students;
    this.courses = courses;
  }
}

let dataCollection = null;

function initialize() {
  return new Promise((resolve, reject) => {
    fs.readFile('./data/students.json', 'utf8', (err, studentDataFromFile) => {
      if (err) {
        reject("Unable to read students.json");
        return;
      }

      fs.readFile('./data/courses.json', 'utf8', (err, courseDataFromFile) => {
        if (err) {
          reject("Unable to read courses.json");
          return;
        }

        dataCollection = new Data(JSON.parse(studentDataFromFile), JSON.parse(courseDataFromFile));
        resolve("Data initialized successfully");
      });
    });
  });
}

function getAllStudents() {
  return new Promise((resolve, reject) => {
    if (dataCollection && dataCollection.students.length > 0) {
      resolve(`Successfully retrieved ${dataCollection.students.length} students`);
    } else {
      reject("No results returned");
    }
  });
}

function getCourses() {
  return new Promise((resolve, reject) => {
    if (dataCollection && dataCollection.courses.length > 0) {
      resolve(`Successfully retrieved ${dataCollection.courses.length} courses`);
    } else {
      reject("No results returned");
    }
  });
}

function getTAs() {
  return new Promise((resolve, reject) => {
    if (dataCollection && dataCollection.students.length > 0) {
      const tas = dataCollection.students.filter(student => student.TA === true);
      resolve(`Successfully retrieved ${tas.length} TAs`);
    } else {
      reject("No results returned");
    }
  });
}

// Function to retrieve students by course
function getStudentsByCourse(course) {
  return new Promise((resolve, reject) => {
    if (dataCollection && dataCollection.students.length > 0) {
      const studentsInCourse = dataCollection.students.filter(student => student.course === course);
      if (studentsInCourse.length > 0) {
        resolve(studentsInCourse);
      } else {
        reject("No results returned");
      }
    } else {
      reject("No results returned");
    }
  });
}

// Function to retrieve a student by student number
function getStudentByNum(num) {
  return new Promise((resolve, reject) => {
    if (dataCollection && dataCollection.students.length > 0) {
      const student = dataCollection.students.find(student => student.studentNum === num);
      if (student) {
        resolve(student);
      } else {
        reject("No results returned");
      }
    } else {
      reject("No results returned");
    }
  });
}

function addStudent(studentData) {
  return new Promise((resolve, reject) => {
      if (studentData.TA === undefined) {
          studentData.TA = false;
      } else {
          studentData.TA = true;
      }

      studentData.studentNum = dataCollection.students.length + 1;

      dataCollection.students.push(studentData);

      resolve();
  });
}

// Exporting the newly added functions along with the existing ones
module.exports = {
  initialize,
  getAllStudents,
  getCourses,
  getTAs,
  getStudentsByCourse,
  getStudentByNum,
  addStudent
};

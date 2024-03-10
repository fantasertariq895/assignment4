const express = require("express");
const path = require("path");
const collegeData = require("./modules/collegeData"); // Adjust the path accordingly
const app = express();
const port = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" folder
app.use(express.static("public"));


// Initialize collegeData
collegeData.initialize()
  .then(() => {
    // Routes

    app.get("/students", (req, res) => {
      const course = req.query.course;
      if (course) {
        collegeData.getStudentsByCourse(parseInt(course))
          .then(students => res.json(students))
          .catch(() => res.json({ message: "no results" }));
      } else {
        collegeData.getAllStudents()
          .then(students => res.json(students))
          .catch(() => res.json({ message: "no results" }));
      }
    });

    app.post("/students/add", (req, res) => {
      collegeData.addStudent(req.body)
          .then(() => res.redirect("/students"))
          .catch(error => res.status(500).json({ error: "Internal Server Error" }));
    });

    app.get("/students/add", (req, res) => {
      res.sendFile(path.join(__dirname, "views", "addStudent.html"));
    });

    app.get("/tas", (req, res) => {
      collegeData.getTAs()
        .then(tas => res.json(tas))
        .catch(() => res.json({ message: "no results" }));
    });

    app.get("/courses", (req, res) => {
      collegeData.getCourses()
        .then(courses => res.json(courses))
        .catch(() => res.json({ message: "no results" }));
    });

    app.get("/student/:num", (req, res) => {
      const num = req.params.num;
      collegeData.getStudentByNum(parseInt(num))
        .then(student => res.json(student))
        .catch(() => res.json({ message: "no results" }));
    });

    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "views", "home.html"));
    });

    app.get("/about", (req, res) => {
      res.sendFile(path.join(__dirname, "views", "about.html"));
    });

    app.get("/htmlDemo", (req, res) => {
      res.sendFile(path.join(__dirname, "views", "htmlDemo.html"));
    });

    // 404 route
    app.use((req, res) => {
      res.status(404).send("Page Not Found");
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error(`Error initializing collegeData: ${err}`);
  });
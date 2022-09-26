const express = require("express");
const app = express();
// Requiring and Initializing Express

const Student = require("./models/students");

const Teacher = require("./models/teachers");

const mongoose = require("mongoose");
// --->Create Mongo SCHEMA*

const methodOverride = require("method-override");
// --->Override setting for CRUD methods

require("dotenv").config();
// ---> Link our ENV variables to our app
// ------------------------------------------[StepOne]

app.set("view engine", "jsx");
// ------> Creates Link to JSX
app.engine("jsx", require("express-react-views").createEngine());
// -----> Links JSX/ReactViews to App

app.use(express.urlencoded({ extended: false }));
// --->Parse Req.Body

app.use(methodOverride("_method"));
// --->Instantiates MethodOverride for CRUD actions

app.use((req, res, next) => {
  console.log("I am only here,for the routes");
  next();
});
// -----> Establishes Middleware Process

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once( 'open', () => {
  console.log("connected to mongo");
});
// --------->Middleware


// ------------------------------------------[StepTwo]

// --------->Routes {CRUD}

// --------->Index [Dashboard/ShowAll]
app.get("/students", (req, res) => {
  Student.find({}, (err, allStudents) => {
    console.log(err);

    res.render("Index", {
      students: allStudents,
    });
  });
});
app.get("/teachers", (req, res) => {
    Teacher.find({}, (err, allTeachers) => {
        console.log(err);
    res.render("Teacherindex", {
        teachers: allTeachers,
    });
    });
});

// --------->New  [C]
app.get("/students/new", (req, res) => {
  res.render("New", {});
});
app.get("/teachers/new", (req, res) => {
    res.render("Newteacher", {});
});

// --------> POST
app.post("/students", (req, res) => {
  if (req.body.isPassing === "on") {
    req.body.isPassing = true;
  } else {
    req.body.isPassing = false;
  }
  Student.create(req.body, (err, createdStudent) => {
    console.log(err);
    console.log("Just Added : ", createdStudent);
  });
  res.redirect("/students");
});
app.post("/teachers", (req, res) => {
    if (req.body.isPassing === "on") {
        req.body.isPassing = true;
    } else {
        req.body.isPassing = false;
    }
    Teacher.create(req.body, (err, createdTeacher) => {
        console.log(err);
        console.log("Just Added :", createdTeacher);
    });
    res.redirect("/teachers")
})


// -------> Edit
app.get("/students/:id/edit", (req, res) => {
    Student.findById(req.params.id, (err, foundStudent) => {
      //findStudent
      console.log(err)
      if (!err) {
        res.render("Edit", {
          student: foundStudent,
          //pass in the foundStudent so we can prefill the form
        });
      } else {
        res.send({ msg: err.message });
      }
    });
  });
app.get("/teachers/:id/edit", (req, res) => {
    Teacher.findById(req.params.id, (err, foundTeacher) => {
      //findTeacher
      console.log(err)
      if (!err) {
        res.render("Edit", {
          teacher: foundTeacher,
          //pass in the foundTeacher so we can prefill the form
        });
      } else {
        res.send({ msg: err.message });
      }
    });
  });

// --------->PUT/PATCH [U]
app.put("/students/:id", (req, res) => {
    if (req.body.isPassing === "on") {
      req.body.isPassing = true;
    } else {
      req.body.isPassing = false;
    }
    Student.findByIdAndUpdate(req.params.id, req.body, (err, updatedStudent) => {
        console.log(err)
      console.log(updatedStudent);
      res.redirect(`/students/${req.params.id}`);
    });
  });
app.put("/teachers/:id", (req, res) => {
    if (req.body.isPassing === "on") {
      req.body.isPassing = true;
    } else {
      req.body.isPassing = false;
    }
    Teacher.findByIdAndUpdate(req.params.id, req.body, (err, updatedTeacher) => {
        console.log(err)
      console.log(updatedTeacher);
      res.redirect(`/teachers/${req.params.id}`);
    });
  });

// ------>DELETE   [D]
app.delete("/students/:id", (req, res) => {
    Student.findByIdAndRemove(req.params.id, (err, data) => {
      res.redirect("/students");
    });
  });
app.delete("/teachers/:id", (req, res) => {
    Teacher.findByIdAndRemove(req.params.id, (err, data) => {
      res.redirect("/teachers");
    });
  });

// --------> SEEDS*
app.get("/students/seed", (req, res) => {
  console.log(Student);
  Student.create(
    [
      {
        name: "Beyonce",
        gpa: "3.0",
        isPassing: true,
      },
      {
        name: "Rhianna",
        gpa: "4.0",
        isPassing: true,
      },
      {
        name: "J-LO",
        gpa: "1.0",
        isPassing: false,
      },
    ],
    (err, data) => {
      res.redirect("/students");
    }
  );
});
app.get("/teachers/seed", (req, res) => {
    console.log(Teacher);
    Teacher.create(
      [
        {
          name: "Jordan",
          salary: "bigschmoney",
          isPassing: true,
        },
        {
          name: "Josh",
          salary: "Pope of Cash",
          isPassing: true,
        },
        {
          name: "Manara",
          salary: "3 much money 5 u turbodork",
          isPassing: false,
        },
      ],
      (err, data) => {
        res.redirect("/teachers");
      }
    );
  });

// --------->Show [R]
app.get("/students/:id", (req, res) => {
    Student.findById(req.params.id, (err,foundStudent) => {
        console.log(err)
      console.log("Found: ", foundStudent);
      res.render("Show", {
        student: foundStudent,
      });
    });
  });
app.get("/teachers/:id", (req, res) => {
    Teacher.findById(req.params.id, (err,foundTeacher) => {
        console.log(err)
      console.log("Found: ", foundTeacher);
      res.render("Show", {
        teacher: foundTeacher,
      });
    });
  });
  
app.listen("3000", () => {
  console.log("ServerRunning, you better go catch it. ");
});
// ----->Server Now Running
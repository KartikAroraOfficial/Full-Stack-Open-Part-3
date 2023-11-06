const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const Person = require("./models/person");
app.use(express.json());
app.use(cors());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body ")
);
morgan.token("body", (req) => JSON.stringify(req.body));
app.use(express.static("build"));

const unknownEndPoint = (req, res, next) => {
  res.status(404).send({ error: "unknown endpoint" });
  next();
};

const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (err.name === "CastError")
    return res.status(400).send({ error: "malformatted id" });
  else if (err.name === "ValidationError")
    return res.status(400).send({ error: err.message });
  else if (err.name === "MongoError")
    return res.status(400).send({ error: err.message });
  next();
};

// Updated to use MONGODB
app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((result) => {
      console.log(result);
      res.json(result);
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findById(id)
    .then((result) => {
      if (result) {
        res.json(result);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

// updated to use mongodb
app.get("/info", (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.send(
        `<p>Phonebook has info for ${persons.length
        } persons</p> <p>${new Date()}</p>`
      );
    })
    .catch((err) => next(err));
});

// updated to use mongodb
app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

// updated to use mongodb
app.post("/api/persons", (req, res, next) => {
  const body = req.body;
  const person = new Person({
    name: body.name,
    number: body.number,
  });
  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson.toJSON());
    })
    .catch((error) => {
      next(error);
    });
});

// updated to use mongodb
app.put("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  const person = {
    name: req.body.name,
    number: req.body.number,
  };
  Person.findByIdAndUpdate(id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      next(err);
    });
});

app.use(unknownEndPoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});

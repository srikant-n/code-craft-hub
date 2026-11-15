const express = require("express");
const { randomUUID } = require("crypto");
const {
  readCourses,
  writeCourses
} = require("../services/courseStore");

const router = express.Router();

const validStatuses = [
  "Not Started",
  "In Progress",
  "Completed"
];

function validateCourseInput(body, partial = false) {
  const errors = [];

  if (!partial || body.name !== undefined) {
    if (!body.name || typeof body.name !== "string") {
      errors.push("name is required and must be a string");
    }
  }

  if (!partial || body.description !== undefined) {
    if (!body.description || typeof body.description !== "string") {
      errors.push("description is required and must be a string");
    }
  }

  if (!partial || body.target_date !== undefined) {
    if (!body.target_date) {
      errors.push("target_date is required");
    }
  }

  if (body.status !== undefined && !validStatuses.includes(body.status)) {
    errors.push(
      `status must be one of: ${validStatuses.join(", ")}`
    );
  }

  return errors;
}

// GET /api/courses
router.get("/", async (req, res, next) => {
  try {
    const courses = await readCourses();
    res.json(courses);
  } catch (error) {
    next(error);
  }
});

// GET /api/courses/:id
router.get("/:id", async (req, res, next) => {
  try {
    const courses = await readCourses();
    const course = courses.find((item) => item.id === req.params.id);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    next(error);
  }
});

// POST /api/courses
router.post("/", async (req, res, next) => {
  try {
    const errors = validateCourseInput(req.body);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const courses = await readCourses();

    const newCourse = {
      id: randomUUID(),
      name: req.body.name,
      description: req.body.description,
      target_date: req.body.target_date,
      status: req.body.status || "Not Started",
      createdAt: new Date().toISOString()
    };

    courses.push(newCourse);
    await writeCourses(courses);

    res.status(201).json(newCourse);
  } catch (error) {
    next(error);
  }
});

// PUT /api/courses/:id
router.put("/:id", async (req, res, next) => {
  try {
    const errors = validateCourseInput(req.body);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const courses = await readCourses();
    const index = courses.findIndex(
      (item) => item.id === req.params.id
    );

    if (index === -1) {
      return res.status(404).json({ error: "Course not found" });
    }

    const updatedCourse = {
      ...courses[index],
      name: req.body.name,
      description: req.body.description,
      target_date: req.body.target_date,
      status: req.body.status
    };

    courses[index] = updatedCourse;
    await writeCourses(courses);

    res.json(updatedCourse);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/courses/:id/status
router.patch("/:id/status", async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: `status must be one of: ${validStatuses.join(", ")}`
      });
    }

    const courses = await readCourses();
    const course = courses.find(
      (item) => item.id === req.params.id
    );

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    course.status = status;
    await writeCourses(courses);

    res.json(course);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/courses/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const courses = await readCourses();
    const filteredCourses = courses.filter(
      (item) => item.id !== req.params.id
    );

    if (filteredCourses.length === courses.length) {
      return res.status(404).json({ error: "Course not found" });
    }

    await writeCourses(filteredCourses);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
const fs = require("fs/promises");
const path = require("path");

const dataFile = path.join(__dirname, "../data/courses.json");

async function readCourses() {
  try {
    const fileContents = await fs.readFile(dataFile, "utf8");
    return fileContents? JSON.parse(fileContents) : [];
  } catch (error) {
    if (error.code === "ENOENT") {
      await writeCourses([]);
      return [];
    }

    throw error;
  }
}

async function writeCourses(courses) {
  await fs.writeFile(
    dataFile,
    JSON.stringify(courses, null, 2),
    "utf8"
  );
}

module.exports = {
  readCourses,
  writeCourses
};
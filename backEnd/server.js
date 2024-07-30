const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");

const app = express();
const port = 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const mongoURI = "mongodb://0.0.0.0:27017/facerec";
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define a schema and model for storing face detection data
const detectionSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  expressions: Object,
  box: Object,
  descriptor: Array,
  timestamp: Date,
});

const Detection = mongoose.model("Detection", detectionSchema);

app.post("/api/detections", async (req, res) => {
  try {
    const detectionData = req.body;
    console.log("Incoming detection data:", detectionData); // Debugging

    const detections = detectionData.map((data) => ({
      name: data.name || "Unknown",
      age: data.age,
      gender: data.gender,
      expressions: data.expressions,
      box: data.box,
      descriptor: data.descriptor,
      timestamp: new Date(data.timestamp),
    }));

    await Detection.insertMany(detections);
    console.log("Detection data saved to MongoDB"); // Debugging
    res.status(201).send("Detection data saved to MongoDB");
  } catch (error) {
    console.error("Error saving detection data:", error);
    res.status(500).send("Error saving detection data");
  }
});

app.post("/api/detections", async (req, res) => {
  try {
    const detectionData = req.body;
    console.log("Incoming detection data:", detectionData);

    const detections = detectionData.map((data) => ({
      name: data.name || "Unknown",
      age: data.age,
      gender: data.gender,
      expressions: data.expressions,
      box: data.box,
      descriptor: data.descriptor,
      timestamp: new Date(data.timestamp),
    }));

    await Detection.insertMany(detections);
    console.log("Detection data saved to MongoDB");
    res.status(201).send("Detection data saved to MongoDB");
  } catch (error) {
    console.error("Error saving detection data:", error);
    res.status(500).send("Error saving detection data");
  }
});

// API route to check server connection
app.get("/get", (req, res) => {
  console.log("Server connected");
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

//-----------------  section 2 ---------------------

// storing single face data and name
const faceDataSchema = new mongoose.Schema({
  name: String,
  faceData: Array, // Store face detection data as an array of descriptors
});

const FaceData = mongoose.model("FaceData", faceDataSchema);

app.use(express.json());

// Endpoint to save new face detection data
app.post("/api/face-detection", async (req, res) => {
  try {
    const { name, data } = req.body;

    const newFaceData = new FaceData({
      name,
      faceData: data,
    });

    await newFaceData.save();
    res.status(200).json({ message: "Data saved successfully" });
  } catch (error) {
    console.error("Error saving detection data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/facedatas", async (req, res) => {
  try {
    const students = await FaceData.find();
    res.json(students);
  } catch (error) {
    console.error("Error fetching student data:", error);
    res.status(500).send("Error fetching student data");
  }
});



//----------------------- section - 3 -----------------------

const studentSchema = new mongoose.Schema({
  name: String,
  descriptor: [Number],
  expressions: String,
  status: String,
  date: String,
});

const Student = mongoose.model('Student', studentSchema);


app.get('/api/students/:name/:date', async (req, res) => {
  const { name, date } = req.params;
  try {
    const existingRecord = await Student.findOne({ name, date });
    if (existingRecord) {
      res.status(200).json({ exists: true });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/students/:date', async (req, res) => {
  const { date } = req.params;
  try {
    const records = await Student.find({ date });
    if (records.length > 0) {
      res.json({ exists: true, records });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking existing attendance data:", error);
    res.status(500).send('Error checking attendance data');
  }
});


app.get('/api/dashboarddata', async (req, res) => {
  try {
    // Fetch all students from the database
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    console.error("Error fetching student data:", error);
    res.status(500).send("Error fetching student data");
  }
});


app.get("/api/students", async (req, res) => {
  try {
    const date = req.query.date;
    
    // const students = await Student.find({ date: date }) // Adjust as per your ORM/query method
    // res.send(students);
    const status = req.query.status;
    const query = {};

    if (date) {
      query.date = date;
    }

    if (status) {
      query.status = status;
    }

    const students = await Student.find(query); 
    res.json(students);
  } catch (error) {
    console.error("Error fetching student data:", error);
    res.status(500).send("Error fetching student data");
  }
});


app.post('/api/attendance', async (req, res) => {
  const { name, expressions, faceData, status, date } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  if (!Array.isArray(faceData)) {
    return res.status(400).json({ error: 'faceData must be an array' });
  }
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }
  if (!date) {
    return res.status(400).json({ error: 'Date is required' });
  }

  const student = new Student({
    name,
    descriptor: faceData,
    expressions,
    status,
    date,
  });

  try {
    const newStudent = await student.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});




// classromm attendence 




const classRoomSchema = new mongoose.Schema({
  name: String,
  descriptor: [Number],
  expressions: String,
  status: String,
  date: String,
});



const ClassRoom = mongoose.model('ClassRoom', classRoomSchema);
// const ClassRoom = mongoose.model('ClassRoom', classRoomSchema);


app.post('/api/classroom', async (req, res) => {
  const { name, expressions, descriptor, status, date } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  if (!Array.isArray(descriptor)) {
    return res.status(400).json({ error: 'Descriptor must be an array' });
  }
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }
  if (!date) {
    return res.status(400).json({ error: 'Date is required' });
  }

  const classRoom = new ClassRoom({
    name,
    descriptor,
    expressions,
    status,
    date,
  });

  try {
    const savedClassRoom = await classRoom.save();
    res.status(201).json(savedClassRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



app.get('/api/classroom/:date', async (req, res) => {
  const { date } = req.params;
  try {
    const records = await ClassRoom.find({ date });
    if (records.length > 0) {
      res.json({ exists: true, records });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking existing attendance data:", error);
    res.status(500).send('Error checking attendance data');
  }
});
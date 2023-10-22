const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const app = express();
app.use(express.json());
app.use(cors());
const port = 3465; // Set your desired port

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const className = file.originalname.split("_")[0];
    console.log(className);
    const uploadPath = path.join(__dirname, "video", className);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// Serve static files from the 'video' directory
app.use(express.static(path.join(__dirname, "video")));

// Handle POST requests to '/upload' for video uploads
app.post("/api/upload", upload.single("video"), (req, res) => {
  console.log(req.file);
  res.send("Video uploaded successfully");
});

app.post("/api/video-list", (req, res) => {
  const className = req.body.className;
  const directoryPath = path.join(__dirname, "video", className);

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      res.status(500).json({ error: "Failed to retrieve video list." });
    } else {
      const videoFiles = files.filter((file) => path.extname(file) === ".webm");
      console.log(videoFiles);
      res.json(videoFiles);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

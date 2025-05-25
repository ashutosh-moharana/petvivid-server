const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const cors = require('cors')



require("dotenv").config();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use('/uploads',express.static("./public/uploads/userImages"));
app.use('/uploads/petImages',express.static("./public/uploads/petImages"));
app.use(cors({origin:process.env.CORS_ORIGIN, credentials:true}))

//test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/posts", require("./routes/posts"));

// Server Start
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
}); 

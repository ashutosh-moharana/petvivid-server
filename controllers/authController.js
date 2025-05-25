const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

const userModel = require("../models/user");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await userModel.findOne({ email: req.body.email });
  if (user) {
    return res
      .status(400)
      .json({ success: false, message: "Email already registered" });
  }

  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(password, salt, async function (err, hash) {
      const createdUser = await userModel.create({
        name,
        email,
        password: hash,
        userpic: null,
      });


      const token = jwt.sign({ email ,userid:createdUser._id }, process.env.JWT_SECRET);
    
      res
        .status(200)
        .cookie("token", token, {
          httpOnly: true, // Good for security
          sameSite: "none", 
          secure: true,
        })
        .json({ success: true, message: "User registered !",user:createdUser, token });
    });
  });

};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }

    let isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }

    const token = jwt.sign({ email ,userid:user._id }, process.env.JWT_SECRET);

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "none", // Helps with cross-origin in some cases
        secure: true,
      })
      .json({ success: true, message: "User logged in",user, token });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};

const logoutUser = (req, res) => {
  res.cookie("token", "",{
  
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.json({ success: true, message: "User logged out successfully !" });
};

const checkAuth = (req, res) => {
  const token = req.cookies.token;

  if (!token) { 
    return res.status(401).json({ isAuthenticated:false, message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ isAuthenticated: false, message: "Unauthorized" });
    }

    
    const user = await userModel.findOne({_id:decoded.userid})
    
    res.json({isAuthenticated : true, message: "User is authenticated",user} );
  });
};
module.exports = { registerUser, loginUser, logoutUser,checkAuth };

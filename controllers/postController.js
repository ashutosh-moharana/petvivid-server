const PetPost = require("../models/PetPost");
const userModel = require("../models/user");
const fs = require('fs');
const path = require('path');

const getPosts = async (req, res) => {
  try {
    const posts = await PetPost.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


const createPost = async (req, res) => {
  let user = await userModel.findOne({ email: req.user.email });

  console.log(user);

  const { title, petName, petType, description, type, createdAt } = req.body;
  const post = await PetPost.create({
    title,
    petName,
    petType,
    description,
    type,
    picture: "/uploads/petImages/" + req.file.filename,
    userId: user._id,
    createdAt,
  });
  console.log(req.file.destination + "/" + req.file.filename);

  user.posts.push(post._id);
  await user.save();
  console.log(`Your post is ${post}`);
  res.json({ msg: "Post created successfully" ,post});
};

const updatePost = async (req, res) => {
  const { ...data } = req.body;
  let updatedFields = { ...data };

  // If a new file is uploaded, handle old image deletion
  if (req.file) {
    // Find the existing post to get the old image path
    const existingPost = await PetPost.findById(req.params.id);
    if (existingPost && existingPost.picture) {
      const oldImagePath = path.join(__dirname, '../public', existingPost.picture);
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error('Error deleting old image file:', err);
        } else {
          console.log('Old image file deleted:', oldImagePath);
        }
      });
    }
    updatedFields.picture = "/uploads/petImages/" + req.file.filename;
  }

  let updatedData = await PetPost.findOneAndUpdate(
    { _id: req.params.id },
    updatedFields,
    { new: true }
  );

  console.log(`Your updated data is ${updatedData}`);
  res.json("Your data has been succesfully updated!");
};

const deletePost = async (req, res) => {
  let user = await userModel.findOne({ email: req.user.email });
  const post = await PetPost.findOneAndDelete({ _id: req.params.id });
  // Remove post reference from user
  const index = user.posts.findIndex((elem) => elem._id == req.params.id);
  if (index !== -1) {
    user.posts.splice(index, 1);
  }
  await user.save();

  // Delete image file from server if it exists
  if (post && post.picture) {
    const imagePath = path.join(__dirname, '../public', post.picture);
    
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error('Error deleting image file:', err);
      } else {
        console.log('Image file deleted:', imagePath);
      }
    });
  }

  res.json("Your post has been deleted succesfully !");
};
module.exports = { getPosts,createPost, updatePost, deletePost };

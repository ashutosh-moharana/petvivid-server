const PetPost = require("../models/petpost");
const userModel = require("../models/user");
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// Cloudinary config (use env variables in production)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
  const { title, petName, petType, description, type, createdAt } = req.body;
  let imageUrl = '';
  if (req.file) {
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'petImages',
      resource_type: 'image',
    });
    imageUrl = result.secure_url;
    // Optionally, delete local file after upload
    fs.unlink(req.file.path, () => {});
  }
  const post = await PetPost.create({
    title,
    petName,
    petType,
    description,
    type,
    picture: imageUrl,
    userId: user._id,
    createdAt,
  });
  user.posts.push(post._id);
  await user.save();
  res.json({ msg: "Post created successfully", post });
};

const updatePost = async (req, res) => {
  try {
    const { ...data } = req.body;
    let updatedFields = { ...data };
    
    if (req.file) {
      // Find the existing post to get the old image URL
      const existingPost = await PetPost.findById(req.params.id);
      if (!existingPost) {
        return res.status(404).json({ error: "Post not found" });
      }
      
      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'petImages',
        resource_type: 'image',
      });
      updatedFields.picture = result.secure_url;
      
      // Delete local file after upload
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting local file:', err);
      });
    }
    
    // Update the post and get the updated document
    const updatedPost = await PetPost.findOneAndUpdate(
      { _id: req.params.id },
      updatedFields,
      { new: true }
    );
    
    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    
    // Return the updated post data
    res.json({ 
      message: "Your data has been successfully updated!",
      post: updatedPost 
    });
}catch(err){
  console.log(err);
};
}

const deletePost = async (req, res) => {
  let user = await userModel.findOne({ email: req.user.email });
  const post = await PetPost.findOneAndDelete({ _id: req.params.id });
  const index = user.posts.findIndex((elem) => elem._id == req.params.id);
  if (index !== -1) {
    user.posts.splice(index, 1);
  }
  await user.save();
  // Optionally, delete image from Cloudinary if you store public_id
  res.json("Your post has been deleted succesfully !");
};
module.exports = { getPosts,createPost, updatePost, deletePost };

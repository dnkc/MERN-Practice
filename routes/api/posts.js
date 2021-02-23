const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// import Post model
const Post = require("../../models/Post");
// import Profile model
const Profile = require("../../models/Profile");
// import post validation
const validatePostInput = require("../../validation/post");

// already looks at /api/posts
// i.e., if you wanted /api/users/test only need router.get('/test')

// @route   GET api/posts/test
// @desc    Tests post route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Posts Works!" }));

// @route   GET api/posts
// @desc    Get all posts
// @access  Public
router.get("/", (req, res) => {
  const errors = {};
  Post.find()
    .sort({ date: -1 })
    .populate("user", ["name", "avatar"])
    .then((posts) => {
      if (!posts) {
        errors.noposts = "There are no posts";
        return res.status(404).json(errors);
      }
      res.json(posts);
    })
    .catch((err) => res.status(404).json({ posts: "There are no posts" }));
});

// @route   GET api/posts/:id
// @desc    Get a single post
// @access  Public
router.get("/:post_id", (req, res) => {
  const errors = {};
  Post.findById(req.params.post_id)
    .populate("posts", ["name", "avatar"])
    .then((posts) => {
      if (!posts) {
        // if no profile found
        errors.noposts = "There is no post by that id";
        res.status(404).json(errors);
      }
      // profile is found
      res.json(posts);
    })
    .catch((err) =>
      res.status(404).json({ noposts: "There is no post by that id" })
    );
});

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    //check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id,
    });

    newPost.save().then((post) => res.json(post));
  }
);

// @route   DELETE api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete(
  "/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      Post.findById(req.params.post_id)
        .then((post) => {
          // check for post owner
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: "User not authorized" });
          }
          // Delete the post
          post.remove().then(() => res.json({ success: true }));
        })
        .catch((err) =>
          res.status(404).json({ postnotfound: "No post found" })
        );
    });
  }
);

// @route   POST api/posts/like/:id
// @desc    Like post
// @access  Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      Post.findById(req.params.id)
        .then((post) => {
          if (
            post.likes.filter((like) => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "User already liked this post" });
          }

          // Add user id to likes array
          post.likes.unshift({ user: req.user.id });

          post.save().then((post) => res.json(post));
        })
        .catch((err) =>
          res.status(404).json({ postnotfound: "No post found" })
        );
    });
  }
);

// @route   POST api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
router.post(
  "/unlike/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      Post.findById(req.params.post_id)
        .then((post) => {
          if (
            // check if user has already liked the post
            post.likes.filter(
              (like) => like.user.toString() === req.user.id
            ) === 0
          ) {
            return res
              .status(400)
              .json({ notliked: "You have not yet liked this post" });
          }
          // get the remove index
          const removeIndex = post.likes
            .map((item) => item.user.toString())
            .indexOf(req.user.id);
          // splice it out of array
          post.likes.splice(removeIndex, 1);
          post.save().then((post) => res.json(post));
        })
        .catch((err) =>
          res.status(404).json({ postnotfound: "No post found" })
        );
    });
  }
);

// @route   POST api/posts/comment/:id
// @desc    Add comment to post
// @access  Private
router.post(
  "/comment/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    //check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Post.findById(req.params.post_id)
      .then((post) => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id,
        };
        // add to comments array
        post.comments.unshift(newComment);
        post.save().then((post) => res.json(post));
      })
      .catch((err) => res.status(404).json({ postnotfound: "No post found" }));
  }
);

// @route   DELETE api/posts/comment/:id
// @desc    Delete comment from a post
// @access  Private
router.delete(
  "/comment/:post_id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.post_id)
      .then((post) => {
        // check to see if the comment exists
        if (
          post.comments.filter(
            (comment) => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          // if 0 then comment does not exist
          return res
            .status(404)
            .json({ commentnotexists: "Comment does not exist" });
        }
        // if it exists, find the index
        const removeIndex = post.comments
          .map((item) => item._id.toString())
          .indexOf(req.params.comment_id);
        // splice it out of array
        post.comments.splice(removeIndex, 1);
        post.save().then((post) => res.json(post));
      })
      .catch((err) => res.status(404).json({ postnotfound: "No post found" }));
  }
);

module.exports = router;

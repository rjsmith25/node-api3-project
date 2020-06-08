const express = require("express");
const {
  get,
  insert,
  getById,
  getUserPosts,
  update,
  remove
} = require("./userDb");
const { insert: postInsert } = require("../posts/postDb");

const router = express.Router();

router.post("/", validateUser, async (req, res) => {
  const { name } = req.body;

  try {
    let user = await insert({ name });
    res.status(201).json(user);
  } catch (e) {
    res.status(500).json({
      message: "There was an error while saving the user to the database"
    });
  }
});

router.post("/:id/posts", validateUserId, validatePost, async (req, res) => {
  const { text } = req.body;

  try {
    let post = await postInsert({ user_id: req.user.id, text: text });
    res.status(201).json(post);
  } catch (e) {
    res.status(500).json({
      message: "There was an error while saving the post to the database"
    });
  }
});

router.get("/", async (req, res) => {
  try {
    let users = await get();
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json({
      message: "The users information could not be retrieved."
    });
  }
});

router.get("/:id", validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get("/:id/posts", validateUserId, async (req, res) => {
  try {
    let userPosts = await getUserPosts(req.user.id);
    res.status(200).json(userPosts);
  } catch (e) {
    res.status(500).json({
      message: "The user post information could not be retrieved."
    });
  }
});

router.delete("/:id", validateUserId, async (req, res) => {
  try {
    await remove(req.user.id);
    res.status(200).json(req.user);
  } catch (e) {
    res.status(500).json({
      message: "The user information could not be retrieved."
    });
  }
});

router.put("/:id", validateUserId, async (req, res) => {
  const { name } = req.body;
  let changes = {};
  let modifiedPost = {};

  if (!name) {
    res.status(400).json({ message: "Please provide name for the user." });
    return;
  }

  if (name) {
    changes.name = name;
  }

  modifiedPost = { ...req.user, ...changes };

  try {
    await update(req.user.id, changes);
    res.status(200).json(modifiedPost);
  } catch (e) {
    res.status(500).json({
      message: "The user information could not be retrieved."
    });
  }
});

//custom middleware

async function validateUserId(req, res, next) {
  const { id } = req.params;
  try {
    let user = await getById(id);

    if (!user || user.length === 0) {
      res.status(404).json({ message: "invalid user id" });
      return;
    }

    req.user = user;
    next();
  } catch (e) {
    res.status(500).json({
      message: "The user information could not be retrieved."
    });
  }
}

function validateUser(req, res, next) {
  const { name } = req.body;

  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: "missing user data" });
    return;
  }

  if (!name) {
    res.status(400).json({ message: "missing required name field" });
    return;
  }

  next();
}

function validatePost(req, res, next) {
  const { text } = req.body;

  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: "missing post data" });
    return;
  }

  if (!text) {
    res.status(400).json({ message: "missing required text field" });
    return;
  }

  next();
}

module.exports = router;

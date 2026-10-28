
const express = require("express");
const mongoose = require("mongoose");
const Book = require("../models/Book");

const router = express.Router();

// GET 
router.get("/", async (req, res) => {
     try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);

    const skip = (page - 1) * limit;

    const [books, totalBooks] = await Promise.all([
      Book.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Book.countDocuments()
    ]);

    const totalPages = Math.ceil(totalBooks / limit);

    return res.status(200).json({
         currentPage: page,
      totalBooks,
      totalPages,
      books
    });
  } 
  
  catch (error) {
    return res.status(500).json({
      message: "Server error",
        error: error.message
    });
  }
});

// POST
router.post("/", async (req, res) => {
  try {
    const { title, author, category } = req.body;

    if (!title || !title.trim()) {
        return res.status(400).json({
        message: "Book title is required"
      });
    }

    if (!author || !author.trim() || !category || !category.trim()) {
      return res.status(400).json({
        message: "Author and category are required"
      });
 }

    const book = await Book.create({
      title,
      author,
      category
    });

    return res.status(201).json({
      message: "Book added successfully",
      book
    });
  } 
  
  catch (error) {
    return res.status(500).json({
      message: "Server error",
       error: error.message
    });
  }
});

// PATCH 
  router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
     const { availability } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid book ID"
      });
    }

    if (typeof availability !== "boolean") {
      return res.status(400).json({
        message: "Availability must be true or false"
      });
    }

    const book = await Book.findByIdAndUpdate(
      id,
    { availability },
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({
         message: "Book not found"
      });
    }

    return res.status(200).json({
      message: "Book availability updated successfully",
      book
    });
  }
  
  catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

module.exports = router;

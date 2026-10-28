const express = require("express");
const mongoose = require("mongoose");
const Book = require("../models/Book");

const router = express.Router();




// get 
router.get("/", async (req, res) => {
  try {
    const page =  parseInt(req.query.page, 10)||1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const sentPage = page>1 ?page :1
    const sentLimit=limit<1 ?10:limit
    const skip = (sentPage-1)*sentLimit

    const {books,totalBooks} = await Promise.all([
      Book.find().populate("name email").sort({ createdAt: -1 }).skip(skip).limit(sentLimit),
      Book.countDocument()
    ]) 

    totalPages = Math.ceil(totalBooks / sentLimit)
    return res.status(200).json({
      currentPage: page,
      totalBooks,
      totalPages: totalPages,
      books,
    });
  }

   catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }

  });





// post
router.post("/", async (req, res) => {
  try {
    const { title, author, category } = req.body;

 if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Book title is required",
      });
    }

         if (!author || !author.trim() || !category || !category.trim()) {
       return res.status(400).json({
        message: "Author and category are required",
      });
    }

    const book = Book.create({
      title,
      author,
      category,
    });

    return res.status(201).json({
      message: "Book added successfully",
      book,
    });
  }
  
  catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});





// patch or Update

router.patch("/:id", async (req, res) => {
  
   try {
    const { id } = req.params;
    const { availability } = req.body;

       if (!mongoose.isValidObjectId(id)) {
       return res.status(400).json({
        message: "Invalid book ID",
      });
    }

    if    (typeof availability !== "boolean") {
      return res.status(400).json({
              message: "Availability must be true or false",
      });
    }

           const book = await Book.findByIdAndUpdate(
      id,
   { availability },
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    return res.status(200).json({
     message: "Book availability updated successfully",
      book,
    });
  }
  
  catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;
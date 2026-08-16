const Blog = require('../models/Blog');
const BlogLike = require('../models/BlogLike');

// @desc    Get all blogs with pagination
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 9, category } = req.query;

    const query = {};
    if (category && category !== 'All') {
      query.category = category;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skipNum = (pageNum - 1) * limitNum;

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .sort({ publishedAt: -1 })
      .skip(skipNum)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: blogs.length,
      total,
      pages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      blogs,
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single blog by slug
// @route   GET /api/blogs/:slug
// @access  Public
const getBlogBySlug = async (req, res) => {
  try {
    let querySlug = req.params.slug;
    if (querySlug) {
      querySlug = decodeURIComponent(querySlug).trim().toLowerCase().replace(/\s+/g, '-');
      if (querySlug.includes('andbusiness')) {
        querySlug = querySlug.replace('andbusiness', 'and-business');
      }
      if (querySlug.includes('claritycommitment')) {
        querySlug = querySlug.replace('claritycommitment', 'clarity-commitment');
      }
    }
    const blog = await Blog.findOne({ slug: querySlug });

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Check if current user or fingerprint liked the blog
    const { fingerprint, userId } = req.query;
    let isLiked = false;

    if (fingerprint) {
      const criteria = {
        blogId: blog._id.toString(),
        $or: [
          ...(userId ? [{ userId }] : []),
          { fingerprint }
        ]
      };
      const existingLike = await BlogLike.findOne(criteria);
      if (existingLike) {
        isLiked = true;
      }
    }

    // Get related blogs (excluding the current one)
    const relatedBlogs = await Blog.find({
      slug: { $ne: blog.slug },
      category: blog.category,
    })
      .limit(3);

    res.status(200).json({ success: true, blog, relatedBlogs, isLiked });
  } catch (error) {
    console.error('Error fetching blog detail:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new blog
// @route   POST /api/blogs
// @access  Private/Admin
const createBlog = async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json({ success: true, blog });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
const updateBlog = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, blog });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Increment blog view count
// @route   POST /api/blogs/:id/view
// @access  Public
const incrementBlogView = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    blog.viewCount = (blog.viewCount || 0) + 1;
    await blog.save();
    res.status(200).json({ success: true, viewCount: blog.viewCount });
  } catch (error) {
    console.error('Error incrementing views:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle like status for a blog post
// @route   POST /api/blogs/:id/like
// @access  Public
const toggleBlogLike = async (req, res) => {
  try {
    const blogId = req.params.id;
    const { fingerprint, userId } = req.body;

    if (!fingerprint) {
      return res.status(400).json({ success: false, message: 'Fingerprint is required' });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const criteria = {
      blogId,
      $or: [
        ...(userId ? [{ userId }] : []),
        { fingerprint }
      ]
    };

    const existingLike = await BlogLike.findOne(criteria);
    let isLiked = false;

    if (existingLike) {
      await BlogLike.deleteOne({ _id: existingLike._id });
      blog.likesCount = Math.max(0, (blog.likesCount || 0) - 1);
      isLiked = false;
    } else {
      await BlogLike.create({
        blogId,
        userId: userId || null,
        fingerprint
      });
      blog.likesCount = (blog.likesCount || 0) + 1;
      isLiked = true;
    }

    await blog.save();
    res.status(200).json({
      success: true,
      likesCount: blog.likesCount,
      isLiked
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    await blog.deleteOne();
    res.status(200).json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  incrementBlogView,
  toggleBlogLike,
};

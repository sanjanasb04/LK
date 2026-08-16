const Post = require('../models/Post');
const Community = require('../models/Community');
const Notification = require('../models/Notification');
const { awardXP, checkAndAwardBadges } = require('./courseController');

// @desc    Get all community forum categories
// @route   GET /api/community/categories
const getCategories = async (req, res) => {
  try {
    const categories = await Community.find();
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Categories Error' });
  }
};

// @desc    Get forum posts list with filters
// @route   GET /api/community/posts
const getPosts = async (req, res) => {
  try {
    const { category, search, tag } = req.query;
    let query = {};

    if (category) query.category = category;
    if (tag) query.tags = { $in: [tag] };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { body: { $regex: search, $options: 'i' } }
      ];
    }

    const posts = await Post.find(query)
      .populate('author', 'name avatar level role')
      .populate('comments.author', 'name avatar role')
      .sort({ isPinned: -1, createdAt: -1 });

    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error('Get Posts Error:', error);
    res.status(500).json({ success: false, message: 'Server Posts Feed Error' });
  }
};

// @desc    Get single post with full comments
// @route   GET /api/community/posts/:id
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name avatar level role')
      .populate('comments.author', 'name avatar level role');

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Increment views
    post.views += 1;
    await post.save();

    res.status(200).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Post View Error' });
  }
};

// @desc    Create a new post
// @route   POST /api/community/posts
const createPost = async (req, res) => {
  try {
    const { category, title, body, tags, isPinned, isAnnouncement } = req.body;

    const post = await Post.create({
      author: req.user.id,
      category,
      title,
      body,
      tags: tags || [],
      isPinned: req.user.role === 'admin' ? isPinned : false,
      isAnnouncement: req.user.role === 'admin' ? isAnnouncement : false
    });

    // Award +25 XP for posting in community
    const xpResults = await awardXP(req.user.id, 'community_post', 25, { badgeId: post._id.toString() });

    // Check badge awards
    const socketIo = req.app.get('socketio');
    const badgeResults = await checkAndAwardBadges(req.user.id, socketIo);

    // Notify admins/instructors
    if (isAnnouncement) {
      await Notification.create({
        user: req.user.id,
        type: 'doubt_post',
        title: '📢 New Platform Announcement',
        message: `${req.user.name} published: "${title}"`,
        link: '/lms/community'
      });
    }

    res.status(201).json({ 
      success: true, 
      post,
      xpResults,
      badgeResults
    });
  } catch (error) {
    console.error('Create Post Error:', error);
    res.status(500).json({ success: false, message: 'Server Post Creation Error' });
  }
};

// @desc    Like a community post
// @route   POST /api/community/posts/:id/like
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const likeIndex = post.likes.indexOf(req.user.id);
    let liked = false;
    let xpResults = null;

    if (likeIndex === -1) {
      // Like the post
      post.likes.push(req.user.id);
      liked = true;
      
      // Award XP to post AUTHOR if post hits 5 likes milestone (+30 XP)
      if (post.likes.length === 5) {
        xpResults = await awardXP(post.author, 'post_likes_milestone', 30, { badgeId: post._id.toString() });
        
        await Notification.create({
          user: post.author,
          type: 'leaderboard',
          title: '🔥 Post Milestone!',
          message: `Your post "${post.title}" received 5 likes! Earned +30 XP.`,
          link: `/lms/community`
        });
      }
    } else {
      // Unlike
      post.likes.splice(likeIndex, 1);
    }

    await post.save();

    res.status(200).json({ 
      success: true, 
      likesCount: post.likes.length, 
      liked,
      xpResults
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Like Error' });
  }
};

// @desc    Add comment to a post
// @route   POST /api/community/posts/:id/comments
const addComment = async (req, res) => {
  try {
    const { body } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const comment = {
      author: req.user.id,
      body,
      likes: []
    };

    post.comments.push(comment);
    await post.save();

    // Award +15 XP to commentator for replies/helping
    const xpResults = await awardXP(req.user.id, 'community_reply', 15, { badgeId: post._id.toString() });

    // Check badges
    const socketIo = req.app.get('socketio');
    const badgeResults = await checkAndAwardBadges(req.user.id, socketIo);

    // Notify post author if commenter is someone else
    if (post.author.toString() !== req.user.id.toString()) {
      await Notification.create({
        user: post.author,
        type: 'doubt_reply',
        title: '💬 New Reply on Your Post',
        message: `${req.user.name} commented on "${post.title}"`,
        link: `/lms/community`
      });

      if (socketIo) {
        socketIo.to(post.author.toString()).emit('notification', {
          type: 'doubt_reply',
          title: '💬 New Reply on Your Post',
          message: `${req.user.name} commented on "${post.title}"`
        });
      }
    }

    res.status(201).json({ 
      success: true, 
      comments: post.comments,
      xpResults,
      badgeResults
    });
  } catch (error) {
    console.error('Comment Error:', error);
    res.status(500).json({ success: false, message: 'Server Comment Error' });
  }
};

module.exports = {
  getCategories,
  getPosts,
  getPostById,
  createPost,
  likePost,
  addComment
};

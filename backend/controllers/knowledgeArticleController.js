const KnowledgeArticle = require('../models/KnowledgeArticle');
const UserFavorite = require('../models/UserFavorite');

/**
 * 获取科普文章列表（公开，无需鉴权）
 * 查询参数：page, limit, category, tag, searchTerm, status(默认published)
 */
exports.listArticles = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, category, tag, searchTerm, status = 'published' } = req.query;

    const filter = { status };

    if (category) {
      filter.category = category;
    }

    if (tag) {
      filter.tags = tag;
    }

    if (searchTerm) {
      filter.$text = { $search: searchTerm };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await KnowledgeArticle.countDocuments(filter);
    const articles = await KnowledgeArticle.find(filter)
      .populate('author', 'nickname avatar')
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-content'); // 列表不返回全文

    res.status(200).json({
      status: 'success',
      data: {
        articles,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取科普文章详情（公开，无需鉴权）
 * 自动 +1 views
 */
exports.getArticleById = async (req, res, next) => {
  try {
    const article = await KnowledgeArticle.findById(req.params.id)
      .populate('author', 'nickname avatar');

    if (!article) {
      return res.status(404).json({ status: 'error', message: '文章不存在' });
    }

    // 只有 published 状态的文章才允许公开查看
    if (article.status !== 'published') {
      return res.status(403).json({ status: 'error', message: '文章未公开' });
    }

    // 自动 +1 views
    article.views += 1;
    await article.save();

    res.status(200).json({
      status: 'success',
      data: { article }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ status: 'error', message: '无效的文章ID' });
    }
    next(error);
  }
};

/**
 * 创建科普文章
 * 需 authenticate + authorize(['ADMIN','TEACHER','INSTITUTION'])
 */
exports.createArticle = async (req, res, next) => {
  try {
    const { title, content, category, tags, coverImage, summary, status, isFeatured, publishDate } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ status: 'error', message: '标题、内容和分类为必填项' });
    }

    const article = await KnowledgeArticle.create({
      title,
      content,
      category,
      tags,
      author: req.user.id,
      coverImage,
      summary,
      status: status || 'published',
      isFeatured: isFeatured || false,
      publishDate: publishDate || new Date()
    });

    res.status(201).json({
      status: 'success',
      message: '文章创建成功',
      data: { article }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 更新科普文章
 * 需 authenticate + 作者本人或 ADMIN
 */
exports.updateArticle = async (req, res, next) => {
  try {
    const article = await KnowledgeArticle.findOne({ _id: req.params.id });

    if (!article) {
      return res.status(404).json({ status: 'error', message: '文章不存在' });
    }

    // 所有权校验：作者本人或 ADMIN
    if (article.author.toString() !== req.user.id.toString() && req.user.roleType !== 'ADMIN') {
      return res.status(403).json({ status: 'error', message: '没有权限修改该文章' });
    }

    const allowedFields = ['title', 'content', 'category', 'tags', 'coverImage', 'summary', 'status', 'isFeatured', 'publishDate'];
    const updateData = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ status: 'error', message: '没有可更新的字段' });
    }

    const updatedArticle = await KnowledgeArticle.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'nickname avatar');

    res.status(200).json({
      status: 'success',
      message: '文章更新成功',
      data: { article: updatedArticle }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ status: 'error', message: '无效的文章ID' });
    }
    next(error);
  }
};

/**
 * 删除科普文章
 * 需 authenticate + 作者本人或 ADMIN
 */
exports.deleteArticle = async (req, res, next) => {
  try {
    const article = await KnowledgeArticle.findOne({ _id: req.params.id });

    if (!article) {
      return res.status(404).json({ status: 'error', message: '文章不存在' });
    }

    // 所有权校验：作者本人或 ADMIN
    if (article.author.toString() !== req.user.id.toString() && req.user.roleType !== 'ADMIN') {
      return res.status(403).json({ status: 'error', message: '没有权限删除该文章' });
    }

    // 同时删除该文章的收藏记录
    await UserFavorite.deleteMany({ articleId: req.params.id });

    await KnowledgeArticle.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      message: '文章删除成功'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ status: 'error', message: '无效的文章ID' });
    }
    next(error);
  }
};

/**
 * 置顶/取消置顶文章
 * 需 authenticate + ADMIN
 */
exports.toggleFeatured = async (req, res, next) => {
  try {
    const article = await KnowledgeArticle.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ status: 'error', message: '文章不存在' });
    }

    article.isFeatured = !article.isFeatured;
    await article.save();

    res.status(200).json({
      status: 'success',
      message: article.isFeatured ? '文章已置顶' : '文章已取消置顶',
      data: { article }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ status: 'error', message: '无效的文章ID' });
    }
    next(error);
  }
};

/**
 * 点赞/取消点赞
 * 需 authenticate，返回最新 like 数
 */
exports.toggleLike = async (req, res, next) => {
  try {
    const article = await KnowledgeArticle.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ status: 'error', message: '文章不存在' });
    }

    // 简化实现：每次调用切换点赞状态
    // 使用 likes 字段的增减，不单独建点赞记录表
    if (!article.likedBy) {
      article.likedBy = [];
    }

    const userIdStr = req.user.id.toString();
    const likedIndex = article.likedBy.indexOf(userIdStr);

    if (likedIndex > -1) {
      // 已点赞，取消
      article.likedBy.splice(likedIndex, 1);
      article.likes = Math.max(0, article.likes - 1);
    } else {
      // 未点赞，点赞
      article.likedBy.push(userIdStr);
      article.likes += 1;
    }

    await article.save();

    res.status(200).json({
      status: 'success',
      message: likedIndex > -1 ? '已取消点赞' : '点赞成功',
      data: { liked: likedIndex === -1, likes: article.likes }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ status: 'error', message: '无效的文章ID' });
    }
    next(error);
  }
};

/**
 * 获取当前用户收藏列表
 * 需 authenticate
 */
exports.getMyFavorites = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const total = await UserFavorite.countDocuments({ userId: req.user.id });

    const favorites = await UserFavorite.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate({
        path: 'articleId',
        select: 'title coverImage summary category status',
        populate: { path: 'author', select: 'nickname avatar' }
      });

    res.status(200).json({
      status: 'success',
      data: {
        favorites,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 收藏/取消收藏文章
 * 需 authenticate
 */
exports.toggleFavorite = async (req, res, next) => {
  try {
    const article = await KnowledgeArticle.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ status: 'error', message: '文章不存在' });
    }

    const existing = await UserFavorite.findOne({
      userId: req.user.id,
      articleId: req.params.id
    });

    if (existing) {
      // 已收藏，取消
      await UserFavorite.findByIdAndDelete(existing._id);
      res.status(200).json({
        status: 'success',
        message: '已取消收藏',
        data: { favorited: false }
      });
    } else {
      // 未收藏，收藏
      await UserFavorite.create({
        userId: req.user.id,
        articleId: req.params.id
      });
      res.status(200).json({
        status: 'success',
        message: '收藏成功',
        data: { favorited: true }
      });
    }
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ status: 'error', message: '无效的文章ID' });
    }
    // unique 索引冲突（并发收藏）视为已收藏
    if (error.code === 11000) {
      return res.status(200).json({
        status: 'success',
        message: '已收藏',
        data: { favorited: true }
      });
    }
    next(error);
  }
};

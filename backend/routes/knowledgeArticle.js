const express = require('express');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const knowledgeArticleController = require('../controllers/knowledgeArticleController');

const router = express.Router();

/**
 * 科普知识推送模块路由
 */

// ========== 公开端点（无需鉴权） ==========

// 获取科普文章列表（支持分页、筛选、全文搜索）
router.get('/articles', knowledgeArticleController.listArticles);

// 获取科普文章详情
router.get('/articles/:id', knowledgeArticleController.getArticleById);

// ========== 需鉴权端点 ==========

// 获取当前用户收藏列表
router.get('/favorites', authenticate, knowledgeArticleController.getMyFavorites);

// 创建科普文章（需 ADMIN/TEACHER/INSTITUTION）
router.post('/articles', authenticate, authorize(['ADMIN', 'TEACHER', 'INSTITUTION']), knowledgeArticleController.createArticle);

// 更新科普文章（需作者本人或 ADMIN）
router.put('/articles/:id', authenticate, knowledgeArticleController.updateArticle);

// 删除科普文章（需作者本人或 ADMIN）
router.delete('/articles/:id', authenticate, knowledgeArticleController.deleteArticle);

// 置顶/取消置顶（需 ADMIN）
router.patch('/articles/:id/featured', authenticate, authorize(['ADMIN']), knowledgeArticleController.toggleFeatured);

// 点赞/取消点赞
router.post('/articles/:id/like', authenticate, knowledgeArticleController.toggleLike);

// 收藏/取消收藏
router.post('/articles/:id/favorite', authenticate, knowledgeArticleController.toggleFavorite);

module.exports = router;

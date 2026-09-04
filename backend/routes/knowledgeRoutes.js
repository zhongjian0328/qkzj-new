const express = require('express');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const knowledgeArticleController = require('../controllers/knowledgeArticleController');
const knowledgeController = require('../controllers/knowledgeController');

const router = express.Router();

/**
 * 知识学习相关路由（合并知识图谱 + 科普文章 + 题库测验）
 * 路径对齐前端 knowledgeApi
 */

// ========== 知识图谱 ==========

// 获取知识图谱列表
router.get('/graphs', authenticate, knowledgeController.listGraphs);

// 获取知识图谱详情
router.get('/graphs/:graphId', authenticate, knowledgeController.getGraphDetail);

// 搜索知识点
router.get('/search', authenticate, knowledgeController.searchKnowledge);

// ========== 题库与测验 ==========

// 获取题库列表
router.get('/questions', authenticate, knowledgeController.listQuestions);

// 获取题目详情
router.get('/questions/:questionId', authenticate, knowledgeController.getQuestionDetail);

// 提交答题结果
router.post('/quiz/submit', authenticate, knowledgeController.submitQuiz);

// 获取测验结果
router.get('/quiz/result/:quizId', authenticate, knowledgeController.getQuizResult);

// ========== 科普文章（公开 + 鉴权） ==========

// 获取科普文章列表（支持分页、筛选、全文搜索）
router.get('/articles', knowledgeArticleController.listArticles);

// 获取科普文章详情
router.get('/articles/:id', knowledgeArticleController.getArticleById);

// 获取当前用户收藏列表
router.get('/favorites', authenticate, knowledgeArticleController.getMyFavorites);

// 创建科普文章（需 ADMIN/TEACHER/INSTITUTION）
router.post('/articles', authenticate, authorize(['ADMIN', 'TEACHER', 'INSTITUTION']), knowledgeArticleController.createArticle);

// 更新科普文章
router.put('/articles/:id', authenticate, knowledgeArticleController.updateArticle);

// 删除科普文章
router.delete('/articles/:id', authenticate, knowledgeArticleController.deleteArticle);

// 置顶/取消置顶（需 ADMIN）
router.patch('/articles/:id/featured', authenticate, authorize(['ADMIN']), knowledgeArticleController.toggleFeatured);

// 点赞/取消点赞
router.post('/articles/:id/like', authenticate, knowledgeArticleController.toggleLike);

// 收藏/取消收藏
router.post('/articles/:id/favorite', authenticate, knowledgeArticleController.toggleFavorite);

module.exports = router;

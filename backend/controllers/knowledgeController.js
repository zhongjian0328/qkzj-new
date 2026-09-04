const KnowledgeGraph = require('../models/KnowledgeGraph');
const QuestionBank = require('../models/QuestionBank');
const QuizResult = require('../models/QuizResult');

// ========== 知识图谱 ==========

/**
 * 获取知识图谱列表
 * 查询参数：page, limit, searchTerm, category, difficultyLevel
 */
exports.listGraphs = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, searchTerm, category, difficultyLevel } = req.query;

    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (difficultyLevel) {
      filter.difficultyLevel = difficultyLevel;
    }

    if (searchTerm) {
      filter.$text = { $search: searchTerm };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await KnowledgeGraph.countDocuments(filter);

    let sort = { chapterNumber: 1 };
    if (searchTerm) {
      sort = { score: { $meta: 'textScore' }, chapterNumber: 1 };
    }

    const graphs = await KnowledgeGraph.find(filter)
      .select('-pathogen -epidemiology -symptoms -pathologicalChanges -diagnosis -prevention -immunizationSchedule -differentialDiagnosis -medicationNotes')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      status: 'success',
      data: {
        graphs,
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
 * 获取知识图谱详情
 * 自动 +1 views，并 populate relatedDiseases
 */
exports.getGraphDetail = async (req, res, next) => {
  try {
    const graph = await KnowledgeGraph.findById(req.params.graphId);

    if (!graph) {
      return res.status(404).json({ status: 'error', message: '知识节点不存在' });
    }

    // 自动 +1 views
    graph.views += 1;
    await graph.save();

    // populate 关联疾病
    const relatedIds = graph.relatedDiseases.map(r => r.diseaseId);
    const relatedGraphs = await KnowledgeGraph.find({ _id: { $in: relatedIds } })
      .select('diseaseName category description chapterNumber');

    const result = graph.toObject();
    result.relatedDiseases = graph.relatedDiseases.map(r => {
      const related = relatedGraphs.find(g => g._id.toString() === r.diseaseId.toString());
      return {
        diseaseId: r.diseaseId,
        similarity: r.similarity,
        diseaseName: related ? related.diseaseName : '未知',
        category: related ? related.category : '',
        description: related ? related.description : ''
      };
    });

    res.status(200).json({
      status: 'success',
      data: { graph: result }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ status: 'error', message: '无效的知识节点ID' });
    }
    next(error);
  }
};

/**
 * 搜索知识点（全文搜索 + 症状/病变标签搜索）
 */
exports.searchKnowledge = async (req, res, next) => {
  try {
    const { q: searchTerm, category, page = 1, limit = 20 } = req.query;

    if (!searchTerm) {
      return res.status(400).json({ status: 'error', message: '请提供搜索关键词' });
    }

    const filter = { $text: { $search: searchTerm } };

    if (category) {
      filter.category = category;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await KnowledgeGraph.countDocuments(filter);

    const results = await KnowledgeGraph.find(filter)
      .select('diseaseName category description chapterNumber symptomTags lesionTags tags difficultyLevel views')
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      status: 'success',
      data: {
        results,
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

// ========== 题库与测验 ==========

/**
 * 获取题库列表
 * 查询参数：page, limit, knowledgePoint, difficulty, questionType, tags
 */
exports.listQuestions = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, knowledgePoint, difficulty, questionType, tags } = req.query;

    const filter = {};

    if (knowledgePoint) {
      filter.knowledgePoint = { $regex: knowledgePoint, $options: 'i' };
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    if (questionType) {
      filter.questionType = questionType;
    }

    if (tags) {
      const tagArr = typeof tags === 'string' ? tags.split(',') : tags;
      filter.tags = { $in: tagArr };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await QuestionBank.countDocuments(filter);

    const questions = await QuestionBank.find(filter)
      .populate('referenceGraphId', 'diseaseName category chapterNumber')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // 列表不返回正确答案
    const safeQuestions = questions.map(q => {
      const obj = q.toObject();
      delete obj.correctAnswer;
      return obj;
    });

    res.status(200).json({
      status: 'success',
      data: {
        questions: safeQuestions,
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
 * 获取题目详情（含正确答案，需鉴权）
 */
exports.getQuestionDetail = async (req, res, next) => {
  try {
    const question = await QuestionBank.findById(req.params.questionId)
      .populate('referenceGraphId', 'diseaseName category description');

    if (!question) {
      return res.status(404).json({ status: 'error', message: '题目不存在' });
    }

    // +1 usageCount
    question.usageCount += 1;
    await question.save();

    res.status(200).json({
      status: 'success',
      data: { question }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ status: 'error', message: '无效的题目ID' });
    }
    next(error);
  }
};

/**
 * 提交答题结果
 * body: { questionAnswers: [{ questionId, userAnswer }], filterSnapshot }
 */
exports.submitQuiz = async (req, res, next) => {
  try {
    const { questionAnswers, filterSnapshot } = req.body;

    if (!questionAnswers || !Array.isArray(questionAnswers) || questionAnswers.length === 0) {
      return res.status(400).json({ status: 'error', message: '请提供答题数据' });
    }

    // 获取所有涉及题目的正确答案
    const questionIds = questionAnswers.map(qa => qa.questionId);
    const questions = await QuestionBank.find({ _id: { $in: questionIds } });

    // 评分
    const results = questionAnswers.map(qa => {
      const question = questions.find(q => q._id.toString() === qa.questionId);
      if (!question) return null;

      let isCorrect = false;
      if (question.questionType === 'SINGLE_CHOICE' || question.questionType === 'TRUE_FALSE') {
        isCorrect = String(qa.userAnswer) === String(question.correctAnswer);
      } else if (question.questionType === 'MULTIPLE_CHOICE') {
        const userSorted = (qa.userAnswer || []).sort().join(',');
        const correctSorted = (question.correctAnswer || []).sort().join(',');
        isCorrect = userSorted === correctSorted;
      }
      // SHORT_ANSWER 不自动评分
      else if (question.questionType === 'SHORT_ANSWER') {
        isCorrect = false;
      }

      return {
        questionId: qa.questionId,
        userAnswer: qa.userAnswer,
        isCorrect
      };
    }).filter(Boolean);

    const correctCount = results.filter(r => r.isCorrect).length;
    const totalQuestions = results.length;
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    // 更新题目的 usageCount 和 correctRate
    for (const r of results) {
      const q = questions.find(q => q._id.toString() === r.questionId);
      if (q) {
        const newUsageCount = (q.usageCount || 0) + 1;
        const newCorrectRate = newUsageCount > 0
          ? Math.round(((q.correctRate || 0) * (newUsageCount - 1) + (r.isCorrect ? 100 : 0)) / newUsageCount)
          : 0;
        await QuestionBank.findByIdAndUpdate(r.questionId, {
          usageCount: newUsageCount,
          correctRate: newCorrectRate
        });
      }
    }

    // 保存测验结果
    const quizResult = await QuizResult.create({
      userId: req.user.id,
      questions: results,
      totalQuestions,
      correctCount,
      score,
      filterSnapshot: filterSnapshot || {}
    });

    res.status(201).json({
      status: 'success',
      data: {
        quizId: quizResult._id,
        totalQuestions,
        correctCount,
        score,
        results: results.map((r, i) => ({
          ...r,
          correctAnswer: questions.find(q => q._id.toString() === r.questionId)?.correctAnswer,
          explanation: questions.find(q => q._id.toString() === r.questionId)?.explanation
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取测验结果
 */
exports.getQuizResult = async (req, res, next) => {
  try {
    const quizResult = await QuizResult.findOne({
      _id: req.params.quizId,
      userId: req.user.id
    });

    if (!quizResult) {
      return res.status(404).json({ status: 'error', message: '测验结果不存在' });
    }

    // populate 题目信息
    const questionIds = quizResult.questions.map(q => q.questionId);
    const questions = await QuestionBank.find({ _id: { $in: questionIds } })
      .select('questionText questionType options knowledgePoint difficulty correctAnswer explanation');

    const detailedResults = quizResult.questions.map(qr => {
      const question = questions.find(q => q._id.toString() === qr.questionId.toString());
      return {
        questionId: qr.questionId,
        questionText: question?.questionText || '',
        questionType: question?.questionType || '',
        options: question?.options || [],
        userAnswer: qr.userAnswer,
        correctAnswer: question?.correctAnswer,
        isCorrect: qr.isCorrect,
        explanation: question?.explanation || ''
      };
    });

    res.status(200).json({
      status: 'success',
      data: {
        quizId: quizResult._id,
        totalQuestions: quizResult.totalQuestions,
        correctCount: quizResult.correctCount,
        score: quizResult.score,
        filterSnapshot: quizResult.filterSnapshot,
        completedAt: quizResult.completedAt,
        results: detailedResults
      }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ status: 'error', message: '无效的测验结果ID' });
    }
    next(error);
  }
};

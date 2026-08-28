const mongoose = require('mongoose');

// 诊断模式枚举
const DIAGNOSIS_MODE = ['CHAT', 'VET'];
// 审核状态枚举
const AUDIT_STATUS = ['UNREVIEWED', 'REVIEWED', 'REVISED'];

// 诊断记录模型Schema
const diagnosisRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  diagnosisTime: {
    type: Date,
    default: Date.now
  },
  diagnosisMode: {
    type: String,
    required: true,
    enum: DIAGNOSIS_MODE
  },
  basicInfo: {
    farmLocation: {
      type: String,
      trim: true
    },
    chickenBreed: {
      type: String,
      trim: true
    },
    ageDays: {
      type: Number
    },
    stockQuantity: {
      type: Number
    },
    onsetTime: {
      type: Date
    }
  },
  clinicalSymptoms: {
    symptoms: {
      type: [String]
    },
    averageTemperature: {
      type: Number
    },
    respiratoryRate: {
      type: Number
    },
    mortalityRate: {
      type: Number
    },
    feedDecrease: {
      type: Number
    },
    eggDecrease: {
      type: Number
    }
  },
  pathologicalChanges: {
    lesions: {
      type: [String]
    },
    description: {
      type: String,
      trim: true
    }
  },
  rapidTestResults: {
    aivTest: {
      type: String,
      enum: ['', 'positive', 'negative', 'suspected']
    },
    ndvTest: {
      type: String,
      enum: ['', 'positive', 'negative', 'suspected']
    },
    ibvTest: {
      type: String,
      enum: ['', 'positive', 'negative', 'suspected']
    },
    otherTests: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  samplingInfo: {
    sampleCount: {
      type: Number
    },
    preservationCondition: {
      type: String,
      enum: ['', 'refrigerated', 'frozen', 'ambient', 'special']
    },
    samplingSites: {
      type: [String]
    }
  },
  experimentalData: {
    experiments: {
      type: [String]
    },
    bloodRoutine: {
      wbcCount: {
        type: Number
      },
      rbcCount: {
        type: Number
      }
    },
    biochemical: {
      altLevel: {
        type: Number
      },
      astLevel: {
        type: Number
      }
    },
    description: {
      type: String,
      trim: true
    }
  },
  chatHistory: {
    type: [{ sender: String, message: String, timestamp: Date }]
  },
  singleDiagnosis: {
    type: [{ pathogenName: String, confidence: Number, coreEvidence: String }]
  },
  mixedInfectionRisk: {
    riskLevel: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'EXTREME']
    },
    infectionCombinations: {
      type: [{ pathogens: [String], probability: Number }]
    }
  },
  coreThreat: {
    type: String,
    trim: true
  },
  emergencyMeasures: {
    shortTerm: {
      type: String,
      trim: true
    },
    mediumTerm: {
      type: String,
      trim: true
    },
    longTerm: {
      type: String,
      trim: true
    }
  },
  diagnosisPlan: {
    emergencyTests: {
      type: [String]
    },
    importantTests: {
      type: [String]
    },
    inDepthTests: {
      type: [String]
    }
  },
  finalDiagnosis: {
    type: mongoose.Schema.Types.Mixed
  },
  emergencyPreventionPlan: {
    type: mongoose.Schema.Types.Mixed
  },
  biosecurityOptimizationPlan: {
    type: mongoose.Schema.Types.Mixed
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  isSpecialCase: {
    type: Boolean,
    default: false
  },
  studentDiagnosisInput: {
    type: String,
    trim: true
  },
  mentorCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InternshipLog'
  },
  auditStatus: {
    type: String,
    default: 'UNREVIEWED',
    enum: AUDIT_STATUS
  },
  auditorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  auditComments: {
    type: String,
    trim: true
  },
  imageUrls: {
    type: [String]
  }
}, {
  timestamps: true
});

// 索引
diagnosisRecordSchema.index({ userId: 1, diagnosisTime: -1 });
diagnosisRecordSchema.index({ location: '2dsphere' });

// 诊断记录模型
const DiagnosisRecord = mongoose.model('DiagnosisRecord', diagnosisRecordSchema);

module.exports = DiagnosisRecord;
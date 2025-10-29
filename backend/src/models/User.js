const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: {
    level: { type: Number, default: 1 },
    experience: { type: Number, default: 0 },
    specialization: {
      type: String,
      enum: ['network', 'application', 'incident-response', 'none'],
      default: 'none'
    },
    reputation: { type: Number, default: 0 },
    skills: [{
      name: String,
      level: Number,
      progress: Number
    }]
  },
  learningPath: {
    currentModule: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
    completedModules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
    recommendedContent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Content' }]
  },
  gameStats: {
    totalPoints: { type: Number, default: 0 },
    badges: [String],
    rank: { type: String, default: 'Newbie' },
    streak: { type: Number, default: 0 }
  },
  aiCoach: {
    knowledgeLevel: { type: Number, default: 0 },
    weakAreas: [String],
    learningStyle: { type: String, default: 'visual' }
  }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('User', userSchema);

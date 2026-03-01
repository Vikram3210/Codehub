import mongoose from 'mongoose';

const userSettingsSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  notifications: { type: Boolean, default: true },
  soundEffects: { type: Boolean, default: true },
  theme: { type: String, default: 'dark' },
  language: { type: String, default: 'en' },
  autoStart: { type: Boolean, default: false },
  defaultTimeLimit: { type: Number, default: 20 },
  defaultQuestions: { type: Number, default: 10 },
  defaultDomain: { type: String, default: 'Mixed' },
  maxPlayers: { type: Number, default: 10 },
}, {
  timestamps: true,
  strict: false, // allow other fields from frontend
});

userSettingsSchema.index({ username: 1 });

const UserSettings = mongoose.model('UserSettings', userSettingsSchema);
export default UserSettings;

import mongoose from 'mongoose';
const resumeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  fileName: { type: String, default: '' },
  originalName: { type: String, default: '' },
  size: { type: Number, default: 0 },
  mimeType: { type: String, default: '' },
  description: { type: String, default: '' },
  isDefault: { type: Boolean, default: false }
}, { timestamps: true });
export default mongoose.model('Resume', resumeSchema);

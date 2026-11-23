import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({ status: { type: String, required: true }, note: { type: String, default: '' }, at: { type: Date, default: Date.now } }, { _id: false });
const applicationSchema = new mongoose.Schema({
  company: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  jobUrl: { type: String, default: '' },
  location: { type: String, default: '' },
  workMode: { type: String, enum: ['Remote', 'Hybrid', 'On-site'], default: 'Remote' },
  source: { type: String, default: 'Company website' },
  status: { type: String, enum: ['Wishlist','Applied','OA','Interview','Offer','Rejected','Withdrawn'], default: 'Applied' },
  priority: { type: String, enum: ['High','Medium','Low'], default: 'Medium' },
  appliedAt: { type: Date, default: Date.now },
  deadline: { type: Date, default: null },
  salary: { type: String, default: '' },
  resume: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', default: null },
  notes: { type: String, default: '' },
  contact: { type: String, default: '' },
  nextFollowUp: { type: Date, default: null },
  history: { type: [historySchema], default: [] }
}, { timestamps: true });
applicationSchema.index({ company: 1, role: 1 });
export default mongoose.model('Application', applicationSchema);

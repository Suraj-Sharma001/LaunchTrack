import 'dotenv/config';import mongoose from 'mongoose';import Application from './models/Application.js';import Resume from './models/Resume.js';
await mongoose.connect(process.env.MONGO_URI||'mongodb://127.0.0.1:27017/launchtrack');
if(await Application.countDocuments()){console.log('Applications already exist. Seed skipped to prevent duplicates.');await mongoose.disconnect();process.exit(0)}
const r=await Resume.create({name:'Backend / SDE — v3',description:'Example resume placeholder — upload your real PDF in Resume Library',originalName:'example-not-uploaded.pdf',isDefault:true});
const now=new Date();const ago=d=>new Date(now.getTime()-d*86400000);
const items=[
['Drivetrain','Engineering Intern — Gen AI','Interview','Remote','High',5,'US startup'],
['Rubrik','Software Engineer Intern','OA','On-site','High',8,'Company website'],
['Amazon','SDE I Intern','Applied','On-site','High',11,'Company website'],
['Certa','Frontend Engineer Intern','Applied','Remote','Medium',2,'Ashby'],
['Outmarket AI','AI Engineering Intern','Wishlist','Remote','High',0,'Company website'],
['Agentrail','Product Engineering Intern','Applied','Remote','Medium',14,'Founder post'],
['Elip AI','Software Engineer Intern','Rejected','Hybrid','Low',21,'LinkedIn'],
['Weekday','Software Engineer Intern','Applied','Remote','Medium',17,'Lever'],
['Stripe','Software Engineering Intern','Wishlist','Hybrid','Medium',0,'Referral'],
['Vercel','Software Engineer Intern','Interview','Remote','High',28,'Company website'],
['Linear','Product Engineering Intern','Offer','Remote','High',36,'Company website'],
['Ramp','Backend Engineering Intern','Applied','On-site','Medium',42,'LinkedIn']];
await Application.insertMany(items.map(([company,role,status,workMode,priority,days,source],i)=>({company,role,status,workMode,priority,source,location:workMode==='Remote'?'Remote · India':'Bengaluru, India',appliedAt:ago(days),resume:status==='Wishlist'?null:r._id,history:[{status,note:'Demo record'}],notes:i===0?'Discussed distributed caching and LLM infrastructure.':'',jobUrl:''})));
console.log('12 demo applications added. Replace demo records with your own.');await mongoose.disconnect();

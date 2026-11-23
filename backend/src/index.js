import 'dotenv/config';
import express from 'express';import mongoose from 'mongoose';import cors from 'cors';import helmet from 'helmet';import morgan from 'morgan';
import applications from './routes/applications.js';import resumes from './routes/resumes.js';import analytics from './routes/analytics.js';
const app=express();app.disable('x-powered-by');app.use(helmet());app.use(cors({origin:(process.env.FRONTEND_URL||'http://localhost:3000').split(',').map(s=>s.trim())}));app.use(express.json({limit:'1mb'}));app.use(morgan('dev'));
app.get('/api/health',(_,res)=>res.json({ok:true,service:'LaunchTrack API'}));
app.use('/api/applications',applications);app.use('/api/resumes',resumes);app.use('/api/analytics',analytics);
app.use((err,req,res,next)=>{console.error(err);if(err.name==='ValidationError'||err.name==='CastError'||err.name==='MulterError')return res.status(400).json({error:err.message});res.status(err.status||500).json({error:err.status?err.message:'Something went wrong'});});
const port=Number(process.env.PORT||5000);
try{await mongoose.connect(process.env.MONGO_URI||'mongodb://127.0.0.1:27017/launchtrack');console.log('MongoDB connected');app.listen(port,()=>console.log(`LaunchTrack API http://localhost:${port}`));}
catch(err){console.error('Database connection failed:',err.message);process.exit(1)}

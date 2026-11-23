import { Router } from 'express';
import multer from 'multer';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import Resume from '../models/Resume.js';
import Application from '../models/Application.js';
const router=Router();
const uploads=path.resolve('uploads');fs.mkdirSync(uploads,{recursive:true});
const storage=multer.diskStorage({destination:uploads,filename:(_,file,cb)=>cb(null,crypto.randomUUID()+path.extname(file.originalname).toLowerCase())});
const upload=multer({storage,limits:{fileSize:8*1024*1024},fileFilter:(_,file,cb)=>{
 if(!/\.(pdf|docx)$/i.test(file.originalname))return cb(new Error('Only PDF or DOCX resumes are allowed'));
 cb(null,true);
}});
router.get('/',async(req,res,next)=>{try{const docs=await Resume.find().sort({isDefault:-1,createdAt:-1}).lean();const counts=await Application.aggregate([{$match:{resume:{$ne:null}}},{$group:{_id:'$resume',count:{$sum:1}}}]);const lookup=new Map(counts.map(x=>[String(x._id),x.count]));res.json(docs.map(x=>({...x,applicationCount:lookup.get(String(x._id))||0})));}catch(e){next(e)}});
router.post('/',upload.single('file'),async(req,res,next)=>{try{
 if(!req.file)return res.status(400).json({error:'Attach a PDF or DOCX file'});
 const name=String(req.body.name||path.parse(req.file.originalname).name).trim();
 if(!name){fs.unlinkSync(req.file.path);return res.status(400).json({error:'Resume name required'});}
 const isDefault=(await Resume.countDocuments())===0;
 const doc=await Resume.create({name,fileName:req.file.filename,originalName:req.file.originalname,size:req.file.size,mimeType:req.file.mimetype,description:req.body.description||'',isDefault});res.status(201).json(doc);
}catch(e){if(req.file&&fs.existsSync(req.file.path))fs.unlinkSync(req.file.path);next(e)}});
router.get('/:id/download',async(req,res,next)=>{try{const doc=await Resume.findById(req.params.id);if(!doc)return res.status(404).json({error:'Resume not found'});res.download(path.join(uploads,doc.fileName),doc.originalName);}catch(e){next(e)}});
router.patch('/:id/default',async(req,res,next)=>{try{const doc=await Resume.findById(req.params.id);if(!doc)return res.status(404).json({error:'Resume not found'});await Resume.updateMany({},{$set:{isDefault:false}});doc.isDefault=true;await doc.save();res.json(doc);}catch(e){next(e)}});
router.delete('/:id',async(req,res,next)=>{try{const doc=await Resume.findById(req.params.id);if(!doc)return res.status(404).json({error:'Resume not found'});await Application.updateMany({resume:doc._id},{$set:{resume:null}});await doc.deleteOne();const file=path.join(uploads,doc.fileName);if(fs.existsSync(file))fs.unlinkSync(file);if(doc.isDefault){const replacement=await Resume.findOne().sort({createdAt:-1});if(replacement){replacement.isDefault=true;await replacement.save();}}res.status(204).end();}catch(e){next(e)}});
export default router;

import { Router } from 'express';
import { z } from 'zod';
import Application from '../models/Application.js';
import Resume from '../models/Resume.js';
const router = Router();
const statuses = ['Wishlist','Applied','OA','Interview','Offer','Rejected','Withdrawn'];
const schema = z.object({
 company:z.string().trim().min(1).max(150), role:z.string().trim().min(1).max(200),
 jobUrl:z.union([z.string().url(),z.literal('')]).optional(), location:z.string().optional(),
 workMode:z.enum(['Remote','Hybrid','On-site']).optional(), source:z.string().optional(),
 status:z.enum(statuses).optional(),priority:z.enum(['High','Medium','Low']).optional(),
 appliedAt:z.union([z.string(),z.date(),z.null()]).optional(), deadline:z.union([z.string(),z.null()]).optional(),
 salary:z.string().optional(),resume:z.union([z.string(),z.null()]).optional(), notes:z.string().optional(),
 contact:z.string().optional(),nextFollowUp:z.union([z.string(),z.null()]).optional()
});
function parse(body, partial=false){const r=(partial?schema.partial():schema).safeParse(body);if(!r.success){const e=new Error(r.error.issues.map(i=>i.path.join('.')+': '+i.message).join('; '));e.status=400;throw e;}return r.data;}
router.get('/',async(req,res,next)=>{try{
 const {search,status,priority,workMode,sort='newest'}=req.query;
 const filter={}; if(status&&status!=='All')filter.status=status;
 if(priority&&priority!=='All')filter.priority=priority;
 if(workMode&&workMode!=='All')filter.workMode=workMode;
 if(search){const safe=String(search).replace(/[^a-zA-Z0-9 ]/g, '\\$&');filter.$or=[{company:{$regex:safe,$options:'i'}},{role:{$regex:safe,$options:'i'}},{location:{$regex:safe,$options:'i'}}];}
 const order=sort==='oldest'?{appliedAt:1}:sort==='company'?{company:1}:{appliedAt:-1,createdAt:-1};
 res.json(await Application.find(filter).populate('resume','name originalName').sort(order).lean());
}catch(e){next(e)}});
router.post('/',async(req,res,next)=>{try{
 const data=parse(req.body);
 if(data.resume && !await Resume.exists({_id:data.resume})){return res.status(400).json({error:'Resume not found'});}
 const item=await Application.create({...data,history:[{status:data.status||'Applied',note:'Application created'}]});
 res.status(201).json(await item.populate('resume','name originalName'));
}catch(e){next(e)}});
router.patch('/:id',async(req,res,next)=>{try{
 const data=parse(req.body,true);const existing=await Application.findById(req.params.id);
 if(!existing)return res.status(404).json({error:'Application not found'});
 if(data.resume && !await Resume.exists({_id:data.resume}))return res.status(400).json({error:'Resume not found'});
 if(data.status && data.status!==existing.status){existing.history.push({status:data.status,note:'Status updated'});}
 Object.assign(existing,data);await existing.save();res.json(await existing.populate('resume','name originalName'));
}catch(e){next(e)}});
router.delete('/:id',async(req,res,next)=>{try{const item=await Application.findByIdAndDelete(req.params.id);if(!item)return res.status(404).json({error:'Application not found'});res.status(204).end();}catch(e){next(e)}});
export default router;

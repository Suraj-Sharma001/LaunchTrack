import {Router} from 'express';
import Application from '../models/Application.js';
const router=Router();
router.get('/',async(req,res,next)=>{try{
 const all=await Application.find().select('status appliedAt workMode priority resume nextFollowUp createdAt').lean();
 const byStatus=Object.fromEntries(['Wishlist','Applied','OA','Interview','Offer','Rejected','Withdrawn'].map(s=>[s,0]));
 const byMode={Remote:0,Hybrid:0,'On-site':0};const byMonth={};
 for(const a of all){byStatus[a.status]=(byStatus[a.status]||0)+1;byMode[a.workMode]=(byMode[a.workMode]||0)+1;
 const d=new Date(a.appliedAt||a.createdAt);if(!Number.isNaN(d.getTime())){const key=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;byMonth[key]=(byMonth[key]||0)+1;}}
 const active=all.filter(x=>!['Wishlist','Rejected','Withdrawn'].includes(x.status)).length;
 const interviews=all.filter(x=>['Interview','Offer'].includes(x.status)).length;
 const followUps=all.filter(x=>x.nextFollowUp&&new Date(x.nextFollowUp)<=new Date()&&!['Rejected','Withdrawn','Offer'].includes(x.status)).length;
 res.json({total:all.length,active,interviews,offers:byStatus.Offer,responseRate:all.length?Math.round(100*all.filter(x=>['OA','Interview','Offer','Rejected'].includes(x.status)).length/all.length):0,byStatus,byMode,byMonth,followUps});
}catch(e){next(e)}});
export default router;

const json=(res,status,body)=>res.status(status).json(body);
export default async function handler(req,res){
  if(req.method!=='POST')return json(res,405,{error:'Method not allowed'});
  try{
    const auth=req.headers.authorization;
    if(!auth?.startsWith('Bearer '))return json(res,401,{error:'Authentication required'});
    const {tripId,messages}=req.body||{};
    if(!Array.isArray(messages)||!messages.length||messages.length>12)return json(res,400,{error:'Invalid request'});
    if(messages.some(m=>!['user','assistant'].includes(m.role)||typeof m.content!=='string'||!m.content.trim()||m.content.length>500))return json(res,400,{error:'Invalid messages'});
    const {SUPABASE_URL:url,SUPABASE_ANON_KEY:key,GEMINI_API_KEY:gemini}=process.env;
    if(!url||!key||!gemini)return json(res,500,{error:'Travel assistant unavailable'});
    let context=null;
    if(tripId){const select='id,name,description,start_date,end_date,budget,trip_stops(id,start_date,end_date,city:cities(name,country),trip_activities(id,scheduled_date,scheduled_time,custom_cost,activity:activities(name,category,cost,duration_minutes)))';const r=await fetch(`${url}/rest/v1/trips?id=eq.${encodeURIComponent(tripId)}&select=${encodeURIComponent(select)}`,{headers:{apikey:key,Authorization:auth,Accept:'application/vnd.pgrst.object+json'}});if(!r.ok)return json(res,403,{error:'Journey unavailable'});const t=await r.json();context={name:t.name,description:t.description,startDate:t.start_date,endDate:t.end_date,budget:t.budget,stops:(t.trip_stops||[]).map(s=>({city:s.city?.name,country:s.city?.country,startDate:s.start_date,endDate:s.end_date,activities:(s.trip_activities||[]).map(a=>({name:a.activity?.name,category:a.activity?.category,date:a.scheduled_date,time:a.scheduled_time,cost:Number(a.custom_cost??a.activity?.cost??0)}))}))};}
    const prompt=`You are GlobeTrotter AI. Be concise and practical. Use supplied itinerary facts when present, distinguish facts from suggestions, and never claim live data, bookings, or mutations. Context: ${JSON.stringify(context)}`;
    const contents=[{role:'user',parts:[{text:prompt}]},...messages.map(m=>({role:m.role==='assistant'?'model':'user',parts:[{text:m.content}]}))];
    const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(gemini)}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents,generationConfig:{temperature:.35,maxOutputTokens:600}})});
    if(!r.ok)return json(res,502,{error:'Travel assistant unavailable'});
    const data=await r.json();const text=data.candidates?.[0]?.content?.parts?.map(p=>p.text).join('').trim();if(!text)return json(res,502,{error:'Travel assistant unavailable'});return json(res,200,{text,answer:text});
  }catch{return json(res,500,{error:'Travel assistant unavailable'});}
}

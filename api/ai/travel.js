const json=(res,status,body)=>res.status(status).json(body);
const report=(stage,error,extra={})=>console.error(`[AI] ${stage}`,{message:error?.message||String(error),code:error?.code,status:error?.status||extra.status,details:error?.details,hint:error?.hint});
export default async function handler(req,res){
  if(req.method!=='POST')return json(res,405,{error:'Method not allowed'});
  try{
    const auth=req.headers.authorization;
    if(!auth?.startsWith('Bearer '))return json(res,401,{error:'Authentication required'});
    const {tripId,messages}=req.body||{};
    if(!Array.isArray(messages)||!messages.length||messages.length>12)return json(res,400,{error:'Invalid request'});
    if(messages.some(m=>!['user','assistant'].includes(m.role)||typeof m.content!=='string'||!m.content.trim()||m.content.length>500))return json(res,400,{error:'Invalid messages'});
    const {SUPABASE_URL:url,SUPABASE_ANON_KEY:key,GEMINI_API_KEY:gemini}=process.env;
    if(!url||!key||!gemini){console.error('[AI] configuration missing',{supabaseUrl:Boolean(url),supabaseAnonKey:Boolean(key),geminiApiKey:Boolean(gemini)});return json(res,500,{error:'Travel assistant configuration error'});}
    let context=null;
    if(tripId){const select='id,name,description,start_date,end_date,budget,trip_stops(id,start_date,end_date,city:cities(name,country),trip_activities(id,scheduled_date,scheduled_time,custom_cost,activity:activities(name,category,cost,duration_minutes)))';let r;try{r=await fetch(`${url}/rest/v1/trips?id=eq.${encodeURIComponent(tripId)}&select=${encodeURIComponent(select)}`,{headers:{apikey:key,Authorization:auth,Accept:'application/vnd.pgrst.object+json'}})}catch(error){report('supabase context request',error);return json(res,502,{error:'Journey context unavailable'})}if(!r.ok){console.error('[AI] Supabase context response',{status:r.status});return json(res,403,{error:'Journey unavailable'});}let t;try{t=await r.json()}catch(error){report('supabase context parse',error,{status:r.status});return json(res,502,{error:'Journey context unavailable'});}context={name:t.name,description:t.description,startDate:t.start_date,endDate:t.end_date,budget:t.budget,stops:(t.trip_stops||[]).map(s=>({city:s.city?.name,country:s.city?.country,startDate:s.start_date,endDate:s.end_date,activities:(s.trip_activities||[]).map(a=>({name:a.activity?.name,category:a.activity?.category,date:a.scheduled_date,time:a.scheduled_time,cost:Number(a.custom_cost??a.activity?.cost??0)}))}))};}
    const prompt=`You are GlobeTrotter AI. Be concise and practical. Use supplied itinerary facts when present, distinguish facts from suggestions, and never claim live data, bookings, or mutations. Context: ${JSON.stringify(context)}`;
    const contents=[{role:'user',parts:[{text:prompt}]},...messages.map(m=>({role:m.role==='assistant'?'model':'user',parts:[{text:m.content}]}))];
    let r;try{r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(gemini)}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents,generationConfig:{temperature:.35,maxOutputTokens:600}})})}catch(error){report('gemini request',error);return json(res,502,{error:'AI service temporarily unavailable'});}
    if(!r.ok){console.error('[AI] gemini response',{status:r.status});return json(res,r.status===429?429:502,{error:r.status===429?'The travel assistant is busy right now. Please try again.':r.status===401||r.status===403?'Travel assistant configuration error':'AI service temporarily unavailable'});}
    let data;try{data=await r.json()}catch(error){report('gemini response parse',error,{status:r.status});return json(res,502,{error:'AI service temporarily unavailable'});}const text=data.candidates?.[0]?.content?.parts?.map(p=>p.text).join('').trim();if(!text){console.error('[AI] empty gemini response',{status:r.status});return json(res,502,{error:'AI service temporarily unavailable'});}return json(res,200,{text,answer:text});
  }catch(error){report('handler',error);return json(res,500,{error:'Travel assistant unavailable'});}
}

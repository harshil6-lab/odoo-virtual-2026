import {defineConfig,loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
import travelHandler from './api/ai/travel.js'

function aiDevProxy(env){return {name:'ai-dev-proxy',configureServer(server){Object.assign(process.env,{SUPABASE_URL:env.SUPABASE_URL,SUPABASE_ANON_KEY:env.SUPABASE_ANON_KEY,GEMINI_API_KEY:env.GEMINI_API_KEY,GEMINI_MODEL:env.GEMINI_MODEL});server.middlewares.use('/api/ai/travel',(req,res,next)=>{if(req.method!=='POST')return next();let raw='';req.on('data',chunk=>{raw+=chunk});req.on('end',async()=>{try{req.body=raw?JSON.parse(raw):{};const out={statusCode:200,headers:{},status(code){out.statusCode=code;return out},json(body){res.statusCode=out.statusCode;Object.entries(out.headers).forEach(([k,v])=>res.setHeader(k,v));res.setHeader('Content-Type','application/json');res.end(JSON.stringify(body))}};await travelHandler(req,out)}catch{res.statusCode=500;res.end(JSON.stringify({error:'Travel assistant unavailable'}))}})})}}}
export default defineConfig(({mode})=>{const env=loadEnv(mode,process.cwd(),'');return {plugins:[react(),aiDevProxy(env)]}})

import { differenceInCalendarDays, format, parseISO } from 'date-fns'
export const money=(v=0)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(Number(v)||0)
export const niceDate=v=>v?format(parseISO(v),'MMM d, yyyy'):'TBD'
export const dateRange=(a,b)=>a&&b?`${niceDate(a)} – ${niceDate(b)}`:'Dates not set'
export const tripDays=t=>t.start_date&&t.end_date?Math.max(1,differenceInCalendarDays(parseISO(t.end_date),parseISO(t.start_date))+1):1
export const uid=()=>crypto.randomUUID?.()||`${Date.now()}-${Math.random()}`
export const getInitials=name=>(name||'Traveler').split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase()

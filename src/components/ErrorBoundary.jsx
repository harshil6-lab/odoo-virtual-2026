import {Component} from 'react';
import {Link} from 'react-router-dom';
import {AlertCircle,RefreshCw} from 'lucide-react';

export default class ErrorBoundary extends Component{
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  componentDidCatch(error,info){console.error('Application render error',{message:error?.message,componentStack:info?.componentStack});}
  render(){if(!this.state.failed)return this.props.children;return <main className="min-h-screen grid place-items-center bg-canvas px-6"><div className="max-w-md text-center"><AlertCircle className="mx-auto text-accent" size={40}/><h1 className="text-3xl font-extrabold mt-5">Something went wrong</h1><p className="text-black/55 mt-3">We couldn't load this part of your journey.</p><div className="flex justify-center gap-3 mt-7"><button className="btn-primary" onClick={()=>window.location.reload()}><RefreshCw size={16}/>Try again</button><Link className="btn-secondary" to="/app/dashboard">Go to dashboard</Link></div></div></main>}
}

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center font-sans">
      <div className="relative flex justify-center items-center w-20 h-20 mb-6">
        <div className="absolute w-full h-full border-4 border-slate-100 dark:border-slate-800 rounded-full"></div>
        <div className="absolute w-full h-full border-4 border-indigo-600 dark:border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <svg className="w-8 h-8 text-indigo-500 absolute animate-pulse" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m14 2-4 4-4-4"/><path d="M10 2v14"/><path d="M4 22h12a2 2 0 0 0 2-2V8l-6-6H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z"/></svg>
      </div>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
        Loading Resources
      </h2>
      <p className="text-slate-500 dark:text-slate-400 font-medium">
        Fetching the latest data from Supabase...
      </p>
    </div>
  );
}

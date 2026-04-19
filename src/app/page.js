import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// Disable caching to always fetch the latest notes and subjects
export const revalidate = 0;

export default async function Home() {
  // Fetch notes from Supabase
  const { data: notes, error } = await supabase.from('notes').select('*');

  if (error) {
    console.error('Error fetching notes:', error.message);
  }

  // Group notes by subject
  const subjectsMap = (notes || []).reduce((acc, note) => {
    if (!acc[note.subject]) {
      acc[note.subject] = { name: note.subject, count: 0 };
    }
    acc[note.subject].count += 1;
    return acc;
  }, {});

  // Convert the map to an array and sort alphabetically by subject name
  const subjectCards = Object.values(subjectsMap).sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-indigo-500/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 dark:from-indigo-950/20 dark:via-slate-900 dark:to-purple-950/20"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-24 sm:py-32 lg:px-8 flex flex-col items-center text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-8 border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
            <span className="flex w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 mr-2 animate-pulse"></span>
            Your Student Note Sharing Portal
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 mb-6 drop-shadow-sm">
            Discover & Share <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Knowledge</span>
          </h1>
          <p className="max-w-2xl text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
            Explore a curated collection of study notes across multiple subjects. 
            Elevate your learning experience today.
          </p>
          <Link 
            href="/upload"
            className="inline-flex items-center px-8 py-4 text-base font-bold rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            <svg className="w-5 h-5 mr-2.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            Upload your Note
          </Link>
        </div>
      </div>

      {/* Grid Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 sm:py-24 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Browse by Subject
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Select a subject to view available academic resources.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50 flex items-center gap-4 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-circle flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            <div>
              <h3 className="font-semibold">Failed to load subjects</h3>
              <p className="text-sm opacity-90 mt-1">Make sure you have configured your Supabase environment variables and run the setup SQL script.</p>
            </div>
          </div>
        )}

        {!error && subjectCards.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white/50 dark:bg-slate-900/50">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m3 15 2 2 4-4"/></svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No subjects found</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">There are currently no notes uploaded. The subjects will appear here automatically once notes are added.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {subjectCards.map((subject) => (
              <div 
                key={subject.name} 
                className="group relative flex flex-col justify-between bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] hover:shadow-xl dark:shadow-none transition-all duration-300 border border-slate-200 dark:border-slate-800 hover:-translate-y-1.5 overflow-hidden"
              >
                {/* Decorative background element */}
                <div className="absolute -right-12 -top-12 w-40 h-40 bg-indigo-50 dark:bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 transition-all duration-700 pointer-events-none"></div>
                
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-slate-800 dark:to-slate-700 text-indigo-600 dark:text-indigo-400 mb-6 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {subject.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="flex w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                      {subject.count} {subject.count === 1 ? 'note' : 'notes'} available
                    </p>
                  </div>
                </div>
                
                <div className="mt-10 relative z-10">
                  <Link 
                    href={`/subject/${encodeURIComponent(subject.name)}`}
                    className="inline-flex items-center justify-between w-full px-5 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 rounded-xl transition-all duration-300 shadow-sm group-hover:shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                  >
                    <span>Browse Notes</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

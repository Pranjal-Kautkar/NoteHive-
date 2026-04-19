import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// Disable caching to ensure we get fresh notes
export const revalidate = 0;

export default async function SubjectPage({ params }) {
  // Await the params object in Next.js 15+
  const resolvedParams = await params;
  const decodedSubject = decodeURIComponent(resolvedParams.subject);

  // Fetch notes for this subject from Supabase
  const { data: notes, error } = await supabase
    .from('notes')
    .select('*')
    .eq('subject', decodedSubject)
    .order('uploaded_at', { ascending: false });

  if (error) {
    console.error('Error fetching subject notes:', error.message);
  }

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Header/Navigation */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link 
            href="/"
            className="inline-flex items-center text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mr-3 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </div>
            Back to Home
          </Link>
          <div className="flex items-center px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
            <span className="flex w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
            <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 shadow-sm">
              {decodedSubject}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 sm:py-16 relative">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none user-select-none -z-10"></div>
        <div className="absolute top-40 left-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none user-select-none -z-10"></div>

        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Notes for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">{decodedSubject}</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            Browse and download study materials uploaded for this subject. All files are curated by the community.
          </p>
        </div>

        {error && (
          <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50 flex items-center gap-4 mb-8 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-circle flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            <div>
              <h3 className="font-semibold">Failed to load notes</h3>
              <p className="text-sm opacity-90 mt-1">{error.message || 'Please check your database connection or try again later.'}</p>
            </div>
          </div>
        )}

        {!error && (!notes || notes.length === 0) ? (
          <div className="flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <div className="w-20 h-20 mb-6 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 shadow-inner flex items-center justify-center rotate-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="9" x2="15" y1="15" y2="15"/></svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No notes available</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md">There are currently no notes uploaded for {decodedSubject}. Be the first to share your knowledge with the class!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {notes?.map((note) => (
              <div 
                key={note.id} 
                className="group flex flex-col sm:flex-row gap-6 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:shadow-xl dark:shadow-none border border-slate-200 dark:border-slate-800 transition-all duration-300 relative overflow-hidden"
              >
                {/* Decoration highlight left edge */}
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-indigo-500 to-purple-500 opacity-60 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Content */}
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      <svg className="w-3.5 h-3.5 mr-1.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                      {formatDate(note.uploaded_at)}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {note.title}
                  </h3>
                  
                  <p className="text-slate-600 dark:text-slate-400 mb-6 flex-1 text-base leading-relaxed">
                    {note.description || "No description provided for this note."}
                  </p>
                </div>
                
                {/* Action */}
                <div className="flex flex-col justify-end sm:items-end pl-0 sm:pl-8 sm:border-l border-slate-100 dark:border-slate-800 mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0">
                  <a 
                    href={note.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3.5 w-full sm:w-auto text-sm font-semibold text-white bg-slate-900 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-xl transition-all duration-300 shadow-sm hover:shadow-indigo-500/25 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 group/btn"
                  >
                    <svg className="w-5 h-5 mr-2 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                    Download Note
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

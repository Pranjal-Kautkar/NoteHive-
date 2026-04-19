"use client";

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const SUBJECTS = [
  "Math",
  "Science", 
  "History", 
  "English", 
  "Computer Science"
];

export default function UploadPage() {
  const [formData, setFormData] = useState({
    subject: SUBJECTS[0],
    title: "",
    description: "",
  });
  const [file, setFile] = useState(null);
  
  // Status states
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccess(false);

    if (!file) {
      setErrorMsg("Please select a file to upload.");
      return;
    }

    if (!formData.title || !formData.subject) {
      setErrorMsg("Title and Subject are required.");
      return;
    }

    setIsUploading(true);

    try {
      // 1. Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      // Generate a unique filename using timestamp and random string to avoid collisions
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${formData.subject.replace(/\s+/g, '-')}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('notes-files')
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(`File upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('notes-files')
        .getPublicUrl(filePath);

      const fileUrl = publicUrlData.publicUrl;

      // 2. Insert into "notes" table
      const { error: insertError } = await supabase
        .from('notes')
        .insert([{
          subject: formData.subject,
          title: formData.title,
          description: formData.description,
          file_url: fileUrl
        }]);

      if (insertError) {
        throw new Error(`Database insert failed: ${insertError.message}`);
      }

      // 3. Set success state and reset form
      setSuccess(true);
      setFormData({
        subject: SUBJECTS[0],
        title: "",
        description: "",
      });
      setFile(null);
      const fileInput = document.getElementById('file-upload');
      if (fileInput) fileInput.value = '';

    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 font-sans p-6">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px]"></div>
      </div>

      <div className="w-full max-w-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden relative">
        <div className="p-8 sm:p-12">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                Share a Note
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                Upload your study materials to help others learn.
              </p>
            </div>
            <Link 
              href="/"
              className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
              title="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </Link>
          </div>

          {/* Success Message UI */}
          {success && (
            <div className="mb-8 p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900/50 flex flex-col items-center text-center animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-800/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 shadow-sm">
                <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-300 mb-2">Upload Successful!</h3>
              <p className="text-emerald-600 dark:text-emerald-400 mb-6">Your note has been securely published and is now available to others.</p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-white dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900 transition-colors"
                >
                  Upload Another
                </button>
                <Link 
                  href="/"
                  className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
                >
                  Return Home
                </Link>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && !success && (
            <div className="mb-8 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50 flex items-center gap-3 animate-in fade-in">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
              <p className="text-sm font-medium">{errorMsg}</p>
            </div>
          )}

          {/* Upload Form */}
          {!success && (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Subject Selection */}
              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Subject Category
                </label>
                <div className="relative">
                  <select 
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="appearance-none w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow transition-colors"
                  >
                    {SUBJECTS.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Document Title
                </label>
                <input 
                  type="text"
                  id="title"
                  name="title"
                  placeholder="e.g. Chapter 4: Calculus Derivatives"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
              </div>

              {/* Description Input */}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Description <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea 
                  id="description"
                  name="description"
                  rows="3"
                  placeholder="Briefly describe what this note covers..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none"
                />
              </div>

              {/* File Upload Zone */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  File Attachment
                </label>
                <div 
                  className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-2xl transition-colors ${
                    file 
                      ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10" 
                      : "border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50 dark:bg-slate-950/50"
                  }`}
                >
                  <div className="space-y-2 text-center w-full">
                    {!file ? (
                      <>
                        <svg className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-slate-600 dark:text-slate-400 justify-center">
                          <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 dark:focus-within:ring-offset-slate-900 transition-colors">
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.txt" />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                          PDF or TXT up to 10MB
                        </p>
                      </>
                    ) : (
                      <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl">
                        <div className="flex items-center truncate">
                          <svg className="w-8 h-8 text-indigo-500 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                          <span className="text-sm font-medium text-slate-900 dark:text-white truncate">
                            {file.name}
                          </span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => { setFile(null); document.getElementById('file-upload').value = ''; }}
                          className="ml-4 flex-shrink-0 text-slate-400 hover:text-red-500 transition-colors focus:outline-none bg-slate-100 dark:bg-slate-800 rounded-full p-2"
                        >
                          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isUploading}
                  className={`w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-xl text-white shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 ${
                    isUploading 
                      ? "bg-indigo-400 cursor-not-allowed" 
                      : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/25"
                  }`}
                >
                  {isUploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Publishing Note...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                      Upload & Publish Note
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </main>
  );
}


import React, { useState, useCallback } from 'react';
import { getResumeRankings } from './services/geminiService';
import { CandidateRanking } from './types';
import Header from './components/Header';
import JobDescriptionInput from './components/JobDescriptionInput';
import ResumeInput from './components/ResumeInput';
import ResultsDisplay from './components/ResultsDisplay';
import Loader from './components/Loader';
import { SparklesIcon } from './components/icons/SparklesIcon';

const App: React.FC = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [resumes, setResumes] = useState('');
  const [rankings, setRankings] = useState<CandidateRanking[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScreenResumes = useCallback(async () => {
    if (!jobDescription.trim() || !resumes.trim()) {
      setError('Please provide both a job description and at least one resume.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setRankings(null);

    try {
      const result = await getResumeRankings(jobDescription, resumes);
      setRankings(result);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? `An error occurred: ${e.message}` : 'An unknown error occurred. Please check the console.');
    } finally {
      setIsLoading(false);
    }
  }, [jobDescription, resumes]);

  return (
    <div className="min-h-screen bg-slate-100/50">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-6">
            <JobDescriptionInput value={jobDescription} onChange={setJobDescription} />
            <ResumeInput value={resumes} onChange={setResumes} />
            <button
              onClick={handleScreenResumes}
              disabled={isLoading || !jobDescription.trim() || !resumes.trim()}
              className="flex items-center justify-center w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:transform-none"
            >
              {isLoading ? (
                <Loader />
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  Screen & Rank Resumes
                </>
              )}
            </button>
             {error && <div className="mt-4 text-center text-red-600 bg-red-100 p-3 rounded-lg">{error}</div>}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:sticky lg:top-8">
            <ResultsDisplay rankings={rankings} isLoading={isLoading} />
          </div>
        </div>
      </main>
      <footer className="text-center py-6 text-sm text-slate-500">
        <p>Powered by Gemini API. Designed for efficient and fair candidate evaluation.</p>
      </footer>
    </div>
  );
};

export default App;

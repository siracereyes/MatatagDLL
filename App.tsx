import React, { useState } from 'react';
import InputForm from './components/InputForm';
import PlanDisplay from './components/PlanDisplay';
import { generateLessonPlan } from './services/geminiService';
import { FormData, LessonPlanData } from './types';
import { Sparkles, ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  const [lessonPlan, setLessonPlan] = useState<LessonPlanData | null>(null);
  const [lastRequestData, setLastRequestData] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const plan = await generateLessonPlan(data);
      setLessonPlan(plan);
      setLastRequestData(data);
    } catch (err: any) {
      setError("Failed to generate lesson plan. Please check your API key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setLessonPlan(null);
    setLastRequestData(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">PlanGen AI</h1>
                <p className="text-xs text-gray-500 font-medium">Matatag Lesson Planner</p>
              </div>
            </div>
            {lessonPlan && (
              <div className="flex items-center">
                 <button 
                  onClick={handleReset}
                  className="text-gray-500 hover:text-blue-600 font-medium text-sm flex items-center gap-1 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
                 >
                   <ArrowLeft className="w-4 h-4" />
                   Create New Plan
                 </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {!lessonPlan ? (
          <div className="max-w-2xl mx-auto">
             <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Design Your Class</h2>
                <p className="text-gray-600">Enter your class details below to generate a comprehensive and structured lesson plan for any subject.</p>
             </div>
            <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        ) : (
          <div className="animate-fade-in-up">
            <PlanDisplay plan={lessonPlan} requestData={lastRequestData!} />
          </div>
        )}
      </main>
      
      <footer className="text-center text-gray-400 text-sm py-8 no-print flex flex-col items-center gap-3">
         <p>© 2025 AI Lesson Planner CJMR</p>
         <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
            <img 
              src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fmatatag-planner-cjmr-generic.vercel.app&count_bg=%232563EB&title_bg=%231F2937&icon=googleclassroom.svg&icon_color=%23E7E7E7&title=Educators&edge_flat=false" 
              alt="Visitor Count"
              className="h-6"
            />
         </div>
      </footer>
    </div>
  );
};

export default App;
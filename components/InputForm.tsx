import React, { useState, useRef } from 'react';
import { FormData } from '../types';
import { extractStandards } from '../services/geminiService';
import { Calendar, BookOpen, Layers, Users, AlertCircle, PenTool, Upload, FileText, CheckCircle, Loader2 } from 'lucide-react';

interface InputFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<FormData>({
    school: '',
    teacher: '',
    teacherPosition: '',
    subject: '',
    gradeLevel: '',
    quarter: '',
    dates: '',
    contentStandard: '',
    performanceStandard: '',
    learningCompetency: '',
    dailyTopics: {
      day1: '',
      day2: '',
      day3: '',
      day4: '',
      day5: ''
    },
    specificNeeds: '',
    checkerName: '',
    checkerPosition: '',
    approverName: '',
    approverPosition: '',
    noterName: '',
    noterPosition: '',
    exemplarFile: null
  });

  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTopicChange = (day: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      dailyTopics: {
        ...prev.dailyTopics,
        [day]: value
      }
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Strip the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64Data = base64String.split(',')[1];
        
        setFormData(prev => ({
          ...prev,
          exemplarFile: {
            data: base64Data,
            mimeType: file.type
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExtractStandards = async () => {
    if (!formData.exemplarFile) return;
    
    setIsExtracting(true);
    try {
      const extracted = await extractStandards(formData.exemplarFile);
      setFormData(prev => ({
        ...prev,
        contentStandard: extracted.contentStandard || prev.contentStandard,
        performanceStandard: extracted.performanceStandard || prev.performanceStandard,
        learningCompetency: extracted.learningCompetency || prev.learningCompetency
      }));
    } catch (error) {
      alert("Failed to extract standards. Please check the file or try again.");
    } finally {
      setIsExtracting(false);
    }
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, exemplarFile: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6">
        <h2 className="text-white text-xl font-bold flex items-center gap-2">
          <Layers className="w-6 h-6" />
          5-Day MATATAG DLL
        </h2>
        <p className="text-blue-100 text-sm mt-1 opacity-90">
          Enter standards and daily topics to generate your weekly log.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        
        {/* Section 0: Upload Exemplar */}
        <div className="space-y-4">
          <h3 className="text-gray-800 font-bold border-b pb-2 flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-600" /> Upload Lesson Exemplar (Optional)
          </h3>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-3">
              Upload a Lesson Exemplar (Image or PDF) to automatically extract standards and use it as a reference for the lesson plan style.
            </p>
            
            {!formData.exemplarFile ? (
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, application/pdf"
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-100 file:text-blue-700
                    hover:file:bg-blue-200"
                />
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center gap-2 text-green-700 font-medium bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                   <FileText className="w-4 h-4" />
                   File Attached
                   <button type="button" onClick={removeFile} className="ml-2 text-gray-400 hover:text-red-500 text-xs uppercase font-bold">✕</button>
                </div>
                
                <button
                  type="button"
                  onClick={handleExtractStandards}
                  disabled={isExtracting}
                  className={`text-sm px-4 py-1.5 rounded-full flex items-center gap-2 transition-colors ${
                    isExtracting 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {isExtracting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Extracting...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-4 h-4" /> Auto-fill Standards
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Section 1: Basic Info */}
        <div className="space-y-4">
          <h3 className="text-gray-800 font-bold border-b pb-2 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" /> General Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">School</label>
              <input type="text" name="school" required value={formData.school} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors" placeholder="e.g. Ramon Magsaysay High School" />
            </div>
             <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Name of Teacher</label>
              <input type="text" name="teacher" required value={formData.teacher} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors" placeholder="e.g. Juan A. Dela Cruz" />
            </div>
             <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Teacher's Position</label>
              <input type="text" name="teacherPosition" value={formData.teacherPosition} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors" placeholder="e.g. Teacher I, Master Teacher II" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Learning Area / Subject</label>
              <input type="text" name="subject" required value={formData.subject} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors" placeholder="e.g. TLE, Science" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Grade Level</label>
              <input type="text" name="gradeLevel" required value={formData.gradeLevel} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors" placeholder="e.g. Grade 8" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Quarter</label>
              <input type="text" name="quarter" required value={formData.quarter} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors" placeholder="e.g. Third Quarter" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Teaching Dates and Time</label>
              <input type="text" name="dates" required value={formData.dates} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors" placeholder="e.g. December 1 - 5, 2025" />
            </div>
          </div>
        </div>

        {/* Section 2: Standards */}
        <div className="space-y-4">
          <h3 className="text-gray-800 font-bold border-b pb-2 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" /> Standards & Competencies
          </h3>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex justify-between">
                A. Content Standards
                {formData.contentStandard && formData.exemplarFile && <CheckCircle className="w-4 h-4 text-green-600" />}
              </label>
              <textarea name="contentStandard" required rows={3} value={formData.contentStandard} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors" placeholder="The learners demonstrate understanding of..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex justify-between">
                B. Performance Standards
                {formData.performanceStandard && formData.exemplarFile && <CheckCircle className="w-4 h-4 text-green-600" />}
              </label>
              <textarea name="performanceStandard" required rows={3} value={formData.performanceStandard} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors" placeholder="The learners shall be able to..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex justify-between">
                C. Learning Competency/ies
                {formData.learningCompetency && formData.exemplarFile && <CheckCircle className="w-4 h-4 text-green-600" />}
              </label>
              <textarea name="learningCompetency" required rows={3} value={formData.learningCompetency} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors" placeholder="e.g. Explain how different factors affect..." />
            </div>
          </div>
        </div>

        {/* Section 3: Daily Topics */}
        <div className="space-y-4">
          <h3 className="text-gray-800 font-bold border-b pb-2 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" /> Daily Lesson Plan (Topics)
          </h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((day) => (
              <div key={day} className="flex items-center gap-4">
                <span className="w-16 font-bold text-gray-500 uppercase text-xs">Day {day}</span>
                <input
                  type="text"
                  required
                  value={(formData.dailyTopics as any)[`day${day}`]}
                  onChange={(e) => handleTopicChange(`day${day}`, e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder={`Topic for Day ${day}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Context */}
        <div className="space-y-4">
          <h3 className="text-gray-800 font-bold border-b pb-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600" /> Additional Context
          </h3>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Specific Needs / Remarks</label>
            <textarea name="specificNeeds" rows={2} value={formData.specificNeeds} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors" placeholder="e.g. Focus on group work, visual aids required..." />
          </div>
        </div>

        {/* Section 5: Signatories */}
        <div className="space-y-4">
          <h3 className="text-gray-800 font-bold border-b pb-2 flex items-center gap-2">
            <PenTool className="w-5 h-5 text-blue-600" /> Signatories (Optional)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="col-span-1 md:col-span-2 text-xs text-gray-500 italic mb-2">
              Leave these blank if you do not want them to appear on the printed lesson plan.
            </div>
            
            {/* Checker */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Checked by</label>
              <input type="text" name="checkerName" value={formData.checkerName} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors" placeholder="e.g. Jerson Castillo" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Position</label>
              <input type="text" name="checkerPosition" value={formData.checkerPosition} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors" placeholder="e.g. Master Teacher I" />
            </div>

            {/* Noter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Noted by</label>
              <input type="text" name="noterName" value={formData.noterName} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors" placeholder="e.g. Michael Armentia" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Position</label>
              <input type="text" name="noterPosition" value={formData.noterPosition} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors" placeholder="e.g. Head Teacher VI" />
            </div>

             {/* Approver */}
             <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Approved by</label>
              <input type="text" name="approverName" value={formData.approverName} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors" placeholder="e.g. Jessie Matriano" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Position</label>
              <input type="text" name="approverPosition" value={formData.approverPosition} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors" placeholder="e.g. Principal IV" />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 px-6 rounded-lg text-white font-semibold text-lg shadow-lg transform transition-all 
              ${isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-700 hover:bg-blue-800 hover:scale-[1.01] active:scale-[0.99]'
              }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin h-5 w-5" />
                Generating 5-Day DLL...
              </span>
            ) : (
              'Generate Weekly Lesson Log'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// Helper icon
const SparklesIcon = ({ className }: { className: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 3.214L13 21l-2.286-6.857L5 12l5.714-3.214z" />
  </svg>
);

export default InputForm;
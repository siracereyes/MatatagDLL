import React, { useState } from 'react';
import { FormData } from '../types';
import { Calendar, BookOpen, Layers, Users, AlertCircle, PenTool } from 'lucide-react';

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
    noterPosition: ''
  });

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
              <label className="text-sm font-semibold text-gray-700">A. Content Standards</label>
              <textarea name="contentStandard" required rows={3} value={formData.contentStandard} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors" placeholder="The learners demonstrate understanding of..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">B. Performance Standards</label>
              <textarea name="performanceStandard" required rows={3} value={formData.performanceStandard} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors" placeholder="The learners shall be able to..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">C. Learning Competency/ies</label>
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
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
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

export default InputForm;
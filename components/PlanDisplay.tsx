import React from 'react';
import { LessonPlanData } from '../types';
import { FileDown, FileText } from 'lucide-react';

interface PlanDisplayProps {
  plan: LessonPlanData;
  requestData: any; 
}

const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan }) => {
  const handleSavePDF = () => {
    // Force focus and add a small delay to ensure the browser is ready for the print dialog
    window.focus();
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const handleExportWord = () => {
    const element = document.getElementById('lesson-plan-content');
    if (!element) return;

    // We need to inject styles because Word doesn't load external stylesheets or understand Tailwind classes automatically.
    // We map the tailwind classes used in the table to standard CSS.
    const css = `
      <style>
        @page { size: landscape; margin: 1cm; }
        body { font-family: 'Arial', sans-serif; color: #000; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        td, th { border: 1px solid black; padding: 5px; vertical-align: top; }
        
        /* Utility Class Mappings for Word */
        .border-black { border-color: black !important; }
        .bg-gray-100 { background-color: #f3f4f6 !important; }
        .bg-gray-50 { background-color: #f9fafb !important; }
        .bg-yellow-100 { background-color: #fef9c3 !important; }
        .bg-gray-200 { background-color: #e5e7eb !important; }
        
        .font-bold { font-weight: bold; }
        .font-semibold { font-weight: 600; }
        .text-center { text-align: center; }
        .text-sm { font-size: 10pt; }
        .text-xs { font-size: 9pt; }
        .uppercase { text-transform: uppercase; }
        .italic { font-style: italic; }
        .underline { text-decoration: underline; }
        
        /* Layout fixes for Word */
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .grid { display: table; width: 100%; }
        .grid-cols-3 { display: table-row; }
        .grid-cols-3 > div { display: table-cell; width: 33%; padding: 10px; }
        
        /* Header Grid Simulation */
        .grid-cols-\[30\%_15\%_25\%_15\%_15\%\] { display: table-row; }
      </style>
    `;

    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${plan.meta.subject} Lesson Plan</title>
        ${css}
      </head>
      <body>
    `;

    const footer = "</body></html>";
    const htmlContent = header + element.innerHTML + footer;

    const blob = new Blob(['\ufeff', htmlContent], {
      type: 'application/msword'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Lesson_Plan_${plan.meta.subject}_Week_${plan.meta.dates}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 print:space-y-0">
      <div className="flex justify-between items-center no-print relative z-10">
        <h2 className="text-2xl font-bold text-gray-800">Generated Daily Lesson Log</h2>
        <div className="flex gap-3">
          <button 
            type="button"
            onClick={handleExportWord}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium"
          >
            <FileText className="w-4 h-4" />
            Export to Word
          </button>
          <button 
            type="button"
            onClick={handleSavePDF}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm font-medium"
          >
            <FileDown className="w-4 h-4" />
            Save as PDF
          </button>
        </div>
      </div>

      <div id="lesson-plan-content" className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 print:shadow-none print:border-none print:w-full print:rounded-none">
        
        {/* Header Table - Metadata */}
        <div className="p-4 print:p-0 print:mb-4">
          <div className="border-2 border-black">
            <div className="grid grid-cols-[30%_15%_25%_15%_15%]">
              
              {/* Row 1: Title + School + Grade */}
              <div className="row-span-2 flex flex-col justify-center items-center border-r border-b border-black p-2 bg-gray-100 print:bg-transparent">
                 <div className="font-bold text-center">Revised K to 10 Curriculum</div>
                 <div className="font-bold text-center">Weekly Lesson Log</div>
              </div>
              
              <div className="border-r border-b border-black p-1 pl-2 text-sm font-bold bg-gray-50 print:bg-transparent flex items-center">School</div>
              <div className="border-r border-b border-black p-1 pl-2 text-sm uppercase flex items-center justify-center font-semibold">{plan.meta.school}</div>
              
              <div className="border-r border-b border-black p-1 pl-2 text-sm font-bold bg-gray-50 print:bg-transparent flex items-center">Grade Level</div>
              <div className="border-b border-black p-1 pl-2 text-sm flex items-center justify-center font-semibold">{plan.meta.gradeLevel}</div>
              
              {/* Row 2: Teacher + Learning Area */}
              <div className="border-r border-b border-black p-1 pl-2 text-sm font-bold bg-gray-50 print:bg-transparent flex items-center">Name of Teacher</div>
              <div className="border-r border-b border-black p-1 pl-2 text-sm uppercase flex items-center justify-center font-semibold">{plan.meta.teacher}</div>
              
              <div className="border-r border-b border-black p-1 pl-2 text-sm font-bold bg-gray-50 print:bg-transparent flex items-center">Learning Area</div>
              <div className="border-b border-black p-1 pl-2 text-sm uppercase flex items-center justify-center font-semibold">{plan.meta.subject}</div>

              {/* Row 3: Dates + Quarter */}
              <div className="border-r border-black p-1 pl-2 text-sm font-bold bg-gray-50 print:bg-transparent flex items-center justify-center">Teaching Dates and Time</div>
              
              <div className="col-span-2 border-r border-black p-1 pl-2 text-sm flex items-center justify-center font-semibold underline decoration-solid underline-offset-4">
                 {plan.meta.dates}
              </div>
              
              <div className="border-r border-black p-1 pl-2 text-sm font-bold bg-gray-50 print:bg-transparent flex items-center">Quarter</div>
              <div className="p-1 pl-2 text-sm uppercase flex items-center justify-center font-semibold">{plan.meta.quarter}</div>
            </div>
          </div>
        </div>

        {/* Content Table - Using HTML Table for Better Print Page Breaks */}
        <div className="p-4 pt-0 print:p-0">
          <table className="w-full border-collapse border border-black text-sm print:text-xs">
            <thead>
              <tr className="bg-gray-100 print:bg-transparent">
                <th className="border border-black p-2 w-32 print:w-24 text-center font-bold uppercase tracking-wider">Section</th>
                {[1, 2, 3, 4, 5].map(d => (
                  <th key={d} className="border border-black p-2 text-center font-bold uppercase w-[16%]">Day {d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              
              {/* I. CURRICULUM CONTENT */}
              <tr className="bg-yellow-100 print:bg-yellow-100">
                <td colSpan={6} className="border border-black p-1 font-bold pl-2 uppercase">
                  I. CURRICULUM CONTENT, STANDARDS, AND LESSON COMPETENCIES
                </td>
              </tr>

              {/* A. Content Standards */}
              <tr>
                <td colSpan={6} className="border border-black p-0">
                  <div className="p-2 font-bold bg-gray-50 print:bg-transparent border-b border-dashed border-gray-300">A. Content Standards</div>
                  <div className="p-2">{plan.standards.contentStandard}</div>
                </td>
              </tr>

              {/* B. Performance Standards */}
              <tr>
                <td colSpan={6} className="border border-black p-0">
                  <div className="p-2 font-bold bg-gray-50 print:bg-transparent border-b border-dashed border-gray-300">B. Performance Standards</div>
                  <div className="p-2">{plan.standards.performanceStandard}</div>
                </td>
              </tr>

              {/* C. Learning Competency */}
              <tr>
                <td colSpan={6} className="border border-black p-0">
                  <div className="p-2 font-bold bg-gray-50 print:bg-transparent border-b border-dashed border-gray-300">C. Learning Competency</div>
                  <div className="p-2 whitespace-pre-line">{plan.standards.learningCompetency}</div>
                </td>
              </tr>

              {/* D. Learning Objectives */}
              <tr>
                <td className="border border-black p-2 font-bold bg-gray-50 print:bg-transparent align-top">D. Learning Objectives</td>
                {plan.days.map((day, i) => (
                  <td key={i} className="border border-black p-2 align-top">
                    <ul className="list-disc list-outside ml-4 space-y-1">
                      {day.objectives.map((obj, idx) => <li key={idx}>{obj}</li>)}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* E. IDF Features */}
              <tr>
                <td className="border border-black p-2 font-bold bg-gray-50 print:bg-transparent align-top">E. Instructional Design framework (IDF) features</td>
                {plan.days.map((day, i) => (
                  <td key={i} className="border border-black p-2 align-top">
                    {day.idfFeatures}
                  </td>
                ))}
              </tr>

              {/* F. 21st Century Skills */}
              <tr>
                <td className="border border-black p-2 font-bold bg-gray-50 print:bg-transparent align-top">F. 21st Century Skills</td>
                {plan.days.map((day, i) => (
                  <td key={i} className="border border-black p-2 align-top">
                    {day.skills21st}
                  </td>
                ))}
              </tr>

              {/* II. CONTENT */}
              <tr className="bg-yellow-100 print:bg-yellow-100">
                <td colSpan={6} className="border border-black p-1 font-bold pl-2 uppercase">
                  II. CONTENT
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-bold bg-gray-50 print:bg-transparent align-top">Subject Matter / Topic</td>
                {plan.days.map((day, i) => (
                  <td key={i} className="border border-black p-2 align-top font-semibold">
                    {day.topic}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border border-black p-2 font-bold bg-gray-50 print:bg-transparent align-top">A. References</td>
                {plan.days.map((day, i) => (
                  <td key={i} className="border border-black p-2 align-top text-xs italic">
                    {day.resources.references}
                  </td>
                ))}
              </tr>
               <tr>
                <td className="border border-black p-2 font-bold bg-gray-50 print:bg-transparent align-top">B. Other Learning Resources</td>
                {plan.days.map((day, i) => (
                  <td key={i} className="border border-black p-2 align-top text-xs italic">
                    {day.resources.otherResources}
                  </td>
                ))}
              </tr>

              {/* IV. TEACHING PROCEDURES */}
              <tr className="bg-yellow-100 print:bg-yellow-100">
                <td colSpan={6} className="border border-black p-1 font-bold pl-2 uppercase">
                  IV. TEACHING AND LEARNING PROCEDURES
                </td>
              </tr>

              {/* Before/Pre-Lesson */}
              <tr className="bg-gray-200 print:bg-gray-100">
                <td colSpan={6} className="border border-black p-1 font-bold pl-2 text-center text-xs uppercase">
                  Before/Pre-Lesson Proper
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-semibold bg-gray-50 print:bg-transparent align-top text-xs">Activating Prior Knowledge</td>
                {plan.days.map((day, i) => (
                  <td key={i} className="border border-black p-2 align-top">
                    {day.procedures.activatingPriorKnowledge}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border border-black p-2 font-semibold bg-gray-50 print:bg-transparent align-top text-xs">Lesson Purpose/Intention</td>
                {plan.days.map((day, i) => (
                  <td key={i} className="border border-black p-2 align-top">
                    {day.procedures.lessonPurpose}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border border-black p-2 font-semibold bg-gray-50 print:bg-transparent align-top text-xs">Lesson Language Practice</td>
                {plan.days.map((day, i) => (
                  <td key={i} className="border border-black p-2 align-top">
                    {day.procedures.lessonLanguagePractice}
                  </td>
                ))}
              </tr>

              {/* Lesson Proper */}
              <tr className="bg-gray-200 print:bg-gray-100">
                <td colSpan={6} className="border border-black p-1 font-bold pl-2 text-center text-xs uppercase">
                  Lesson Proper
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-semibold bg-gray-50 print:bg-transparent align-top text-xs">Reading the Key Idea/Stem</td>
                {plan.days.map((day, i) => (
                  <td key={i} className="border border-black p-2 align-top">
                    {day.procedures.readingKeyIdea}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border border-black p-2 font-semibold bg-gray-50 print:bg-transparent align-top text-xs">Developing Understanding</td>
                {plan.days.map((day, i) => (
                  <td key={i} className="border border-black p-2 align-top">
                    {day.procedures.developingUnderstanding}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border border-black p-2 font-semibold bg-gray-50 print:bg-transparent align-top text-xs">Deepening Understanding</td>
                {plan.days.map((day, i) => (
                  <td key={i} className="border border-black p-2 align-top">
                    {day.procedures.deepeningUnderstanding}
                  </td>
                ))}
              </tr>

              {/* After/Post-Lesson */}
              <tr className="bg-gray-200 print:bg-gray-100">
                <td colSpan={6} className="border border-black p-1 font-bold pl-2 text-center text-xs uppercase">
                  After/Post-Lesson Proper
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-semibold bg-gray-50 print:bg-transparent align-top text-xs">Making Generalizations</td>
                {plan.days.map((day, i) => (
                  <td key={i} className="border border-black p-2 align-top">
                    {day.procedures.makingGeneralizations}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border border-black p-2 font-semibold bg-gray-50 print:bg-transparent align-top text-xs">Evaluating Learning</td>
                {plan.days.map((day, i) => (
                  <td key={i} className="border border-black p-2 align-top">
                    {day.procedures.evaluatingLearning}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border border-black p-2 font-semibold bg-gray-50 print:bg-transparent align-top text-xs">Additional Activities</td>
                {plan.days.map((day, i) => (
                  <td key={i} className="border border-black p-2 align-top">
                    {day.procedures.additionalActivities}
                  </td>
                ))}
              </tr>

              {/* Remarks & Reflection */}
              <tr>
                <td className="border border-black p-2 font-bold bg-gray-50 print:bg-transparent uppercase">Remarks</td>
                {plan.days.map((day, i) => (
                  <td key={i} className="border border-black p-2 align-top">
                    {day.remarks || "No remarks"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border border-black p-2 font-bold bg-gray-50 print:bg-transparent uppercase">Reflection</td>
                {plan.days.map((day, i) => (
                  <td key={i} className="border border-black p-2 align-top">
                    {day.reflection || "No reflection"}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Signatories Footer - Kept outside table for flex layout */}
        <div className="p-12 print:p-8 break-inside-avoid print-break-inside-avoid">
            {/* Top Row: Submitted, Checked, Noted */}
            <div className="grid grid-cols-3 gap-8">
              {/* Column 1: Submitted By */}
              <div className="flex flex-col">
                <div className="font-bold text-sm mb-6">Submitted by:</div>
                <div className="font-bold uppercase text-base">{plan.meta.teacher}</div>
                <div className="text-sm border-t border-black inline-block mt-1 pt-1 pr-12 min-w-[200px]">
                  {plan.meta.teacherPosition || "Teacher"}
                </div>
              </div>

              {/* Column 2: Checked By */}
              {plan.meta.checkerName ? (
                <div className="flex flex-col">
                  <div className="font-bold text-sm mb-6">Checked by:</div>
                  <div className="font-bold uppercase text-base">{plan.meta.checkerName}</div>
                  <div className="text-sm border-t border-black inline-block mt-1 pt-1 pr-12 min-w-[200px]">
                    {plan.meta.checkerPosition}
                  </div>
                </div>
              ) : (
                <div />
              )}

              {/* Column 3: Noted By (Priority over Approved in this slot) */}
              {plan.meta.noterName ? (
                  <div className="flex flex-col">
                    <div className="font-bold text-sm mb-6">Noted by:</div>
                    <div className="font-bold uppercase text-base">{plan.meta.noterName}</div>
                    <div className="text-sm border-t border-black inline-block mt-1 pt-1 pr-12 min-w-[200px]">
                      {plan.meta.noterPosition}
                    </div>
                  </div>
              ) : plan.meta.approverName ? (
                  <div className="flex flex-col">
                    <div className="font-bold text-sm mb-6">Approved by:</div>
                    <div className="font-bold uppercase text-base">{plan.meta.approverName}</div>
                    <div className="text-sm border-t border-black inline-block mt-1 pt-1 pr-12 min-w-[200px]">
                      {plan.meta.approverPosition}
                    </div>
                  </div>
              ) : (
                <div />
              )}
            </div>

             {/* Bottom Row: Approved By (Centered) - ONLY if Noted exists AND Approved exists */}
             {plan.meta.noterName && plan.meta.approverName && (
                <div className="mt-12 flex justify-center">
                  <div className="flex flex-col">
                    <div className="font-bold text-sm mb-6">Approved by:</div>
                    <div className="font-bold uppercase text-base">{plan.meta.approverName}</div>
                    <div className="text-sm border-t border-black inline-block mt-1 pt-1 pr-12 min-w-[200px]">
                      {plan.meta.approverPosition}
                    </div>
                  </div>
                </div>
             )}
        </div>

      </div>
    </div>
  );
};

export default PlanDisplay;
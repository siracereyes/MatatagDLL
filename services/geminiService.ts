import { GoogleGenAI, Type } from "@google/genai";
import { FormData, LessonPlanData } from "../types";

const apiKey = process.env.API_KEY || '';

// Define schema for a single day's plan
const dailyPlanSchema = {
  type: Type.OBJECT,
  properties: {
    dayNumber: { type: Type.NUMBER },
    topic: { type: Type.STRING },
    objectives: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Learning objectives for this day"
    },
    idfFeatures: { type: Type.STRING, description: "Instructional Design framework (IDF) features applicable for this day" },
    skills21st: { type: Type.STRING, description: "21st Century Skills targeted" },
    resources: {
      type: Type.OBJECT,
      properties: {
        references: { type: Type.STRING },
        otherResources: { type: Type.STRING }
      },
      required: ["references", "otherResources"]
    },
    procedures: {
      type: Type.OBJECT,
      properties: {
        // Before/Pre-Lesson
        activatingPriorKnowledge: { type: Type.STRING },
        lessonPurpose: { type: Type.STRING },
        lessonLanguagePractice: { type: Type.STRING },
        
        // Lesson Proper
        readingKeyIdea: { type: Type.STRING },
        developingUnderstanding: { type: Type.STRING },
        deepeningUnderstanding: { type: Type.STRING },
        
        // After/Post-Lesson
        makingGeneralizations: { type: Type.STRING },
        evaluatingLearning: { type: Type.STRING },
        additionalActivities: { type: Type.STRING }
      },
      required: [
        "activatingPriorKnowledge", "lessonPurpose", "lessonLanguagePractice",
        "readingKeyIdea", "developingUnderstanding", "deepeningUnderstanding",
        "makingGeneralizations", "evaluatingLearning", "additionalActivities"
      ]
    },
    remarks: { type: Type.STRING },
    reflection: { type: Type.STRING }
  },
  required: ["dayNumber", "topic", "objectives", "idfFeatures", "skills21st", "resources", "procedures", "remarks", "reflection"]
};

// Define the root response schema
const dllSchema = {
  type: Type.OBJECT,
  properties: {
    days: {
      type: Type.ARRAY,
      items: dailyPlanSchema
    }
  },
  required: ["days"]
};

export const generateLessonPlan = async (data: FormData): Promise<LessonPlanData> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Create a 5-Day Daily Lesson Log (DLL) strictly following the specified structure.
    
    Context:
    - Subject: ${data.subject}
    - Grade Level: ${data.gradeLevel}
    - Week/Dates: ${data.dates}
    - Quarter: ${data.quarter}

    Standards (Fixed for the week):
    - Content Standards: ${data.contentStandard}
    - Performance Standards: ${data.performanceStandard}
    - Learning Competencies: ${data.learningCompetency}

    Daily Topics:
    - Day 1: ${data.dailyTopics.day1}
    - Day 2: ${data.dailyTopics.day2}
    - Day 3: ${data.dailyTopics.day3}
    - Day 4: ${data.dailyTopics.day4}
    - Day 5: ${data.dailyTopics.day5}
    
    Context/Notes: ${data.specificNeeds}

    Task:
    Generate the lesson plan content for EACH of the 5 days.

    CRITICAL INSTRUCTION FOR LEARNING OBJECTIVES:
    For the "objectives" array for EACH day, you MUST generate exactly three (3) distinct objectives covering these domains in this order:
    1. Cognitive Domain (Knowledge)
    2. Psychomotor Domain (Skills)
    3. Affective Domain (Attitude/Values)
    Label them clearly if needed, but ensure they cover these three domains specifically.
    
    For Procedures, you MUST generate content for each of these specific sub-sections:
    
    IV. TEACHING AND LEARNING PROCEDURES
    Before/Pre-Lesson Proper:
    - Activating Prior Knowledge
    - Lesson Purpose/Intention
    - Lesson Language Practice
    
    Lesson Proper:
    - Reading the Key Idea/Stem
    - Developing Understanding of the Key Idea/Stem
    - Deepening Understanding of the Key Idea/Stem
    
    After/Post-Lesson Proper:
    - Making Generalizations and Abstractions
    - Evaluating Learning
    - Additional Activities for Application or Remediation
    
    Also include "Instructional Design framework (IDF) features" and "21st Century Skills" for each day.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: dllSchema,
        temperature: 0.5,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const parsed = JSON.parse(text);

    // Reconstruct the full data object with the manual inputs plus the AI generated days
    const fullPlan: LessonPlanData = {
      meta: {
        school: data.school,
        teacher: data.teacher,
        teacherPosition: data.teacherPosition,
        subject: data.subject,
        gradeLevel: data.gradeLevel,
        quarter: data.quarter,
        dates: data.dates,
        checkerName: data.checkerName,
        checkerPosition: data.checkerPosition,
        approverName: data.approverName,
        approverPosition: data.approverPosition,
        noterName: data.noterName,
        noterPosition: data.noterPosition,
      },
      standards: {
        contentStandard: data.contentStandard,
        performanceStandard: data.performanceStandard,
        learningCompetency: data.learningCompetency,
      },
      days: parsed.days
    };

    return fullPlan;
  } catch (error) {
    console.error("Error generating lesson plan:", error);
    throw error;
  }
};
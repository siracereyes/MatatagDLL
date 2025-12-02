export interface DailyPlan {
  dayNumber: number;
  topic: string;
  objectives: string[];
  idfFeatures: string; // Instructional Design Framework features
  skills21st: string; // 21st Century Skills
  resources: {
    references: string;
    otherResources: string;
  };
  procedures: {
    // Before/Pre-Lesson
    activatingPriorKnowledge: string;
    lessonPurpose: string;
    lessonLanguagePractice: string;
    
    // Lesson Proper
    readingKeyIdea: string;
    developingUnderstanding: string;
    deepeningUnderstanding: string;
    
    // After/Post-Lesson
    makingGeneralizations: string;
    evaluatingLearning: string;
    additionalActivities: string;
  };
  remarks: string;
  reflection: string;
}

export interface LessonPlanData {
  meta: {
    school: string;
    teacher: string;
    teacherPosition: string;
    subject: string;
    gradeLevel: string;
    quarter: string;
    dates: string;
    checkerName: string;
    checkerPosition: string;
    approverName: string;
    approverPosition: string;
    noterName: string;
    noterPosition: string;
  };
  standards: {
    contentStandard: string;
    performanceStandard: string;
    learningCompetency: string;
  };
  days: DailyPlan[];
}

export interface FormData {
  school: string;
  teacher: string;
  teacherPosition: string;
  subject: string;
  gradeLevel: string;
  quarter: string;
  dates: string;
  contentStandard: string;
  performanceStandard: string;
  learningCompetency: string;
  dailyTopics: {
    day1: string;
    day2: string;
    day3: string;
    day4: string;
    day5: string;
  };
  specificNeeds: string;
  checkerName: string;
  checkerPosition: string;
  approverName: string;
  approverPosition: string;
  noterName: string;
  noterPosition: string;
  // New optional field for file upload
  exemplarFile?: {
    data: string; // Base64 string without prefix
    mimeType: string;
  } | null;
}
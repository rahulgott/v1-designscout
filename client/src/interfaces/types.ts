export interface MockData {
    assessmentName: string,
    timeLimit: number,
    assessmentInfo: AssessmentInfo[],
    comments: any
}

export interface AssessmentInfo {
    question: string,
    productBrief: ProductBrief,
    imageMockup: string,
}

export interface ProductBrief {
    background: Array<string>,
    targetUsers: Array<string>,
    businessGoals: Array<string>,
    challenges: Array<string>
}

export interface LeftNavProps {
    assessmentInfo: AssessmentInfo[];
    currentQuestion: number;
    setCurrentQuestion: (index: number) => void;
}

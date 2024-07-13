export interface MockData {
    assessmentName: string,
    timeLimit: number,
    imageMockup: string,
    assessmentInfo: AssessmentInfo[],
    comments: any
}

interface AssessmentInfo {
    question: string,
    productBrief: ProductBrief
}

interface ProductBrief {
    background: Array<string>,
    targetUsers: Array<string>,
    businessGoals: Array<string>,
    challenges: Array<string>
}

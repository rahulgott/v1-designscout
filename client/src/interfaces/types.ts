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
}

export interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
    comment: string;
    time: number;
    index: number;
    imageUrl?: any
}

export interface Comment {
    index: number;
    displayOrder: number;
    x: string;
    y: string;
    width: string;
    height: string;
    imageUrl: string;
    comment: string;
    lastUpdated: number;
}

export interface CommentData {
    index: number;
    commentData: Comment[];
}
  
export interface MockCommentData {
    lastUpdated: number;
    scale: string;
    devicePixelRatio: number;
    displayDimensions: {
      width: number;
      height: number;
    };
    data: CommentData[]
}
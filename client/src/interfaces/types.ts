export interface MockData {
    assessmentName: string,
    timeLimit: number,
    questions: Question[],
    productBrief: ProductBrief,
    comments: any
}

export interface Question {
    question: string,
    imageMockup: string,
}

export interface ProductBrief {
    background: Array<string>,
    targetUsers: Array<string>,
    businessGoals: Array<string>,
    challenges: Array<string>
}

export interface LeftNavProps {
    productBrief: ProductBrief,
    questions: Question[]
}

export interface Comment {
    index: number;
    displayOrder: number;
    x: number;
    y: number;
    width: number;
    height: number;
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
import { useCallback, useState } from 'react';

interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
  comment: string;
  time: number;
  index: number;
}

export function useDraggableArea() {
    const [rectangles, setRectangles] = useState<Rectangle[]>([])
    const [currentRect, setCurrentRect] = useState<Rectangle | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [startPosition, setStartPosition] = useState<{ x: number; y: number } | null>(null)
    const [inputVisible, setInputVisible] = useState(false);
    const [inputPosition, setInputPosition] = useState({ x: 0, y: 0 });
    const [rectIndex, setRectIndex] = useState<number>(0);
    const [selectedRectIndex, setSelectedRectIndex] = useState<number | null>(null);


    const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        setStartPosition({
        x: e.clientX - rect.left - scrollLeft,
        y: e.clientY - rect.top - scrollTop,
        });
        setIsDragging(true)
        setCurrentRect(null)
    }, []);

    const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging || !startPosition) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
        const currentX = e.clientX - rect.left - scrollLeft
        const currentY = e.clientY - rect.top - scrollTop
    
        const width = Math.abs(currentX - startPosition.x)
        const height = Math.abs(currentY - startPosition.y)
    
        if (width > 12 || height > 12) {
            setCurrentRect({
                x: Math.min(startPosition.x, currentX),
                y: Math.min(startPosition.y, currentY),
                width: width,
                height: height,
                comment: "",
                time: Date.now(),
                index: rectIndex
            })
        }
    }, [isDragging, startPosition]);
    
    const onMouseUp = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (currentRect && (currentRect.width > 12 || currentRect.height > 12)) {
            setRectangles(prev => {
                return [...prev, currentRect];
            });
            const rect = e.currentTarget.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
            const x = e.clientX - rect.left - scrollLeft;
            const y = e.clientY - rect.top - scrollTop;
    
            setInputPosition({ x, y });
            setInputVisible(true);
        }
        setIsDragging(false);
        setCurrentRect(null);
        setStartPosition(null);
        setRectIndex(rectIndex + 1)
    }, [currentRect]);
    

    const submitComment = useCallback((comment: string) => {
        console.log(rectangles)
        if (rectangles) {
            setRectangles(prev => {
                console.log("prev 1: ", prev)
                prev.push({...rectangles[rectIndex], comment})
                console.log("prev 2: ", prev)
                return prev;
            })
            setInputVisible(false);
        }
    }, [selectedRectIndex, rectangles]);
    

    const showInputOnClick = useCallback((index: any) => {
        const rect = rectangles[index];
        console.log(rect)
        if (rect) {
            setInputPosition({ x: rect.x + rect.width, y: rect.y + rect.height });
            setInputVisible(true);
            setSelectedRectIndex(index);
        }
    }, [rectangles]);
    

    return { rectangles, currentRect, onMouseDown, onMouseMove, onMouseUp, inputVisible, setInputVisible, inputPosition, submitComment, showInputOnClick };
}

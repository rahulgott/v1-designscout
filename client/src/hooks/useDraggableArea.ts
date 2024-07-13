import { useCallback, useEffect, useRef, useState } from 'react';
import SpeechRecognition from 'react-speech-recognition';
import { toPng } from 'html-to-image';
import { uploadImage } from '../api/apiService';

interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
  comment: string;
  time: number;
  index: number;
  imageUrl?: any
}

export function useDraggableArea() {
    const [rectangles, setRectangles] = useState<Rectangle[]>([])
    const [currentRect, setCurrentRect] = useState<Rectangle | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [startPosition, setStartPosition] = useState<{ x: number; y: number } | null>(null)
    const [endPosition, setEndPosition] = useState<{ x: number; y: number } | null>(null)
    const [inputVisible, setInputVisible] = useState(false)
    const [inputPosition, setInputPosition] = useState({ x: 0, y: 0 })
    const [rectIndex, setRectIndex] = useState<number>(0)
    const [selectedRectIndex, setSelectedRectIndex] = useState<number | null>(null)
    const [inputValue, setInputValue] = useState("")
    const [recentImageUrl, setRecentImageUrl] = useState<string | null>()

    const screenshotRef = useRef<HTMLDivElement>(null)
    const devicePixelRatio = window.devicePixelRatio || 1;

    useEffect(() => {
        console.log("Rectangles", rectangles)
    }, [rectangles])

    const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        const inputArea = target.closest('.input-area') // Assuming you add a class to identify input areas
    
        // Click is outside and input is visible
        if(!inputArea) {
            console.log("clicked outside")
            if (inputVisible) {
                if (inputValue.trim() !== "") {
                    submitComment(inputValue) // Submit if there's text
                } else {
                    // Optionally handle empty input cases, e.g., removing an unfinished rectangle
                    if (selectedRectIndex != null) {
                        setRectangles(prev => prev.filter((_, index) => index !== selectedRectIndex))
                    }
                }
                console.log("input visible and now set to false")

                setInputVisible(false)
                setCurrentRect(null)
                setInputValue("")
            } else {
                const rect = e.currentTarget.getBoundingClientRect()
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop
                const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
                setStartPosition({
                    x: e.clientX - rect.left - scrollLeft,
                    y: e.clientY - rect.top - scrollTop,
                });
                setEndPosition({
                    x: e.clientX - rect.left - scrollLeft,
                    y: e.clientY - rect.top - scrollTop,
                });
                setIsDragging(true)
                setCurrentRect(null) // Reset current rectangle
                SpeechRecognition.stopListening()
            }
        }
    }, [inputVisible, inputValue, setInputVisible, setInputValue])
    
    

    const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging || !startPosition) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
        const currentX = e.clientX - rect.left - scrollLeft
        const currentY = e.clientY - rect.top - scrollTop
    
        const width = Math.abs(currentX - startPosition.x)
        const height = Math.abs(currentY - startPosition.y)
        
        setEndPosition({
            x: currentX,
            y: currentY,
        });
    
        if (width > 12 || height > 12) {
            setCurrentRect({
                x: Math.min(startPosition.x, currentX),
                y: Math.min(startPosition.y, currentY),
                width: width,
                height: height,
                comment: "",
                time: Date.now(),
                index: rectIndex,
                imageUrl: ""
            })
        }
    }, [isDragging, startPosition])
    
    const onMouseUp = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        let draggedWidth: number = 0
        let draggedHeight: number = 0

        if(startPosition && endPosition) {
            draggedWidth = Math.abs(startPosition.x - endPosition.x)
            draggedHeight = Math.abs(startPosition.y - endPosition.y)
        }
        if (currentRect && (draggedWidth > 12 && draggedHeight > 12)) {
            setEndPosition({
                x: currentRect.x + currentRect.width,
                y: currentRect.y + currentRect.height,
            });
            takeScreenshot()
            setRectangles(prev => [...prev, {...currentRect, comment: inputValue, index: prev.length}])
            setSelectedRectIndex(rectangles.length)
            setInputPosition({
                x: e.clientX - e.currentTarget.getBoundingClientRect().left,
                y: e.clientY - e.currentTarget.getBoundingClientRect().top
            })
            setInputVisible(true)
            setInputValue("") // Clear input after setting
        }
        setIsDragging(false)
        setStartPosition(null)
        setRectIndex(rectIndex + 1)
    }, [currentRect, inputValue, rectangles.length, rectIndex])


    const takeScreenshot = useCallback(async () => {
        if (!screenshotRef.current || !currentRect || !startPosition || !endPosition) return;
    
        const rect = screenshotRef.current.getBoundingClientRect();
        const offsetX = (Math.min(startPosition.x, endPosition.x) - rect.left) * devicePixelRatio;
        const offsetY = (Math.min(startPosition.y, endPosition.y) - rect.top) * devicePixelRatio;
        const width = Math.abs(endPosition.x - startPosition.x) * devicePixelRatio;
        const height = Math.abs(endPosition.y - startPosition.y) * devicePixelRatio;
    
        const dataUrl = await toPng(screenshotRef.current);
        const cropCanvas = document.createElement('canvas');
        const ctx = cropCanvas.getContext('2d');
        if (ctx) {
            const img = new Image();
            img.onload = async () => {
                cropCanvas.width = width;
                cropCanvas.height = height;
                ctx.drawImage(img, offsetX, offsetY, width, height, 0, 0, width, height);
                cropCanvas.toBlob(async (blob) => {
                    if(blob) {
                        try {
                            const data = await uploadImage(blob);
                            if(data && data.url) {
                                setRecentImageUrl(data.url)
                            }
                        } catch (error) {
                            console.error('Error handling in UI:', error);
                        }
                    }
                }, 'image/png');
            };
            img.src = dataUrl;
        } else {
            throw new Error("Failed to get drawing context from canvas");
        }
    }, [screenshotRef, currentRect, startPosition, endPosition, devicePixelRatio]);
    
    
    const submitComment = useCallback((comment: string) => {
        if (comment.trim() !== "") {
            setRectangles(prev => {
                const updatedRectangles = prev.map((rect, index) => {
                    if (index === selectedRectIndex) {
                        return {...rect, comment, imageUrl: recentImageUrl, time: Date.now()};
                    }
                    return rect;
                });
                return updatedRectangles;
            });
            setInputVisible(false);
        }
        setCurrentRect(null)
    }, [selectedRectIndex]);
    
    
    

    const showInputOnClick = useCallback((index: number) => {
        const rect = rectangles[index]
        if (rect) {
            setInputPosition({ x: rect.x + rect.width, y: rect.y + rect.height })
            setInputVisible(true)
            setSelectedRectIndex(index)
            setInputValue(rect.comment) // Set inputValue when an existing rectangle is clicked
        }
    }, [rectangles])
    
    

    return { rectangles, currentRect, onMouseDown, onMouseMove, onMouseUp, inputVisible, setInputVisible, inputPosition, submitComment, showInputOnClick, inputValue, setInputValue, selectedRectIndex, screenshotRef}
}

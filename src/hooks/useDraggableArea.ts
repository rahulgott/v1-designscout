import { useCallback, useState } from 'react';
import SpeechRecognition from 'react-speech-recognition';

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
    const [inputVisible, setInputVisible] = useState(false)
    const [inputPosition, setInputPosition] = useState({ x: 0, y: 0 })
    const [rectIndex, setRectIndex] = useState<number>(0)
    const [selectedRectIndex, setSelectedRectIndex] = useState<number | null>(null)
    const [inputValue, setInputValue] = useState("")


    const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        const inputArea = target.closest('.input-area') // Assuming you add a class to identify input areas
    
        // Click is outside and input is visible
        if(!inputArea) {
            if (inputVisible) {
                if (inputValue.trim() !== "") {
                    submitComment(inputValue) // Submit if there's text
                } else {
                    // Optionally handle empty input cases, e.g., removing an unfinished rectangle
                    if (selectedRectIndex != null) {
                        setRectangles(prev => prev.filter((_, index) => index !== selectedRectIndex))
                    }
                }
                setInputVisible(false)
                setInputValue("")
            } else {
                const rect = e.currentTarget.getBoundingClientRect()
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop
                const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
                setStartPosition({
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
    }, [isDragging, startPosition])
    
    const onMouseUp = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (currentRect && (currentRect.width > 12 || currentRect.height > 12)) {
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
        setCurrentRect(null)
        setStartPosition(null)
        setRectIndex(rectIndex + 1)
    }, [currentRect, inputValue, rectangles.length, rectIndex])
    
    
    

    const submitComment = useCallback((comment: string) => {
        if (rectangles && comment.trim() !== "") {
            setRectangles(prev => {
                // Update rectangles array by mapping through and adjusting only the selected rectangle
                const updatedRectangles = prev.map((rect, index) => {
                    if (index === selectedRectIndex) { // Check if the current rectangle is the selected one
                        return { ...rect, comment: comment, time: Date.now() } // Update comment and time
                    }
                    return rect // Return unchanged rectangles
                });
                return updatedRectangles
            });
            setInputVisible(false) // Close the input field after updating
        }
    }, [selectedRectIndex, rectangles])
    
    

    const showInputOnClick = useCallback((index: number) => {
        const rect = rectangles[index]
        if (rect) {
            setInputPosition({ x: rect.x + rect.width, y: rect.y + rect.height })
            setInputVisible(true)
            setSelectedRectIndex(index)
            setInputValue(rect.comment) // Set inputValue when an existing rectangle is clicked
        }
    }, [rectangles])
    
    

    return { rectangles, currentRect, onMouseDown, onMouseMove, onMouseUp, inputVisible, setInputVisible, inputPosition, submitComment, showInputOnClick, inputValue, setInputValue, selectedRectIndex}
}

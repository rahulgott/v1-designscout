import { useCallback, useEffect, useRef, useState } from 'react';
import SpeechRecognition from 'react-speech-recognition';
import { toPng } from 'html-to-image';
import { uploadImage } from '../api/apiService';
import { Comment, Rectangle } from '../interfaces/types';
import { useQuestion } from '../contexts/questionContext';

export function useDraggableArea() {
    const { currentQuestion, commentData, setCommentData } = useQuestion();
    const [rectangles, setRectangles] = useState<Comment[]>([])
    const [currentRect, setCurrentRect] = useState<Comment | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [startPosition, setStartPosition] = useState<{ x: number; y: number } | null>(null)
    const [endPosition, setEndPosition] = useState<{ x: number; y: number } | null>(null)
    const [inputVisible, setInputVisible] = useState(false)
    const [inputPosition, setInputPosition] = useState({ x: 0, y: 0 })
    const [rectIndex, setRectIndex] = useState<number>(0)
    const [selectedRectIndex, setSelectedRectIndex] = useState<number | null>(null)
    const [inputValue, setInputValue] = useState("")
    const [imageUploaded, setImageUploaded] = useState(false);
    const [recentImageUrl, setRecentImageUrl] = useState<string | null>()

    const screenshotRef = useRef<HTMLDivElement>(null)
    const devicePixelRatio = window.devicePixelRatio || 1;

    
    useEffect(() => {
        // Initialize comment data for the current question if it doesn't exist
        setCommentData((prev) => {
            const existingData = prev.data.find((item: { index: number}) => item.index === currentQuestion);
            if (!existingData) {
                return {
                    ...prev,
                    data: [
                        ...prev.data,
                        { index: currentQuestion, commentData: [] },
                    ],
                };
            }
            return prev;
        });

        setRectangles(commentData.data.find(item => item.index === currentQuestion)?.commentData || [])
    }, [currentQuestion]);

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
                setCurrentRect(null)
                setInputValue("")
                setSelectedRectIndex(null);
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
        
        setEndPosition({ x: e.clientX, y: e.clientY });
    
        if (width > 12 || height > 12) {
            setCurrentRect({
                x: Math.min(startPosition.x, currentX),
                y: Math.min(startPosition.y, currentY),
                width: width,
                height: height,
                index: rectIndex,
                displayOrder: rectIndex,
                imageUrl: "",
                comment: "",
                lastUpdated: Date.now(),
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
            })

            takeScreenshot()

            setRectangles(prev => [...prev, {...currentRect, comment: inputValue, index: prev.length, displayOrder: prev.length}])

            setCommentData(prev => {
                const updatedData = prev.data.map(item => {
                    if (item.index === currentQuestion) {
                        return {...item, commentData: rectangles};
                    }
                    return item;
                });
                return {...prev, data: updatedData};
            });

            setSelectedRectIndex(commentData.data[currentQuestion].commentData.length)

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
    }, [currentRect, inputValue, commentData?.data[currentQuestion]?.commentData?.length, rectIndex])


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
              if (blob) {
                try {
                  const data = await uploadImage(blob);
                  if (data && data.url) {
                    setRecentImageUrl(data.url);
                    setImageUploaded(true); // Set the flag when upload is successful
                  }
                } catch (error) {
                  console.error('Error uploading image to S3:', error);
                  setImageUploaded(false);
                }
              }
            }, 'image/png');
          };
          img.src = dataUrl;
        } else {
          throw new Error("Failed to get drawing context from canvas");
        }
        console.log("currentQuestion while taking screenshot: ", currentQuestion)
    }, [screenshotRef, currentRect, startPosition, endPosition, devicePixelRatio]);
      

    const submitComment = useCallback((inputValue: string) => {
        if (inputValue.trim() !== "" && selectedRectIndex != null) {
            setRectangles(prev => {
                const updatedRectangles = prev.map((rect, index) => {
                    if (index === selectedRectIndex) {
                        const newRect = {...rect, comment: inputValue, time: Date.now()};

                        if (imageUploaded && recentImageUrl) {
                            newRect.imageUrl = recentImageUrl;
                        }
                        return newRect;
                    }
                    return rect;
                });
    
                // Here we use the updated rectangles
                setCommentData((prev) => {
                    const updatedData = prev.data.map((dataItem: { index: number; commentData: any[]; }) => {
                        // Check if current data item is for the current question
                        if (dataItem.index === currentQuestion) {
                            return {...dataItem, commentData: updatedRectangles};
                        }
                        return dataItem;
                    });
    
                    return { ...prev, data: updatedData };
                });
    
                return updatedRectangles;
            });
    
            setInputVisible(false);
            setCurrentRect(null);
            setImageUploaded(false); // Reset the flag
            setInputValue(""); // Clear the input
        }
    }, [inputValue, imageUploaded, recentImageUrl, selectedRectIndex, currentQuestion]);
    
      

    const showInputOnClick = useCallback((index: number) => {
        const rect = commentData.data[currentQuestion].commentData[index]
        if (rect) {
            setInputPosition({ x: +rect.x + +rect.width, y: +rect.y + +rect.height })
            setInputVisible(true)
            setSelectedRectIndex(index)
            setInputValue(rect.comment) // Set inputValue when an existing rectangle is clicked
        }
    }, [commentData?.data[currentQuestion]?.commentData])
    
    

    return { rectangles, currentRect, setCurrentRect, onMouseDown, onMouseMove, onMouseUp, inputVisible, setInputVisible, inputPosition, submitComment, showInputOnClick, inputValue, setInputValue, selectedRectIndex, screenshotRef, commentData}
}

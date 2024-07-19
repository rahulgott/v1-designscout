import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useDraggableArea } from "../../../hooks/useDraggableArea";
import styles from "./styles.module.css"
import { useRef, useEffect } from "react";
import { useQuestion } from "../../../contexts/questionContext";

export default function CanvasArea({ imageMockup }: {imageMockup: string}) {
    const { currentQuestion, commentData } = useQuestion();
    const { currentRect, setCurrentRect, onMouseDown, onMouseMove, onMouseUp, inputVisible, setInputVisible, inputPosition, submitComment, showInputOnClick, inputValue, setInputValue, selectedRectIndex, screenshotRef } = useDraggableArea();
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const {
      transcript,
      listening,
      browserSupportsSpeechRecognition
    } = useSpeechRecognition()
  
    const toggleListening = () => {
      if (listening) {
        SpeechRecognition.stopListening()
      } else {
        SpeechRecognition.startListening({ continuous: true, interimResults: true })
      }
    }
  
    useEffect(() => {
      if (listening) {
        setInputValue(transcript)
      }
    }, [transcript])
  
    useEffect(() => {
      if (textAreaRef.current && textAreaRef.current.scrollHeight > 50) {
          textAreaRef.current.style.height = 'auto'; // Reset height to shrink if text is deleted
          textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`; // Set height based on content
      }
    }, [inputValue]);

    useEffect(() => {
        setInputVisible(false)
        setCurrentRect(null)
    }, [currentQuestion])
    
    
    return (
        <>
            {commentData?.data[currentQuestion]?.commentData?.map((rect, index) => (
                <div key={index}>
                    {selectedRectIndex === index && (
                        <div key={index} style={{
                            position: 'absolute',
                            left: `${rect.x}px`,
                            top: `${rect.y}px`,
                            width: `${rect.width}px`,
                            height: `${rect.height}px`,
                            border: '1.5px dashed #7F5EFF',
                            borderRadius: "4px",
                            pointerEvents: 'none',
                        }} />
                    )}
                    {(<div
                    onClick={() => showInputOnClick(index)}
                    style={{
                        position: 'absolute',
                        left: `${+rect.x + +rect.width}px`,
                        top: `${+rect.y + +rect.height - 30}px`,
                        cursor: "pointer"
                    }}>
                        <img src="/comment-icon.png" />
                    </div>)}
                </div>
            ))}
            {currentRect && (
                <div
                    style={{
                    position: 'absolute',
                    left: `${currentRect.x}px`,
                    top: `${currentRect.y}px`,
                    width: `${currentRect.width}px`,
                    height: `${currentRect.height}px`,
                    border: '1.5px dashed #7F5EFF',
                    background: 'rgba(127, 94, 255, 0.1)',
                    borderRadius: "4px",
                    pointerEvents: 'none',
                    }}
                />
            )}
            {inputVisible && (
                <form
                    className="input-area" 
                    onSubmit={(e) => {
                        e.preventDefault()
                        if(inputValue) {
                            submitComment(inputValue)
                        }
                        setInputVisible(false)
                        setInputValue("")
                    }}
                    style={{
                        position: 'absolute',
                        left: `${inputPosition.x}px`,
                        top: `${inputPosition.y - 30}px`,
                    }}>
                    <textarea
                        ref={textAreaRef}
                        className="input-class-name"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder='What do you think?'
                        autoFocus
                        style={{
                            fontFamily: "DM Sans, Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
                            lineHeight: "1.5",
                            fontWeight: "400",
                            fontSize: "14px",
                            position: "relative",
                            width: "240px",
                            height: "30px",
                            flexShrink: 0,
                            paddingLeft: "8px",
                            border: "4px solid #A68FFF",
                            borderRadius: "6px",
                            background: "#FFF",
                            boxShadow: "2px 2px 4px 2px rgba(0, 0, 0, 0.10)",
                            color: "black",
                            overflow: 'hidden', 
                            resize: 'none',
                            paddingRight: "70px",
                            paddingTop: "10px",
                        }}
                    />
                    <div style={{
                    position: "absolute",
                    right: "45px",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    width: "30px",
                    height: "30px",
                    bottom: "15px",
                    backgroundColor: 'white',
                    }}>
                        {browserSupportsSpeechRecognition && (
                            <button
                            style={{
                                border: "none",
                                background: "transparent",
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                            }} 
                            type="button" onClick={toggleListening}>
                            {listening ? 
                                <svg width="24" height="26" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 16C13.66 16 15 14.66 15 13V7C15 5.34 13.66 4 12 4C10.34 4 9 5.34 9 7V13C9 14.66 10.34 16 12 16ZM17.91 13C17.42 13 17.01 13.36 16.93 13.85C16.52 16.2 14.47 18 12 18C9.53 18 7.48 16.2 7.07 13.85C7.03473 13.6148 6.91662 13.3999 6.73694 13.2441C6.55727 13.0882 6.32784 13.0017 6.09 13C5.48 13 5 13.54 5.09 14.14C5.58 17.14 7.98 19.49 11 19.92V22C11 22.55 11.45 23 12 23C12.55 23 13 22.55 13 22V19.92C14.4715 19.7098 15.8378 19.0361 16.9005 17.9968C17.9632 16.9574 18.6671 15.6065 18.91 14.14C19.01 13.54 18.52 13 17.91 13Z" fill="#5E34FF"/>
                                <rect x="4" y="5.01562" width="1.53678" height="3.07356" rx="0.76839" transform="rotate(-49.798 4 5.01562)" fill="#5E34FF"/>
                                <rect width="1.53678" height="3.07356" rx="0.76839" transform="matrix(-0.645484 -0.763774 -0.763774 0.645484 18.8653 5.01562)" fill="#5E34FF"/>
                                <rect x="10.9155" width="1.53678" height="3.07356" rx="0.76839" fill="#5E34FF"/>
                                </svg>
                                : 
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 14C13.66 14 15 12.66 15 11V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14ZM17.91 11C17.42 11 17.01 11.36 16.93 11.85C16.52 14.2 14.47 16 12 16C9.53 16 7.48 14.2 7.07 11.85C7.03473 11.6148 6.91662 11.3999 6.73694 11.2441C6.55727 11.0882 6.32784 11.0017 6.09 11C5.48 11 5 11.54 5.09 12.14C5.58 15.14 7.98 17.49 11 17.92V20C11 20.55 11.45 21 12 21C12.55 21 13 20.55 13 20V17.92C14.4715 17.7098 15.8378 17.0361 16.9005 15.9968C17.9632 14.9574 18.6671 13.6065 18.91 12.14C19.01 11.54 18.52 11 17.91 11Z" fill="#C3C3C3"/>
                                </svg>                   
                            }
                            </button>
                        )}
                        <button 
                            style={{
                            display: 'flex',
                            alignItems: "center",
                            padding: "5px",
                            borderRadius: "6px",
                            border: "none",
                            background: "#7F5EFF",
                            cursor: "pointer",
                            }} 
                            type='submit'
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.5003 10.0002L3.91531 3.36189C3.83776 3.33208 3.75311 3.326 3.6721 3.34439C3.59109 3.36279 3.51737 3.40485 3.46031 3.46522C3.40157 3.5272 3.36113 3.60422 3.34348 3.68777C3.32583 3.77131 3.33166 3.85811 3.36031 3.93855L5.41697 10.0002M17.5003 10.0002L3.91531 16.6386C3.83776 16.6684 3.75311 16.6744 3.6721 16.656C3.59109 16.6376 3.51737 16.5956 3.46031 16.5352C3.40157 16.4732 3.36113 16.3962 3.34348 16.3127C3.32583 16.2291 3.33166 16.1423 3.36031 16.0619L5.41697 10.0002M17.5003 10.0002H5.41697" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </form>
            )}
            
            <div className={styles.canvasArea}
                onMouseDown={onMouseDown} 
                onMouseMove={onMouseMove} 
                onMouseUp={onMouseUp}
                ref={screenshotRef}
            >
                <div className={styles.imageContainer}>
                    <img src={imageMockup} alt=""  draggable="false" />
                </div>
            </div>
        </>
        
    )
}

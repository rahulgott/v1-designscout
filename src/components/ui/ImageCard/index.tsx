import { useState } from 'react';
import { useDraggableArea } from '../../../hooks/useDraggableArea';
import styles from './styles.module.css'

interface ImageCardProps {
  src: string,
  altText: string
}

export default function ImageCard({ src, altText }: ImageCardProps ) {
  const { rectangles, currentRect, onMouseDown, onMouseMove, onMouseUp, inputVisible, setInputVisible, inputPosition, submitComment, showInputOnClick, inputValue, setInputValue, } = useDraggableArea();

  return (
    <>
      <div className={styles.card} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp}>
        <img src={src} alt={altText} className={styles.image} draggable="false" />

        {rectangles.map((rect, index) => (
          <div key={index}>
            <div
              style={{
                position: 'absolute',
                left: `${rect.x}px`,
                top: `${rect.y}px`,
                width: `${rect.width}px`,
                height: `${rect.height}px`,
                border: '1.2px dashed purple',
                pointerEvents: 'none',
              }}
            />
            {!inputVisible && (
              <div
                  onClick={() => showInputOnClick(index)}
                  style={{
                      position: 'absolute',
                      left: `${rect.x + rect.width}px`,
                      top: `${rect.y + rect.height - 12}px`,
                      width: "32px",
                      height: "32px",
                      backgroundColor: "purple",
                      borderRadius: "50%"
                  }}
              />
            )}
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
              border: '1px dashed blue',
              pointerEvents: 'none',
            }}
          />
        )}
        {inputVisible && (
          <form 
            onSubmit={(e) => {
                e.preventDefault();
                submitComment(inputValue);
                setInputVisible(false);
                setInputValue("");  // Optionally clear the input after submitting
            }}
            style={{
                position: 'absolute',
                left: `${inputPosition.x}px`,
                top: `${inputPosition.y - 10}px`,
            }}>
              <input
                  value={inputValue}
                  onChange={(e) => {
                    console.log(e.target.value)
                    setInputValue(e.target.value)

                  }}
                  placeholder='Enter your thoughts'
                  autoFocus
                  type="text"
                  style={{
                      position: "relative",
                      height: "32px",
                      width: "120px",
                      backgroundColor: "beige",
                      color: "black",
                  }}
              />
            <button type='submit'>Submit</button>
          </form>
      
      )}
      </div>
    </>
  )
}

import { useState } from 'react'

interface Position {
  x: number;
  y: number;
}

const allCoordinates: Position[] = []

export default function DragHighlightInput() {
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [startPos, setStartPos] = useState<Position>({ x: 0, y: 0 })
  const [endPos, setEndPos] = useState<Position>({ x: 0, y: 0 })
  const [showInput, setShowInput] = useState<boolean>(false)

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
    setStartPos({ x: e.clientX, y: e.clientY })
    setShowInput(false)
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      setEndPos({ x: e.clientX, y: e.clientY })
    }
  };

  const onMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(false)
    setShowInput(true)
    setEndPos({ x: e.clientX, y: e.clientY })
    allCoordinates.push(startPos, endPos)
    console.log(allCoordinates)
  };

  const onSubmit = () => {
    setShowInput(false)
  }

  return (
    <div
      className="drag-area"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {/* {allCoordinates.map(coordinates => {
        return
      })} */}
      {isDragging && (
        <div
          className="highlight"
          style={{
            left: Math.min(startPos.x, endPos.x) + 'px',
            top: Math.min(startPos.y, endPos.y) + 'px',
            width: Math.abs(endPos.x - startPos.x) + 'px',
            height: Math.abs(endPos.y - startPos.y) + 'px',
          }}
        />
      )}
      {showInput && (
        <input
          style={{
            position: 'absolute',
            left: `${endPos.x}px`,
            top: `${endPos.y}px`,
          }}
          type="text"
          autoFocus
          onBlur={onSubmit}
        />
      )}
    </div>
  )
}

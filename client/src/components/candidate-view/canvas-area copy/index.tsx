import { useState } from 'react';
// import { Stage, Layer, Rect, Image as KonvaImage } from 'react-konva';
// import useImage from 'use-image';
import { toPng } from 'html-to-image';

interface CardProps {
  x: number;
  y: number;
  imagePath: string;
}

// const DraggableCard: React.FC<CardProps> = ({ x, y, imagePath }) => {
//   const [image] = useImage(imagePath);
//   return <KonvaImage image={image} x={x} y={y} draggable />;
// };

interface Selection {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function CanvasAreaCopy() {
  const [commentMode, setCommentMode] = useState<boolean>(false);
  const [selections, setSelections] = useState<Selection[]>([]);
  const [currentSelection, setCurrentSelection] = useState<Selection | null>(null);
  const [stageScale, setStageScale] = useState<number>(1);
  const [stageX, setStageX] = useState<number>(0);
  const [stageY, setStageY] = useState<number>(0);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [endPos, setEndPos] = useState({ x: 0, y: 0 })

  const toggleCommentMode = () => {
    setCommentMode(!commentMode);
    if (!commentMode) {
      setSelections([]); // Optionally clear previous selections
    }
  };

  const handleMouseDown = (event: any) => {
    if (commentMode) {
      const stage = event.target.getStage();
      const point = stage.getPointerPosition();
      setCurrentSelection({ x: point.x, y: point.y, width: 0, height: 0 });
    }
  };

  const handleMouseMove = (event: any) => {
    if (commentMode && currentSelection) {
      const stage = event.target.getStage();
      const point = stage.getPointerPosition();
      const newSelection = {
        ...currentSelection,
        width: point.x - currentSelection.x,
        height: point.y - currentSelection.y,
      };
      setCurrentSelection(newSelection);
    }
  };

  const handleMouseUp = () => {
    if (commentMode && currentSelection) {
      setSelections([...selections, currentSelection]);
      takeScreenshot(currentSelection);
      setCurrentSelection(null);
    }
  };

  const handleMouseWheel = (e: any) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
  
    if (!pointer) {
      return; // Early exit if pointer is not defined
    }
  
    const mousePointTo = {
      x: pointer.x / oldScale - stage.x() / oldScale,
      y: pointer.y / oldScale - stage.y() / oldScale,
    };
  
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    setStageScale(newScale);
    setStageX(-(mousePointTo.x - pointer.x / newScale) * newScale);
    setStageY(-(mousePointTo.y - pointer.y / newScale) * newScale);
  };
  
  

  const takeScreenshot = async (selection: Selection) => {
    const node = document.querySelector('canvas');
    if (!node) return console.error("No canvas found");
  
    // Calculate scale and adjusted coordinates
    const rect = node.getBoundingClientRect();
    const scale = window.devicePixelRatio * stageScale;
  
    const x = (selection.x - stageX) * scale;
    const y = (selection.y - stageY) * scale;
    const width = selection.width * scale;
    const height = selection.height * scale;
    const options: any = {
      width: rect.width,
      height: rect.height,
      x: x,
      y: y,
      backgroundColor: null,
    }
  
    try {
      const dataUrl = await toPng(node, options);
  
      const img = new Image();
      img.onload = () => {
        const cropCanvas = document.createElement('canvas');
        cropCanvas.width = width / scale;
        cropCanvas.height = height / scale;
        const ctx = cropCanvas.getContext('2d');
        if (!ctx) return console.error("Failed to get drawing context from canvas");
  
        ctx.drawImage(
          img,
          0, 0,
          cropCanvas.width, cropCanvas.height,
          0, 0,
          cropCanvas.width, cropCanvas.height
        );
  
        const croppedDataUrl = cropCanvas.toDataURL();
        const croppedImage = document.createElement('img');
        croppedImage.src = croppedDataUrl;
        document.body.appendChild(croppedImage);
      };
      img.src = dataUrl;
    } catch (error) {
      console.error("Failed to capture the canvas:", error);
    }
  };
  
  


  return (
    <div>
      {/* <button onClick={toggleCommentMode}>
        {commentMode ? 'Comment Off' : 'Comment On'}
      </button>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stageX}
        y={stageY}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleMouseWheel}
        draggable={!commentMode}
      >
        <Layer>
          <DraggableCard x={50} y={50} imagePath="./mock.png" />
          {selections.map((sel, i) => (
            <Rect
              key={i}
              {...sel}
              stroke="red"
              strokeWidth={2}
              dash={[10, 5]}
              strokeScaleEnabled={false}
            />
          ))}
          {currentSelection && (
            <Rect
              {...currentSelection}
              fill="blue"
              opacity={0.2}
              stroke="red"
              strokeWidth={2}
              dash={[10, 5]}
              strokeScaleEnabled={false}
            />
          )}
        </Layer>
      </Stage> */}
    </div>
  );
};

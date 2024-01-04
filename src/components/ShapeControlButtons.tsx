import React from "react";
import ShapeControlButton from "./Buttons";

interface ControlsProps {
  handleMoveShape: (direction: "up" | "down" | "left" | "right") => void;
  handleResizeShape: (scale: number) => void;
  handleDeleteShape: () => void;
  clearAll: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  handleMoveShape,
  handleResizeShape,
  handleDeleteShape,
  clearAll,
}) => (
  <div className="control-buttons">
    <ShapeControlButton
      onClick={() => handleMoveShape("up")}
      iconClass="fas fa-arrow-up"
      label="Move Up"
    />
    <ShapeControlButton
      onClick={() => handleMoveShape("down")}
      iconClass="fas fa-arrow-down"
      label="Move Down"
    />
    <ShapeControlButton
      onClick={() => handleMoveShape("left")}
      iconClass="fas fa-arrow-left"
      label="Move Left"
    />
    <ShapeControlButton
      onClick={() => handleMoveShape("right")}
      iconClass="fas fa-arrow-right"
      label="Move Right"
    />
    <ShapeControlButton
      onClick={() => handleResizeShape(1.1)}
      iconClass="fas fa-search-plus"
      label="Enlarge"
    />
    <ShapeControlButton
      onClick={() => handleResizeShape(0.9)}
      iconClass="fas fa-search-minus"
      label="Shrink"
    />
    <ShapeControlButton
      onClick={handleDeleteShape}
      iconClass="fas fa-trash-alt"
      label="Delete Shape"
    />
    <ShapeControlButton
      onClick={clearAll}
      iconClass="fas fa-trash-alt"
      label="Clear All"
    />
  </div>
);

export default Controls;

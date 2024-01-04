import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { fabric } from "fabric";
import React from "react";

interface CustomCanvasProps {
  className: string;
  onReady: () => void;
  style?: React.CSSProperties;
}
const CustomCanvas: React.FC<CustomCanvasProps | any> = ({
  className,
  onReady,
}) => {
  return <FabricJSCanvas className={className} onReady={onReady} />;
};

//custom hook

const useEnhancedFabricJSEditor = () => {
  const { editor, onReady } = useFabricJSEditor();

  if (editor) {
    editor.addCircle = () => {
      const circle = new fabric.Circle({
        radius: 20,
        fill: "#3498db",
        top: 50,
        left: 50,
      });
      editor.canvas.add(circle);
    };

    editor.addRectangle = () => {
      const rectangle = new fabric.Rect({
        width: 50,
        height: 50,
        fill: "#e74c3c",
        top: 100,
        left: 100,
      });
      editor.canvas.add(rectangle);
    };
  }

  return { editor, onReady };
};

export { useEnhancedFabricJSEditor, CustomCanvas };

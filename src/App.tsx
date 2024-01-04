import React, { useState } from "react";
import { fabric } from "fabric";
import { CirclePicker, ColorResult } from "react-color";
import "./styles.css";
import { CommentBox } from "./components/CommentBox";
import { CustomCanvas, useEnhancedFabricJSEditor } from "./components/Drawing";
import { saveCanvasToFirebase } from "./services/firebase";
import ShapeButtons from "./components/ShapeButtons";
import Controls from "./components/ShapeControlButtons";

const App: React.FC = () => {
  const { editor, onReady } = useEnhancedFabricJSEditor();
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(
    null
  );
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [fillColor, setFillColor] = useState<string>("#3498db");
  const [showCommentBox, setShowCommentBox] = useState(false);

  const handleSelectObject = () => {
    if (editor) {
      const selected = editor.canvas.getActiveObject();
      setSelectedObject(selected);
    }
  };

  const handleMoveShape = (direction: "up" | "down" | "left" | "right") => {
    if (selectedObject && editor) {
      switch (direction) {
        case "up":
          selectedObject.top! -= 10;
          break;
        case "down":
          selectedObject.top! += 10;
          break;
        case "left":
          selectedObject.left! -= 10;
          break;
        case "right":
          selectedObject.left! += 10;
          break;
        default:
          return;
      }

      selectedObject.setCoords();
      editor.canvas.requestRenderAll();
    }
  };

  const handleResizeShape = (scale: number) => {
    if (selectedObject && editor) {
      selectedObject.scaleX! *= scale;
      selectedObject.scaleY! *= scale;

      selectedObject.setCoords();
      editor.canvas.requestRenderAll();
    }
  };

  const handleDeleteShape = () => {
    if (selectedObject && editor) {
      editor.canvas.remove(selectedObject);
      setSelectedObject(null);
    }
  };

  const AddComment = () => {
    setShowCommentBox(true);
  };

  const addTriangle = () => {
    if (editor) {
      const line = new fabric.Triangle({
        width: 50,
        height: 50,
        fill: "#8cfc",
        top: 100,
        left: 100,
      });
      editor.canvas.add(line);
    }
  };

  const handleFillColorChange = (color: ColorResult) => {
    setFillColor(color.hex);
    setShowColorPicker(false);
    if (selectedObject && editor) {
      selectedObject.set("fill", color.hex);
      editor.canvas.requestRenderAll();
    }
  };

  const handleCommentSubmit = (comment: string) => {
    setShowCommentBox(false);
    if (editor) {
      const text = new fabric.Textbox(comment, {
        left: 10,
        top: 10,
        fontSize: 16,
        fill: "#000",
      });
      editor.canvas.add(text);
    }
  };

  const handleSaveCanvas = () => {
    if (editor && !editor.canvas.isEmpty()) {
      const canvasData = editor.canvas.toJSON() as fabric.ICanvasOptions;
      saveCanvasToFirebase(canvasData);
      alert("Canvas data saved ");
      editor.canvas.clear();
      editor.canvas.renderAll();
    } else {
      alert("Missing Canvas ....");
    }
  };

  const clearAll = () => {
    if (editor) {
      editor?.canvas.clear();
      editor?.canvas.renderAll();
    }
  };

  return (
    <div className="container">
      <h1>Draw Shapes</h1>

      <ShapeButtons
        editor={editor}
        addTriangle={addTriangle}
        handleSelectObject={handleSelectObject}
        AddComment={AddComment}
        handleSaveCanvas={handleSaveCanvas}
      />

      <Controls
        handleMoveShape={handleMoveShape}
        handleResizeShape={handleResizeShape}
        handleDeleteShape={handleDeleteShape}
        clearAll={clearAll}
      />

      {showCommentBox && (
        <CommentBox
          onSubmit={handleCommentSubmit}
          onCancel={() => setShowCommentBox(false)}
        />
      )}

      {selectedObject && (
        <div className="color-picker">
          <label>Colors</label>
          <div>
            <input
              type="checkbox"
              checked={showColorPicker}
              onChange={() => setShowColorPicker(!showColorPicker)}
            />
            {showColorPicker && (
              <CirclePicker
                color={fillColor}
                onChangeComplete={(color) => handleFillColorChange(color)}
              />
            )}
          </div>
        </div>
      )}

      <CustomCanvas className="canvas" onReady={onReady} />
    </div>
  );
};

export default App;

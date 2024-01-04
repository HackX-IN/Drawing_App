import React, { useState } from "react";
import { fabric } from "fabric";
import { CirclePicker, ColorResult } from "react-color";
import "./styles.css";
import { addDoc, collection } from "@firebase/firestore";
import { db } from "./services/firebase";
import { CommentBox } from "./components/CommentBox";
import { CustomCanvas, useEnhancedFabricJSEditor } from "./components/Drawing";

const App: React.FC = () => {
  const { editor, onReady } = useEnhancedFabricJSEditor();
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(
    null
  );
  const [showAnnotations, setShowAnnotations] = useState(true);
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

  const addAnnotation = () => {
    if (editor) {
      const line = new fabric.Line([10, 10, 100, 100], {
        stroke: "#ff0000",
        strokeWidth: 2,
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

  const saveCanvasToFirebase = async (canvasData: fabric.ICanvasOptions) => {
    try {
      const docRef = await addDoc(collection(db, "Canvas"), {
        canvasData,
        timestamp: new Date(),
      });
      console.log("Canvas data saved with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleSaveCanvas = () => {
    if (editor && !editor.canvas.isEmpty()) {
      const canvasData = editor.canvas.toJSON() as fabric.ICanvasOptions;
      saveCanvasToFirebase(canvasData);

      alert("Canvas data saved to Firebase");
      editor.canvas.clear();
      editor.canvas.renderAll();
    } else {
      alert("Missing Drawing ....");
    }
  };

  return (
    <div className="container">
      <h1>Draw Shapes</h1>
      <div className="button-group">
        <button
          className="button button-primary"
          onClick={() => editor?.addCircle()}
        >
          <i className="fas fa-circle"></i> Add Circle
        </button>
        <button
          className="button button-danger"
          onClick={() => editor?.addRectangle()}
        >
          <i className="fas fa-square"></i> Add Rectangle
        </button>
        <button className="button button-success" onClick={handleSelectObject}>
          <i className="far fa-object-ungroup"></i> Select Object
        </button>
        <button className="button button-warning" onClick={addAnnotation}>
          <i className="fas fa-comment-alt"></i> Add Annotation
        </button>
        <button className="button button-warning" onClick={AddComment}>
          <i className="fas fa-comment-alt"></i> Add Comment
        </button>
        <button
          className="button button-success"
          onClick={() => handleSaveCanvas()}
        >
          <i className="fas fa-save"></i> Save Canvas
        </button>
      </div>

      <div className="control-buttons">
        <button className="button" onClick={() => handleMoveShape("up")}>
          <i className="fas fa-arrow-up"></i> Move Up
        </button>
        <button className="button" onClick={() => handleMoveShape("down")}>
          <i className="fas fa-arrow-down"></i> Move Down
        </button>
        <button className="button" onClick={() => handleMoveShape("left")}>
          <i className="fas fa-arrow-left"></i> Move Left
        </button>
        <button className="button" onClick={() => handleMoveShape("right")}>
          <i className="fas fa-arrow-right"></i> Move Right
        </button>
        <button className="button" onClick={() => handleResizeShape(1.1)}>
          <i className="fas fa-search-plus"></i> Enlarge
        </button>
        <button className="button" onClick={() => handleResizeShape(0.9)}>
          <i className="fas fa-search-minus"></i> Shrink
        </button>
        <button className="button" onClick={handleDeleteShape}>
          <i className="fas fa-trash-alt"></i> Delete Shape
        </button>
      </div>

      {showCommentBox && (
        <CommentBox
          onSubmit={handleCommentSubmit}
          onCancel={() => setShowCommentBox(false)}
        />
      )}

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
              // styles={{ display: showColorPicker ? "block" : "none" }}
            />
          )}
        </div>
      </div>

      <CustomCanvas className="canvas" onReady={onReady} />
    </div>
  );
};

export default App;

import React, { useEffect, useState } from "react";
import { fabric } from "fabric";
import { CirclePicker, ColorResult } from "react-color";
import "./styles.css";
import { CommentBox } from "./components/CommentBox";
import { CustomCanvas, useEnhancedFabricJSEditor } from "./components/Drawing";
import { db, saveCanvasToFirebase } from "./services/firebase";
import { collection, deleteDoc, doc, getDocs } from "@firebase/firestore";
import ShapeButtons from "./components/ShapeButtons";
import Controls from "./components/ShapeControlButtons";

const App: React.FC = () => {
  // Initialize fabric.js editor
  const { editor, onReady } = useEnhancedFabricJSEditor();

  // UseState variables
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(
    null
  );
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [fillColor, setFillColor] = useState<string>("#3498db");
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [canvasData, setCanvasData] = useState<any>();
  const [, setSelectedCanvas] = useState(null);

  // Select an object in the canvas
  const handleSelectObject = () => {
    if (editor) {
      const selected = editor.canvas.getActiveObject();
      setSelectedObject(selected);
    }
  };

  // Fetch canvas data from Firebase on component mount
  const getCanvasFromFirebase = async () => {
    try {
      const collectionData = collection(db, "Canvas");
      const getData = await getDocs(collectionData);

      // Map fetched data to state
      const data = getData.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCanvasData(data);
    } catch (error) {
      console.log(error);
    }
  };

  //Side-Effects for fetching Data
  useEffect(() => {
    getCanvasFromFirebase();
  }, [canvasData]);

  // Handle click on a canvas item to load its data
  const handleCanvasClick = (canvasItem: any) => {
    setSelectedCanvas(canvasItem);
    if (editor) {
      editor.canvas.clear();
      editor.canvas.loadFromJSON(canvasItem.canvasData, () => {});
    }
  };

  // Move the selected object in the canvas
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

  // Resize the selected object in the canvas
  const handleResizeShape = (scale: number) => {
    if (selectedObject && editor) {
      selectedObject.scaleX! *= scale;
      selectedObject.scaleY! *= scale;

      selectedObject.setCoords();
      editor.canvas.requestRenderAll();
    }
  };

  // Delete the selected object from the canvas
  const handleDeleteShape = () => {
    if (selectedObject && editor) {
      editor.canvas.remove(selectedObject);
      setSelectedObject(null);
    }
  };

  // Show comment box for adding comments
  const AddComment = () => {
    setShowCommentBox(true);
  };

  // Add a triangle shape to the canvas
  const addTriangle = () => {
    if (editor) {
      const triangle = new fabric.Triangle({
        width: 50,
        height: 50,
        fill: "#8cfc",
        top: 100,
        left: 100,
      });
      editor.canvas.add(triangle);
    }
  };

  // Handle color change in the color picker
  const handleFillColorChange = (color: ColorResult) => {
    setFillColor(color.hex);
    setShowColorPicker(false);
    if (selectedObject && editor) {
      selectedObject.set("fill", color.hex);
      editor.canvas.requestRenderAll();
    }
  };

  // Handle comment submission
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

  // Save canvas data to Firebase
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

  // Clear the canvas
  const clearAll = () => {
    if (editor) {
      editor?.canvas.clear();
      editor?.canvas.renderAll();
    }
  };

  //Delete Item from firebase
  const deleteCanvasFromFirebase = async (canvasId: string) => {
    try {
      const canvasDocRef = doc(db, "Canvas", canvasId);
      await deleteDoc(canvasDocRef);
      console.log(`Canvas with ID ${canvasId} deleted successfully`);

      setCanvasData(
        canvasData.filter((item: any) => {
          return item.id !== canvasId;
        })
      );
    } catch (error) {
      console.error(`Error deleting canvas with ID ${canvasId}:`, error);
    }
  };

  return (
    <div className="container">
      <h1>Draw Shapes</h1>

      {/* Shape buttons for adding and interacting with shapes */}
      <ShapeButtons
        editor={editor}
        addTriangle={addTriangle}
        handleSelectObject={handleSelectObject}
        AddComment={AddComment}
        handleSaveCanvas={handleSaveCanvas}
      />

      {/* Controls for moving, resizing, and deleting shapes */}
      <Controls
        handleMoveShape={handleMoveShape}
        handleResizeShape={handleResizeShape}
        handleDeleteShape={handleDeleteShape}
        clearAll={clearAll}
      />

      {/* Comment box for adding comments */}
      {showCommentBox && (
        <CommentBox
          onSubmit={handleCommentSubmit}
          onCancel={() => setShowCommentBox(false)}
        />
      )}

      {/* Color picker for changing shape colors */}
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

      {/* Canvas component */}
      <CustomCanvas className="canvas" onReady={onReady} />

      {/* Display list of canvas data */}

      <div>
        <h4>Canvas Data:</h4>
        <ul className="lists">
          {canvasData?.map((data: any) => (
            <div
              style={{
                display: "flex",
                alignSelf: "center",
              }}
            >
              <li
                className="list-item"
                key={data.id}
                onClick={() => handleCanvasClick(data)}
              >
                {data.id}
              </li>
              <i
                className="fas fa-trash"
                style={{ marginLeft: 10, alignSelf: "center" }}
                onClick={() => deleteCanvasFromFirebase(data.id)}
              ></i>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;

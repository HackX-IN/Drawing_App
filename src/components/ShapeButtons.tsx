import React from "react";
import ShapeButton from "./Buttons";
import { FabricJSEditor } from "fabricjs-react";

interface ShapeButtonsProps {
  editor?: FabricJSEditor | undefined;
  addTriangle: () => void;
  handleSelectObject: () => void;
  AddComment: () => void;
  handleSaveCanvas: () => void;
}

const ShapeButtons: React.FC<ShapeButtonsProps> = ({
  editor,
  addTriangle,
  handleSelectObject,
  AddComment,
  handleSaveCanvas,
}) => (
  <div className="button-group">
    <ShapeButton
      onClick={() => editor?.addCircle()}
      iconClass="fas fa-circle"
      label="Add Circle"
      className="button-primary"
    />
    <ShapeButton
      onClick={() => addTriangle()}
      iconClass="fas fa-angle"
      label="Add Triangle"
      className="button-primary"
    />
    <ShapeButton
      onClick={() => editor?.addRectangle()}
      iconClass="fas fa-square"
      label="Add Rectangle"
      className="button-danger"
    />
    <ShapeButton
      onClick={handleSelectObject}
      iconClass="far fa-object-ungroup"
      label="Select Object"
      className="button-success"
    />
    <ShapeButton
      onClick={() => editor?.addLine()}
      label="Add Annotation"
      className="button-warning"
    />
    <ShapeButton
      onClick={AddComment}
      iconClass="fas fa-comment-alt"
      label="Add Comment"
      className="button-warning"
    />
    <ShapeButton
      onClick={() => handleSaveCanvas()}
      iconClass="fas fa-save"
      label="Save Canvas"
      className="button-success"
    />
  </div>
);

export default ShapeButtons;

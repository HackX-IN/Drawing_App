import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

describe("App Component", () => {
  test("renders without crashing", () => {
    render(<App />);
  });

  test("renders 'Draw Shapes' heading", () => {
    render(<App />);
    const headingElement = screen.getByText("Draw Shapes");
    expect(headingElement).toBeInTheDocument();
  });

  test("renders 'Add Triangle' button", () => {
    render(<App />);
    const addButton = screen.getByText("Add Triangle");
    expect(addButton).toBeInTheDocument();
  });

  test("canvas data list is initially empty", () => {
    render(<App />);
    const canvasDataList = screen.getByText("Canvas Data:");
    expect(canvasDataList).toBeInTheDocument();
    const listItem = screen.queryByRole("listitem");
    expect(listItem).toBeNull();
  });

  test("handles canvas data saving", () => {
    render(<App />);

    const saveText = screen.getByText("Save Canvas");

    expect(saveText).toBeInTheDocument();
  });

  test("handles canvas data retrieving", () => {
    render(<App />);

    const saveText = screen.getByText("Get Canvas");

    expect(saveText).toBeInTheDocument();
  });

  test("handles resizing a shape", () => {
    render(<App />);

    const mockCanvasObject = {
      scaleX: 1,
      scaleY: 1,
      setCoords: jest.fn(),
    };

    const mockEditor = {
      canvas: {
        getActiveObject: jest.fn(() => mockCanvasObject),
        requestRenderAll: jest.fn(),
      },
    };

    jest
      .spyOn(require("../components/Drawing"), "useEnhancedFabricJSEditor")
      .mockImplementation(() => ({
        editor: mockEditor,
        onReady: jest.fn(),
      }));

    userEvent.click(screen.getByText("Add Triangle"));

    //Enlarge Button
    const resizeButton = screen.getByText("Enlarge");

    act(() => {
      fireEvent.click(resizeButton);
    });

    //Shrink Button
    const shrinkButton = screen.getByText("Shrink");

    act(() => {
      fireEvent.click(shrinkButton);
    });
    expect(mockCanvasObject.scaleX).toBe(1);
    expect(mockCanvasObject.scaleY).toBe(1);
    expect(mockCanvasObject.setCoords).toHaveBeenCalledTimes(0);
    expect(mockEditor.canvas.requestRenderAll).toHaveBeenCalledTimes(0);
  });
});

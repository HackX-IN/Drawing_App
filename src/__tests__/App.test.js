import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";
import { saveCanvasToFirebase as mockSaveCanvasToFirebase } from "../services/firebase";

jest.mock("../services/firebase", () => ({
  ...jest.requireActual("../services/firebase"),
  saveCanvasToFirebase: jest.fn(),
}));

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
});

import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import App from "../App";

jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  addDoc: jest.fn(),
  collection: jest.fn(),
}));

jest.mock("fabric", () => ({
  ...jest.requireActual("fabric"),
  canvas: {
    toJSON: jest.fn(),
  },
}));

describe("App Component", () => {
  //Saving Data to firebase
  test("handles saving canvas data to Firebase", async () => {
    render(<App />);

    const mockCanvasObject = {
      toJSON: jest.fn(() => ({})),
      clear: jest.fn(),
      renderAll: jest.fn(),
      isEmpty: jest.fn(() => false),
    };

    const mockEditor = {
      canvas: mockCanvasObject,
    };
    jest
      .spyOn(require("../components/Drawing"), "useEnhancedFabricJSEditor")
      .mockImplementation(() => ({
        editor: mockEditor,
        onReady: jest.fn(),
      }));

    const { addDoc } = require("firebase/firestore");
    addDoc.mockResolvedValue({ id: "mock-doc-id" });

    jest.spyOn(window, "alert").mockImplementation(() => {});

    const saveButton = screen.getByText("Save Canvas");

    await act(async () => {
      await fireEvent.click(saveButton);
    });

    expect(mockCanvasObject.toJSON).toHaveBeenCalledTimes(0);
    expect(mockCanvasObject.clear).toHaveBeenCalledTimes(0);
    expect(mockCanvasObject.renderAll).toHaveBeenCalledTimes(0);

    expect(window.alert).toHaveBeenCalled();
  });

  //Getting Data from firebase

  test("handles fetching canvas data from Firebase", async () => {
    const mockData = [
      { id: "1", shape: "rectangle" },
      { id: "2", shape: "circle" },
    ];

    const mockGetDocs = jest.fn(() => ({
      docs: mockData.map((item) => ({
        id: item.id,
        data: () => ({ ...item }),
      })),
    }));
    const mockCollection = jest.fn();
    mockCollection.mockReturnValue({ getDocs: mockGetDocs });

    const mockFirestore = { collection: mockCollection };
    jest
      .spyOn(require("firebase/firestore"), "getFirestore")
      .mockReturnValue(mockFirestore);

    expect(mockGetDocs).toHaveBeenCalledTimes(0);
    expect(mockCollection).toHaveBeenCalledTimes(0);
  });
});

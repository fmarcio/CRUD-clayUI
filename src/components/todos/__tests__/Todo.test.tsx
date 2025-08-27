import React, { useState } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Todo from "../Todo";
import { ResourcesContext } from "../../../context/ResourcesContext";
import { type TodoResource } from "../../../utils/utils";
import { HTTPMethods } from "../../../hooks/useRequest";

const mockSendRequest = jest.fn();

const MockProvider: React.FC<{
  children: React.ReactNode;
  resourceName?: string;
}> = ({ children, resourceName = "todos" }) => (
  <ResourcesContext.Provider
    value={{
      data: [],
      loading: false,
      selectedResource: resourceName,
      sendRequest: mockSendRequest,
      setData: jest.fn(),
      setSelectedResource: jest.fn(),
    }}
  >
    {children}
  </ResourcesContext.Provider>
);

describe("Todo Component", () => {
  const mockTodo: TodoResource = {
    id: 1,
    userId: 1,
    title: "Test Todo Item",
    completed: false,
  };

  beforeEach(() => {
    mockSendRequest.mockClear();
  });

  test("should render correctly", () => {
    render(
      <MockProvider>
        <Todo item={mockTodo} />
      </MockProvider>
    );

    expect(screen.getByText("Test Todo Item")).toBeInTheDocument();

    expect(screen.getByText("Complete todo")).toBeInTheDocument();

    expect(screen.getByText("Edit todo")).toBeInTheDocument();

    expect(screen.getByText("Delete todo")).toBeInTheDocument();
  });

  test("should show loading, then update style and text on click", async () => {
    const TestWrapper = () => {
      const [data, setData] = useState<TodoResource[]>([mockTodo]);
      const [loading, setLoading] = useState(false);

      const sendRequest = jest.fn(async (options: any) => {
        setLoading(true);

        await new Promise((r) => setTimeout(r, 200));

        if (options.method === HTTPMethods.PATCH) {
          setData((prevData) =>
            prevData.map((item) =>
              item.id === options.id ? { ...item, ...options.body } : item
            )
          );
        }
        setLoading(false);
      });

      return (
        <ResourcesContext.Provider
          value={{
            data,
            loading,
            selectedResource: "todos",
            sendRequest,
            setData: jest.fn(),
            setSelectedResource: jest.fn(),
          }}
        >
          {loading && <span role="status" className="loading-animation" />}

          {data.map((todo) => (
            <Todo key={todo.id} item={todo} />
          ))}
        </ResourcesContext.Provider>
      );
    };

    render(<TestWrapper />);

    expect(screen.getByText("Test Todo Item")).not.toHaveStyle(
      "text-decoration: line-through"
    );
    expect(screen.getByText("Complete todo")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Complete todo"));

    const loadingIndicator = await screen.findByRole("status");

    expect(loadingIndicator).toBeInTheDocument();

    expect(loadingIndicator).toHaveClass("loading-animation");

    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Test Todo Item")).toHaveStyle(
      "text-decoration: line-through"
    );

    expect(screen.getByText("Set back to incomplete")).toBeInTheDocument();
  });
});

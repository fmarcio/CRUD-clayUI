import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Post from "../Post";
import { ResourcesContext } from "../../../context/ResourcesContext";
import { type PostResource } from "../../../utils/utils";
import { HTTPMethods } from "../../../hooks/useRequest";

const mockSendRequest = jest.fn();

const MockProvider: React.FC<{
  children: React.ReactNode;
  resourceName?: string;
}> = ({ children, resourceName = "posts" }) => (
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

describe("Post Component", () => {
  const mockPost: PostResource = {
    id: 1,
    userId: 1,
    title: "Test Post Title",
    body: "This is the body of the test post.",
  };

  beforeEach(() => {
    mockSendRequest.mockClear();
  });

  test("should render correctly", () => {
    render(
      <MockProvider resourceName="posts">
        <Post item={mockPost} />
      </MockProvider>
    );

    expect(screen.getByText("Test Post Title")).toBeInTheDocument();

    expect(
      screen.getByText("This is the body of the test post.")
    ).toBeInTheDocument();

    expect(screen.getByText("Edit post")).toBeInTheDocument();

    expect(screen.getByText("Delete post")).toBeInTheDocument();
  });

  test("should be editable, update Post, and display new values", async () => {
    const TestWrapper = () => {
      const [data, setData] = useState<PostResource[]>([mockPost]);
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
            selectedResource: "posts",
            sendRequest,
            setData: jest.fn(),
            setSelectedResource: jest.fn(),
          }}
        >
          {data.map((post) => (
            <Post key={post.id} item={post} />
          ))}
        </ResourcesContext.Provider>
      );
    };

    render(<TestWrapper />);

    fireEvent.click(screen.getByText("Edit post"));

    const titleInput = screen.getByPlaceholderText("New title here");

    const bodyInput = screen.getByPlaceholderText("New body here");

    const newTitle = "Updated Post Title";

    const newBody = "This is the updated body.";

    fireEvent.change(titleInput, { target: { value: newTitle } });

    fireEvent.change(bodyInput, { target: { value: newBody } });

    fireEvent.click(screen.getByText("Finish"));

    expect(await screen.findByText(newTitle)).toBeInTheDocument();

    expect(screen.getByText(newBody)).toBeInTheDocument();

    expect(screen.queryByText("Test Post Title")).not.toBeInTheDocument();
  });
});

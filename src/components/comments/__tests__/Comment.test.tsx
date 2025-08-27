import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Comment from "../Comment";
import { ResourcesContext } from "../../../context/ResourcesContext";
import { type CommentResource } from "../../../utils/utils";
import { HTTPMethods } from "../../../hooks/useRequest";

const mockSendRequest = jest.fn();

const MockProvider: React.FC<{
  children: React.ReactNode;
  resourceName?: string;
}> = ({ children, resourceName = "comments" }) => (
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

describe("Comment Component", () => {
  const mockComment: CommentResource = {
    id: 1,
    postId: 1,
    name: "Test Comment Name",
    email: "user@example.com",
    body: "This is the body of the test comment.",
  };

  beforeEach(() => {
    mockSendRequest.mockClear();
  });

  test("should render correctly", () => {
    render(
      <MockProvider resourceName="comments">
        <Comment item={mockComment} />
      </MockProvider>
    );

    expect(screen.getByText("Test Comment Name")).toBeInTheDocument();

    expect(
      screen.getByText("This is the body of the test comment.")
    ).toBeInTheDocument();

    expect(screen.getByText("Edit comment")).toBeInTheDocument();

    expect(screen.getByText("Delete comment")).toBeInTheDocument();
  });

  test("should be editable, update comment, and display new values", async () => {
    const TestWrapper = ({}) => {
      const [data, setData] = useState<CommentResource[]>([mockComment]);

      const [loading, setLoading] = useState(false);

      const sendRequest = jest.fn(async (options: any) => {
        setLoading(true);

        await new Promise((r) => setTimeout(r, 10));

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
            selectedResource: "comments",
            sendRequest,
            setData: jest.fn(),
            setSelectedResource: jest.fn(),
          }}
        >
          {data.map((comment) => (
            <Comment key={comment.id} item={comment} />
          ))}
        </ResourcesContext.Provider>
      );
    };

    render(<TestWrapper />);

    fireEvent.click(screen.getByText("Edit comment"));

    const nameInput = screen.getByPlaceholderText("New title here");

    const bodyInput = screen.getByPlaceholderText("New body here");

    const newName = "Updated Comment Name";

    const newBody = "This is the updated body of the comment.";

    fireEvent.change(nameInput, { target: { value: newName } });

    fireEvent.change(bodyInput, { target: { value: newBody } });

    fireEvent.click(screen.getByText("Finish"));

    expect(await screen.findByText(newName)).toBeInTheDocument();

    expect(screen.getByText(newBody)).toBeInTheDocument();

    expect(screen.queryByText("Test Comment Name")).not.toBeInTheDocument();
  });
});

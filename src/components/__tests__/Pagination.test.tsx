import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Pagination from "../Pagination";

describe("Pagination", () => {
  test("renders nothing when everything fits in one page", () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        itemsPerPage={20}
        onPageChange={jest.fn()}
        totalItems={20}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  test("renders one button per page and wraps them on narrow screens", () => {
    render(
      <Pagination
        currentPage={1}
        itemsPerPage={20}
        onPageChange={jest.fn()}
        totalItems={500}
      />
    );

    expect(screen.getByText("25")).toBeInTheDocument();

    // 25 page buttons overflow the viewport unless the container wraps
    expect(screen.getByText("Previous").parentElement).toHaveClass(
      "flex-wrap"
    );
  });

  test("disables Previous on the first page and Next on the last page", () => {
    const { rerender } = render(
      <Pagination
        currentPage={1}
        itemsPerPage={20}
        onPageChange={jest.fn()}
        totalItems={60}
      />
    );

    expect(screen.getByText("Previous")).toBeDisabled();
    expect(screen.getByText("Next")).toBeEnabled();

    rerender(
      <Pagination
        currentPage={3}
        itemsPerPage={20}
        onPageChange={jest.fn()}
        totalItems={60}
      />
    );

    expect(screen.getByText("Previous")).toBeEnabled();
    expect(screen.getByText("Next")).toBeDisabled();
  });

  test("calls onPageChange with the requested page", () => {
    const onPageChange = jest.fn();

    render(
      <Pagination
        currentPage={2}
        itemsPerPage={20}
        onPageChange={onPageChange}
        totalItems={100}
      />
    );

    fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByText("Previous"));
    fireEvent.click(screen.getByText("5"));

    expect(onPageChange.mock.calls).toEqual([[3], [1], [5]]);
  });
});

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ResourcesContext } from "../../context/ResourcesContext";
import { HTTPMethods } from "../../hooks/useRequest";
import ResourcesDropdown from "../ResourcesDropdown";

const mockSendRequest = jest.fn();
const mockSetSelectedResource = jest.fn();

const renderDropdown = (selectedResource = "") =>
  render(
    <ResourcesContext.Provider
      value={{
        data: [],
        loading: false,
        selectedResource,
        sendRequest: mockSendRequest,
        setData: jest.fn(),
        setSelectedResource: mockSetSelectedResource,
      }}
    >
      <ResourcesDropdown />
    </ResourcesContext.Provider>
  );

const openMenu = () => fireEvent.click(screen.getByText("Select Resource"));

const getSearchInput = () =>
  document.getElementById("resource-search-input") as HTMLInputElement;

const isMenuOpen = () =>
  document.querySelector(".dropdown-menu.show") !== null;

describe("ResourcesDropdown", () => {
  beforeEach(() => {
    mockSendRequest.mockClear();
    mockSetSelectedResource.mockClear();
  });

  test("filters the resources by the typed text", () => {
    renderDropdown();
    openMenu();

    fireEvent.change(getSearchInput(), { target: { value: "to" } });

    expect(screen.getByText("TODOS")).toBeInTheDocument();
    expect(screen.queryByText("POSTS")).not.toBeInTheDocument();
    expect(screen.queryByText("COMMENTS")).not.toBeInTheDocument();
  });

  test("closes the menu and fetches the resource when an item is selected", async () => {
    renderDropdown();
    openMenu();

    expect(isMenuOpen()).toBe(true);

    fireEvent.click(screen.getByText("POSTS"));

    expect(mockSetSelectedResource).toHaveBeenCalledWith("posts");
    expect(mockSendRequest).toHaveBeenCalledWith({
      method: HTTPMethods.GET,
      resourceName: "posts",
    });

    await waitFor(() => expect(isMenuOpen()).toBe(false));
  });

  test("clears the filter when the menu is reopened after a selection", async () => {
    renderDropdown();
    openMenu();

    fireEvent.change(getSearchInput(), { target: { value: "to" } });
    fireEvent.click(screen.getByText("TODOS"));

    await waitFor(() => expect(isMenuOpen()).toBe(false));

    openMenu();

    expect(getSearchInput()).toHaveValue("");
    expect(screen.getByText("COMMENTS")).toBeInTheDocument();
    expect(screen.getByText("POSTS")).toBeInTheDocument();
    expect(screen.getByText("TODOS")).toBeInTheDocument();
  });

  test("clears the filter when the menu is closed without a selection", async () => {
    renderDropdown();
    openMenu();

    fireEvent.change(getSearchInput(), { target: { value: "com" } });

    expect(screen.queryByText("TODOS")).not.toBeInTheDocument();

    // Clicking the trigger again toggles the menu closed
    fireEvent.click(screen.getByText("Select Resource"));

    await waitFor(() => expect(isMenuOpen()).toBe(false));

    openMenu();

    expect(getSearchInput()).toHaveValue("");
    expect(screen.getByText("TODOS")).toBeInTheDocument();
  });
});

import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import clayIconsSpritemap from "@clayui/css/lib/images/icons/icons.svg";
import { ResourcesContext } from "../../context/ResourcesContext";
import ResourcesApp from "../ResourcesApp";

describe("ResourcesApp", () => {
  test("uses Clay's bundled icon spritemap instead of a hardcoded root path", () => {
    const { container } = render(
      <ResourcesContext.Provider
        value={{
          data: [],
          loading: false,
          selectedResource: "",
          sendRequest: jest.fn(),
          setData: jest.fn(),
          setSelectedResource: jest.fn(),
        }}
      >
        <ResourcesApp />
      </ResourcesContext.Provider>
    );

    const caretIcon = container.querySelector(
      "button.dropdown-toggle svg use"
    );

    expect(caretIcon).toBeInTheDocument();
    expect(caretIcon).toHaveAttribute(
      "href",
      `${clayIconsSpritemap}#caret-bottom`
    );
  });
});

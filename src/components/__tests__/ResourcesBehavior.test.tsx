import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ResourcesProvider } from "../providers/ResourcesProvider";
import ResourcesApp from "../ResourcesApp";
import { type TodoResource } from "../../utils/utils";

/* Integration tests with the real provider and useRequest hook: only the
network (fetch) is mocked */

const TOTAL_TODOS = 45; // 3 pages of 20 items (20 + 20 + 5)

const todos: TodoResource[] = Array.from({ length: TOTAL_TODOS }, (_, i) => ({
  id: i + 1,
  userId: 1,
  title: `Todo ${i + 1}`,
  completed: false,
}));

const posts = [{ id: 1, userId: 1, title: "Post 1", body: "Post body" }];

type Deferred = { resolve: () => void };

let pendingRequests: Deferred[] = [];
let holdRequests = false;

const jsonResponse = (body: unknown) =>
  ({ ok: true, status: 200, json: async () => body }) as Response;

const fetchMock = jest.fn(async (url: string, options: RequestInit) => {
  if (holdRequests) {
    await new Promise<void>((resolve) => pendingRequests.push({ resolve }));
  }

  const body = options.body ? JSON.parse(options.body as string) : {};
  const id = Number(url.split("/").pop());

  switch (options.method) {
    case "GET":
      return jsonResponse(url.endsWith("/posts") ? posts : todos);
    case "POST":
      return jsonResponse({ ...body, id: 201 });
    case "PATCH":
      return jsonResponse({ ...todos[id - 1], ...body });
    default:
      return jsonResponse({});
  }
});

const releaseRequests = () => {
  pendingRequests.forEach(({ resolve }) => resolve());
  pendingRequests = [];
};

const renderApp = () =>
  render(
    <ResourcesProvider>
      <ResourcesApp />
    </ResourcesProvider>
  );

const selectResource = async (name: string, firstTitle: string) => {
  fireEvent.click(document.querySelector("button.dropdown-toggle")!);
  fireEvent.click(screen.getByText(name));

  await screen.findByText(firstTitle);
};

const goToPage = (page: number) =>
  fireEvent.click(screen.getByText(String(page), { selector: "button" }));

const getCurrentPage = () =>
  document.querySelector(".btn-primary.m-1")?.textContent;

describe("ResourcesApp behavior", () => {
  beforeEach(() => {
    holdRequests = false;
    pendingRequests = [];
    fetchMock.mockClear();
    globalThis.fetch = fetchMock as unknown as typeof fetch;
  });

  test("keeps the list mounted while an item is being updated", async () => {
    renderApp();
    await selectResource("TODOS", "Todo 1");

    holdRequests = true;

    fireEvent.click(screen.getAllByText("Complete todo")[0]);

    await waitFor(() => expect(pendingRequests).toHaveLength(1));

    // While the PATCH is in flight the cards are still there, just busy
    expect(screen.getByText("Todo 1")).toBeInTheDocument();
    expect(screen.getByTestId("resources-list")).toHaveAttribute(
      "aria-busy",
      "true"
    );
    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    releaseRequests();

    await waitFor(() =>
      expect(screen.getByTestId("resources-list")).toHaveAttribute(
        "aria-busy",
        "false"
      )
    );
    expect(screen.getByText("Set back to incomplete")).toBeInTheDocument();
  });

  test("keeps the edit form open while the update request is pending", async () => {
    renderApp();
    await selectResource("TODOS", "Todo 1");

    fireEvent.click(screen.getAllByText("Edit todo")[0]);
    fireEvent.change(document.getElementById("edit-item-title-1")!, {
      target: { value: "Edited todo" },
    });

    holdRequests = true;
    fireEvent.click(screen.getByText("Finish"));

    await waitFor(() => expect(pendingRequests).toHaveLength(1));

    expect(document.getElementById("edit-item-title-1")).toHaveValue(
      "Edited todo"
    );

    releaseRequests();

    expect(await screen.findByText("Edited todo")).toBeInTheDocument();
    expect(screen.queryByText("Finish")).not.toBeInTheDocument();
  });

  test("stays on the current page after editing an item", async () => {
    renderApp();
    await selectResource("TODOS", "Todo 1");

    goToPage(2);

    expect(await screen.findByText("Todo 21")).toBeInTheDocument();

    fireEvent.click(screen.getAllByText("Complete todo")[0]);

    await waitFor(() =>
      expect(screen.getAllByText("Set back to incomplete")).toHaveLength(1)
    );

    expect(getCurrentPage()).toBe("2");
    expect(screen.getByText("Todo 21")).toBeInTheDocument();
    expect(screen.queryByText("Todo 1")).not.toBeInTheDocument();
  });

  test("stays on the current page after deleting an item", async () => {
    renderApp();
    await selectResource("TODOS", "Todo 1");

    goToPage(2);
    await screen.findByText("Todo 21");

    fireEvent.click(screen.getAllByText("Delete todo")[0]);
    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() =>
      expect(screen.queryByText("Todo 21")).not.toBeInTheDocument()
    );

    expect(getCurrentPage()).toBe("2");
    expect(screen.getByText("Todo 22")).toBeInTheDocument();
  });

  test("moves to the previous page when the last page becomes empty", async () => {
    renderApp();
    await selectResource("TODOS", "Todo 1");

    goToPage(3);
    await screen.findByText("Todo 41");

    for (let i = 41; i <= TOTAL_TODOS; i++) {
      fireEvent.click(screen.getAllByText("Delete todo")[0]);
      fireEvent.click(screen.getByText("Confirm"));

      await waitFor(() =>
        expect(screen.queryByText(`Todo ${i}`)).not.toBeInTheDocument()
      );
    }

    expect(await screen.findByText("Todo 21")).toBeInTheDocument();
    expect(getCurrentPage()).toBe("2");
    expect(screen.queryByText("3", { selector: "button" })).toBeNull();
  });

  test("goes back to the first page when a new item is added", async () => {
    renderApp();
    await selectResource("TODOS", "Todo 1");

    goToPage(3);
    await screen.findByText("Todo 41");

    fireEvent.change(document.getElementById("add-todo-input")!, {
      target: { value: "Brand new todo" },
    });
    fireEvent.click(screen.getByText("Add item"));

    expect(await screen.findByText("Brand new todo")).toBeInTheDocument();
    expect(getCurrentPage()).toBe("1");
  });

  test("resets to the first page and drops old cards when switching resources", async () => {
    renderApp();
    await selectResource("TODOS", "Todo 1");

    goToPage(2);
    await screen.findByText("Todo 21");

    holdRequests = true;

    fireEvent.click(document.querySelector("button.dropdown-toggle")!);
    fireEvent.click(screen.getByText("POSTS"));

    await waitFor(() => expect(pendingRequests).toHaveLength(1));

    // While the new resource loads only the spinner is shown
    expect(screen.queryByText("Todo 21")).not.toBeInTheDocument();
    expect(screen.queryByTestId("resources-list")).not.toBeInTheDocument();
    expect(document.querySelector(".loading-animation")).toBeInTheDocument();

    releaseRequests();

    expect(await screen.findByText("Post 1")).toBeInTheDocument();

    // Back to a multi-page resource, starting from page 1 again
    holdRequests = false;
    await selectResource("TODOS", "Todo 1");

    expect(getCurrentPage()).toBe("1");
  });
});

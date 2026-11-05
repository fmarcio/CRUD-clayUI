import React, { useState } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ResourcesContext } from "../../context/ResourcesContext";
import { HTTPMethods, type SendRequestOptions } from "../../hooks/useRequest";
import { type ApiResourceItem } from "../../utils/utils";
import ResourceItem from "../ResourceItem";

const cases: {
  resourceName: string;
  deleteLabel: string;
  item: ApiResourceItem;
}[] = [
  {
    resourceName: "todos",
    deleteLabel: "Delete todo",
    item: { id: 1, userId: 1, title: "Todo to delete", completed: false },
  },
  {
    resourceName: "posts",
    deleteLabel: "Delete post",
    item: { id: 2, userId: 1, title: "Post to delete", body: "Post body" },
  },
  {
    resourceName: "comments",
    deleteLabel: "Delete comment",
    item: {
      id: 3,
      postId: 1,
      name: "Comment author",
      email: "user@example.com",
      body: "Comment to delete",
    },
  },
];

/* Mirrors the real app: while a request is loading the list is unmounted,
and a successful DELETE removes the item from the data */
const RealisticList: React.FC<{
  initialItem: ApiResourceItem;
  resourceName: string;
  onRequest: (options: SendRequestOptions) => void;
}> = ({ initialItem, resourceName, onRequest }) => {
  const [data, setData] = useState<ApiResourceItem[]>([initialItem]);
  const [loading, setLoading] = useState(false);

  const sendRequest = async (options: SendRequestOptions) => {
    onRequest(options);
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 50));

    if (options.method === HTTPMethods.DELETE) {
      setData((prev) => prev.filter((item) => item.id !== options.id));
    }

    setLoading(false);
  };

  return (
    <ResourcesContext.Provider
      value={{
        data,
        loading,
        selectedResource: resourceName,
        sendRequest,
        setData,
        setSelectedResource: jest.fn(),
      }}
    >
      {loading && <span role="status" />}

      {!loading &&
        data.map((item) => <ResourceItem data={item} key={item.id} />)}

      {!loading && data.length === 0 && <p>No items</p>}
    </ResourcesContext.Provider>
  );
};

describe.each(cases)(
  "Deleting $resourceName",
  ({ resourceName, deleteLabel, item }) => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    /* Must run first for each component: React 16 logs the
    "unmounted component" warning only once per component type */
    test("does not update state after the card is unmounted", async () => {
      render(
        <RealisticList
          initialItem={item}
          onRequest={jest.fn()}
          resourceName={resourceName}
        />
      );

      fireEvent.click(screen.getByText(deleteLabel));
      fireEvent.click(screen.getByText("Confirm"));

      await screen.findByText("No items");

      // Give any pending post-await state update a chance to run
      await waitFor(() => new Promise((resolve) => setTimeout(resolve, 20)));

      const unmountedWarnings = consoleErrorSpy.mock.calls.filter((args) =>
        String(args[0]).includes("unmounted component")
      );

      expect(unmountedWarnings).toHaveLength(0);
    });

    test("closes the modal and sends a DELETE request on confirm", async () => {
      const onRequest = jest.fn();

      render(
        <RealisticList
          initialItem={item}
          onRequest={onRequest}
          resourceName={resourceName}
        />
      );

      fireEvent.click(screen.getByText(deleteLabel));

      expect(screen.getByText("Confirm")).toBeInTheDocument();

      fireEvent.click(screen.getByText("Confirm"));

      expect(screen.queryByText("Confirm")).not.toBeInTheDocument();

      expect(onRequest).toHaveBeenCalledWith({
        id: item.id,
        method: HTTPMethods.DELETE,
        resourceName,
      });

      expect(await screen.findByText("No items")).toBeInTheDocument();
    });

    test("keeps the item when the deletion is cancelled", () => {
      const onRequest = jest.fn();

      render(
        <RealisticList
          initialItem={item}
          onRequest={onRequest}
          resourceName={resourceName}
        />
      );

      fireEvent.click(screen.getByText(deleteLabel));
      fireEvent.click(screen.getByText("Cancel"));

      expect(screen.queryByText("Confirm")).not.toBeInTheDocument();
      expect(screen.getByText(deleteLabel)).toBeInTheDocument();
      expect(onRequest).not.toHaveBeenCalled();
    });
  }
);

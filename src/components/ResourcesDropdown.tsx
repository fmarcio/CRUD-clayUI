import { Provider } from "@clayui/core";
import DropDown from "@clayui/drop-down";
import Button from "@clayui/button";

import "@clayui/css/lib/css/atlas.css";
import { useState } from "react";
import type { ApiResourceItem } from "../utils/utils";
import ResourceItem from "./ResourceItem";
import Form, { ClayInput } from "@clayui/form";

type Resource = {
  id: number;
  name: string;
};

type ResourceGroup = {
  name: string;
  resources: Resource[];
};

const items: ResourceGroup[] = [
  {
    name: "Resources",
    resources: [
      { id: 1, name: "posts" },
      { id: 2, name: "comments" },
      { id: 3, name: "albums" },
      { id: 4, name: "photos" },
      { id: 5, name: "todos" },
      { id: 6, name: "users" },
    ],
  },
];

export default function ResourcesDropdown() {
  const [data, setData] = useState<ApiResourceItem[] | null>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [value, setValue] = useState("");

  const fetchData = async (resourceName: string) => {
    setLoading(true);
    try {
      const data = await fetch(
        `https://jsonplaceholder.typicode.com/${resourceName}`
      ).then((response) => response.json());

      if (data) {
        setData(data);
      }
    } catch (error) {
      setError(`ERROR FETCHING DATA: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const postData = async (
    body: object,
    resourceName: string,
    title: string
  ) => {
    setLoading(true);

    try {
      const post = await fetch(
        `https://jsonplaceholder.typicode.com/${resourceName}`,
        {
          body: JSON.stringify({ title, ...body }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          method: "POST",
        }
      );

      // The push method returns the new length of the array, not the array itself.
      // We need to update the state with a new array that includes the new post.

      if (data) {
        const newPost = await post.json();

        setData([newPost as ApiResourceItem, ...data]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onDeleteItem = (idToDelete: number) => {
    setData((prevData) => {
      if (!prevData) {
        return null;
      }

      return prevData.filter((item) => item.id !== idToDelete);
    });
  };

  const hasResources = !loading && !error && data && data?.length > 0;

  return (
    <Provider spritemap="/icons.svg">
      <div className="container-fluid">
        <div className="d-flex justify-content-center align-items-center p-4">
          <DropDown
            className="mr-3"
            filterKey="name"
            trigger={
              <Button displayType="primary">
                {selectedItem || "Select Resource"}
              </Button>
            }
            triggerIcon="caret-bottom"
          >
            <DropDown.Search placeholder="Type to filter" />

            <DropDown.ItemList items={items}>
              {({ name, resources }: ResourceGroup) => (
                <DropDown.Group header={name} items={resources} key={name}>
                  {({ id, name: selectedResource }: Resource) => (
                    <DropDown.Item
                      key={id}
                      onClick={() => {
                        setSelectedItem(selectedResource);

                        fetchData(selectedResource);
                      }}
                    >
                      {selectedResource.toUpperCase()}
                    </DropDown.Item>
                  )}
                </DropDown.Group>
              )}
            </DropDown.ItemList>
          </DropDown>

          <Button
            className="me-3"
            onClick={() => {
              setData([]);
              setSelectedItem("");
            }}
            displayType="secondary"
          >
            Clear Data
          </Button>

          {selectedItem === "todos" && (
            <Form.Group className="d-flex justify-content-center align-items-center mb-0 p-4">
              <ClayInput
                id="basicInputText"
                placeholder="Add new todo here.."
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />

              <Button
                className="ml-2 px-3"
                displayType="secondary"
                onClick={() => {
                  postData(
                    {
                      completed: false,
                      userId: 1,
                    },
                    "todos",
                    value
                  );

                  setValue("");
                }}
                type="submit"
              >
                {"Add todo"}
              </Button>
            </Form.Group>
          )}
        </div>
      </div>

      {loading && <p className="text-center">Loading {selectedItem}</p>}

      {error && !loading && <p className="text-center text-danger">{error}</p>}

      {hasResources && (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
          {data.map((items) => (
            <div key={items.id} className="col">
              <ResourceItem data={items} onDelete={onDeleteItem} />
            </div>
          ))}
        </div>
      )}
    </Provider>
  );
}

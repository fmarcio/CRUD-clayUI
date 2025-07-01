import { Provider } from "@clayui/core";
import DropDown from "@clayui/drop-down";
import Button from "@clayui/button";

import "@clayui/css/lib/css/atlas.css";
import { useState } from "react";
import ResourceItem from "./ResourceItem";
import Form, { ClayInput } from "@clayui/form";
import { useRequestContext } from "../hooks/useRequestContext";

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

const ResourcesManager = () => {
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [value, setValue] = useState("");

  const { loading, data, setData, sendRequest } = useRequestContext();

  const hasResources = !loading && data && data?.length > 0;

  return (
    <>
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

                        sendRequest({
                          method: "GET",
                          resourceName: selectedResource,
                        });
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
                  sendRequest({
                    method: "POST",
                    resourceName: "todos",
                    body: {
                      title: value,
                      completed: false,
                    },
                  });

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

      {hasResources && (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
          {data.map((items) => (
            <div key={items.id} className="col">
              <ResourceItem data={items} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default function ResourcesDropdown() {
  return (
    <Provider spritemap="/icons.svg">
      <ResourcesManager />
    </Provider>
  );
}

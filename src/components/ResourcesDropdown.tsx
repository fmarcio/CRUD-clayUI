import Button from "@clayui/button";
import DropDown from "@clayui/drop-down";
import { useState } from "react";
import { HTTPMethods } from "../hooks/useRequest";
import ItemInput from "./ItemInput";
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

const ResourcesDropdown: React.FC = () => {
  const [alert, setAlert] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<string>("");

  const { sendRequest } = useRequestContext();

  return (
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
          <DropDown.Search
            id="resource-search-input"
            placeholder="Type to filter"
          />

          <DropDown.ItemList items={items}>
            {({ name, resources }: ResourceGroup) => (
              <DropDown.Group header={name} items={resources} key={name}>
                {({ id, name: selectedResource }: Resource) => (
                  <DropDown.Item
                    key={id}
                    onClick={() => {
                      setSelectedItem(selectedResource);

                      sendRequest({
                        method: HTTPMethods.GET,
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

        {selectedItem && (
          <ItemInput
            alert={alert}
            resourceName={selectedItem}
            setSelectedItem={setSelectedItem}
            setAlert={setAlert}
          />
        )}
      </div>
    </div>
  );
};

export default ResourcesDropdown;

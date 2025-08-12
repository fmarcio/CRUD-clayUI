import Button from "@clayui/button";
import DropDown from "@clayui/drop-down";
import { useState } from "react";
import { HTTPMethods } from "../hooks/useRequest";
import ItemInput from "./ItemInput";
import {
  resourcesNames,
  type Resource,
  type ResourceGroup,
} from "../utils/utils";
import { useResourcesContext } from "../hooks/useResourcesContext";

const ResourcesDropdown: React.FC = () => {
  const [alert, setAlert] = useState<boolean>(false);

  const { sendRequest, selectedResource, setSelectedResource } =
    useResourcesContext();

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-center align-items-center p-4">
        <DropDown
          className="mr-3"
          filterKey="name"
          trigger={
            <Button displayType="primary">
              {selectedResource || "Select Resource"}
            </Button>
          }
          triggerIcon="caret-bottom"
        >
          <DropDown.Search
            id="resource-search-input"
            placeholder="Type to filter"
          />

          <DropDown.ItemList items={resourcesNames}>
            {({ name, resources }: ResourceGroup) => (
              <DropDown.Group header={name} items={resources} key={name}>
                {({ id, name: selectedResource }: Resource) => (
                  <DropDown.Item
                    key={id}
                    onClick={() => {
                      setSelectedResource(selectedResource);

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

        {selectedResource && (
          <ItemInput
            alert={alert}
            resourceName={selectedResource}
            setAlert={setAlert}
          />
        )}
      </div>
    </div>
  );
};

export default ResourcesDropdown;

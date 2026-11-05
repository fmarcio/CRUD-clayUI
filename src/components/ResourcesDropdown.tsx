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
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  /* Clay's DropDown.Search only filters while uncontrolled, so it is remounted
  (fresh empty value) every time the menu closes to reset the filter */
  const [searchKey, setSearchKey] = useState<number>(0);

  const handleMenuActiveChange = (active: boolean) => {
    setIsMenuOpen(active);

    if (!active) {
      setSearchKey((key) => key + 1);
    }
  };

  const { sendRequest, selectedResource, setSelectedResource } =
    useResourcesContext();

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-center align-items-center p-4">
        <DropDown
          active={isMenuOpen}
          className="mr-3"
          filterKey="name"
          onActiveChange={handleMenuActiveChange}
          trigger={
            <Button displayType="primary">
              {selectedResource || "Select Resource"}
            </Button>
          }
          triggerIcon="caret-bottom"
        >
          <DropDown.Search
            id="resource-search-input"
            key={searchKey}
            placeholder="Type to filter"
          />

          <DropDown.ItemList items={resourcesNames}>
            {({ name, resources }: ResourceGroup) => (
              <DropDown.Group header={name} items={resources} key={name}>
                {({ id, name: selectedResource }: Resource) => (
                  <DropDown.Item
                    key={id}
                    onClick={() => {
                      handleMenuActiveChange(false);
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

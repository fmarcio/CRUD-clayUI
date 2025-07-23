import { Provider } from "@clayui/core";
import "@clayui/css/lib/css/atlas.css";
import ResourceItem from "./ResourceItem";
import { useRequestContext } from "../hooks/useRequestContext";
import LoadingIndicator from "@clayui/loading-indicator";
import ResourcesDropdown from "./ResourcesDropdown";
import EmptyState from "@clayui/empty-state";

const ResourcesManager: React.FC = () => {
  const { loading, data } = useRequestContext();

  const hasResources = !loading && data && data?.length > 0;

  return (
    <>
      <ResourcesDropdown />

      {loading && <LoadingIndicator displayType="secondary" size="md" />}

      {hasResources && (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
          {data.map((items) => (
            <div key={items.id} className="col">
              <ResourceItem data={items} />
            </div>
          ))}
        </div>
      )}

      {!hasResources && !loading && (
        <div className="p-4">
          <EmptyState
            description="Please select a resource to view it's data"
            imgProps={{
              alt: "Alternative Text",
              title: "No resources selected",
            }}
            imgSrc="https://clayui.com/images/success_state.svg"
            imgSrcReducedMotion="https://clayui.com/images/success_state_reduced_motion.svg"
            title="No resources selected"
          />
        </div>
      )}
    </>
  );
};

export default function ResourcesApp() {
  return (
    <Provider spritemap="/icons.svg">
      <ResourcesManager />
    </Provider>
  );
}

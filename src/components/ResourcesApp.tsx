import { useState, useEffect, useMemo } from "react";
import { Provider } from "@clayui/core";
import "@clayui/css/lib/css/atlas.css";
import ResourceItem from "./ResourceItem";
import LoadingIndicator from "@clayui/loading-indicator";
import ResourcesDropdown from "./ResourcesDropdown";
import EmptyState from "@clayui/empty-state";
import Pagination from "./Pagination";
import { useResourcesContext } from "../hooks/useResourcesContext";

const ITEMS_PER_PAGE = 20;

const ResourcesManager: React.FC = () => {
  const { loading, data } = useResourcesContext();
  const [currentPage, setCurrentPage] = useState(1);

  const hasResources = !loading && data && data.length > 0;

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const paginatedData = useMemo(() => {
    if (!data) return [];

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return data.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [data, currentPage]);

  return (
    <>
      <ResourcesDropdown />

      {loading && <LoadingIndicator displayType="secondary" size="md" />}

      {hasResources && (
        <>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
            {paginatedData.map((item) => (
              <div key={item.id} className="col">
                <ResourceItem data={item} />
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={data.length}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      )}

      {!hasResources && !loading && (
        <div className="p-4">
          <EmptyState
            description="Please select a resource to view its data"
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

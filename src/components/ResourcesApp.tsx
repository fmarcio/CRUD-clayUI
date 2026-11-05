import { useState, useEffect, useMemo, useRef } from "react";
import { Provider } from "@clayui/core";
import "@clayui/css/lib/css/atlas.css";
// Vite resolves this to a base-aware URL in dev and production builds
import spritemap from "@clayui/css/lib/images/icons/icons.svg";
import ResourceItem from "./ResourceItem";
import LoadingIndicator from "@clayui/loading-indicator";
import ResourcesDropdown from "./ResourcesDropdown";
import EmptyState from "@clayui/empty-state";
import Pagination from "./Pagination";
import { useResourcesContext } from "../hooks/useResourcesContext";

const ITEMS_PER_PAGE = 20;

const ResourcesManager: React.FC = () => {
  const { data, loading, selectedResource } = useResourcesContext();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const previousDataLength = useRef<number>(data.length);

  /* The list stays mounted while an item is being changed (PATCH, POST,
  DELETE), so cards keep their state and the user keeps their page */
  const hasResources = data.length > 0;
  const isUpdating = loading && hasResources;

  const totalPages = Math.max(1, Math.ceil(data.length / ITEMS_PER_PAGE));

  // Deleting the last items of the last page must not leave an empty page
  const page = Math.min(currentPage, totalPages);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedResource]);

  useEffect(() => {
    // New items are added to the top of the list, so show the first page
    if (data.length > previousDataLength.current) {
      setCurrentPage(1);
    }

    previousDataLength.current = data.length;
  }, [data.length]);

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;

    return data.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [data, page]);

  return (
    <>
      <ResourcesDropdown />

      {loading && !hasResources && (
        <LoadingIndicator displayType="secondary" size="md" />
      )}

      {hasResources && (
        <>
          <div
            aria-busy={isUpdating}
            className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3"
            data-testid="resources-list"
            style={{
              opacity: isUpdating ? 0.6 : 1,
              pointerEvents: isUpdating ? "none" : "auto",
              transition: "opacity 150ms",
            }}
          >
            {paginatedData.map((item) => (
              <div key={item.id} className="col">
                <ResourceItem data={item} />
              </div>
            ))}
          </div>

          <Pagination
            currentPage={page}
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
    <Provider spritemap={spritemap}>
      <ResourcesManager />
    </Provider>
  );
}

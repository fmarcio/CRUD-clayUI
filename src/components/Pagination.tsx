import React from "react";
import Button from "@clayui/button";

interface IPaginationProps {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<IPaginationProps> = ({
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="d-flex justify-content-center align-items-center p-4">
      <Button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        {"Previous"}
      </Button>

      {pages.map((page) => (
        <Button
          className="m-1"
          displayType={page === currentPage ? "primary" : "secondary"}
          key={page}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      <Button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        {"Next"}
      </Button>
    </div>
  );
};

export default Pagination;

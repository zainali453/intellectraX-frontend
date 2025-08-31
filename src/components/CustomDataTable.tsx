import React from "react";

interface Column {
  key: string;
  title: string;
  render?: (value: any, record: any) => React.ReactNode;
}

interface CustomDatatableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
}

const CustomDataTable: React.FC<CustomDatatableProps> = ({
  columns,
  data,
  loading = false,
}) => {
  // Helper function to get nested object value using dot notation
  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  };

  // Enhanced skeleton loading component with pulse effect
  const SkeletonItem = ({
    className,
    variant = "default",
  }: {
    className: string;
    variant?: "default" | "rounded" | "circle";
  }) => {
    const baseClasses =
      "animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200";
    const variantClasses = {
      default: "rounded",
      rounded: "rounded-md",
      circle: "rounded-full",
    };

    return (
      <div
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      />
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg overflow-hidden border-t-1 border-[#E8E8E8]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#E8E8E8]">
            {/* Skeleton Header */}
            <thead className="bg-[#F2F2F280] border-x-1 border-[#E8E8E8]">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <SkeletonItem className="h-3 w-16" />
                  </th>
                ))}
              </tr>
            </thead>
            {/* Skeleton Body */}
            <tbody className="bg-white divide-y divide-gray-200">
              {[...Array(7)].map((_, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {columns.map((column, colIndex) => (
                    <td
                      key={`${rowIndex}-${colIndex}`}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {/* Different skeleton patterns based on column type */}
                      {column.key === "dateTime" && (
                        <div className="space-y-2">
                          <SkeletonItem className="h-3 w-28" />
                          <SkeletonItem className="h-2 w-20" />
                        </div>
                      )}
                      {column.key === "name" && (
                        <SkeletonItem className="h-4 w-24" />
                      )}
                      {column.key === "email" && (
                        <SkeletonItem className="h-3 w-32" />
                      )}
                      {column.key === "experienceBio" && (
                        <div className="space-y-2">
                          <SkeletonItem className="h-3 w-full max-w-xs" />
                          <SkeletonItem className="h-3 w-4/5 max-w-xs" />
                          <SkeletonItem className="h-3 w-3/5 max-w-xs" />
                        </div>
                      )}
                      {(column.key === "governmentId" ||
                        column.key === "degree") && (
                        <div className="flex items-center space-x-2">
                          <SkeletonItem className="h-4 w-4" variant="rounded" />
                          <SkeletonItem className="h-3 w-24" />
                        </div>
                      )}
                      {column.key === "actions" && (
                        <div className="flex items-center space-x-3">
                          <SkeletonItem className="h-8 w-8" variant="circle" />
                          <SkeletonItem className="h-8 w-8" variant="circle" />
                          <SkeletonItem className="h-8 w-8" variant="circle" />
                        </div>
                      )}
                      {/* Default skeleton for other columns */}
                      {![
                        "dateTime",
                        "name",
                        "email",
                        "experienceBio",
                        "governmentId",
                        "degree",
                        "actions",
                      ].includes(column.key) && (
                        <SkeletonItem className="h-4 w-16" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden border-t-1 border-[#E8E8E8] ">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#E8E8E8] scroll-optimized">
          <thead className="bg-[#F2F2F280] border-x-1 border-[#E8E8E8]">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No data available
                </td>
              </tr>
            ) : (
              data.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {column.render
                        ? column.render(
                            getNestedValue(record, column.key),
                            record
                          )
                        : getNestedValue(record, column.key)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomDataTable;

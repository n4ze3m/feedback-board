import { XCircleIcon } from "@heroicons/react/24/outline";
import React from "react";
import { api } from "../../../utils/api";
import { EmptyProject } from "../../Common/EmptyProject";

export const DashboardFeedbacks = () => {
  const {
    data: projects,
    status,
  } = api.project.getAll.useQuery();
  return (
    <>
      {status === "loading" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* create skelon loadinf */}
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              className="bg-white shadow overflow-hidden sm:rounded-lg"
              key={item}
            >
              <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  <div className="animate-pulse h-4 bg-gray-400 rounded w-3/4">
                  </div>
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}
      {status === "success" && projects.length === 0 &&
        <EmptyProject />}
      {status === "success" && projects.length > 0 &&
        (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {projects.map((project) => (
              <div
                className="bg-white shadow overflow-hidden sm:rounded-lg"
                key={project.id}
              >
                <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    <div className="h-4 rounded w-3/4">
                      {project.name}
                    </div>
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}

      {status === "error" && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon
                className="h-5 w-5 text-red-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Something went wrong
              </h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

import React from "react";

export const DashboardDetailsSettings = () => {
  return (
    <div>
      <form className="space-y-8 divide-y divide-gray-200">
        <div className="space-y-8 divide-y divide-gray-200">
          <div>
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Settings
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Update your project board settings and information.
              </p>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label
                  htmlFor="project"
                  className="block text-sm font-medium text-gray-700"
                >
                  Project Name
                </label>
                <div className="mt-1">
                  <input
                    id="project"
                    name="project"
                    required
                    type="text"
                    autoComplete="project"
                    placeholder="John Doe Inc."
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="sm:col-span-6">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    placeholder="In John Doe Inc. we do..."
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                    defaultValue={""}
                  />
                </div>
              </div>
              <div className="sm:col-span-4">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                    feedbackboard.vercel.app/
                  </span>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="username"
                    className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <fieldset>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="notification"
                          name="notification"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="notification"
                          className="font-medium text-gray-700"
                        >
                          Email Notifications
                        </label>
                        <p className="text-gray-500">
                          Get notified when someones posts a feedback, comment
                          or reply.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="upvote"
                          name="upvote"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="upvote"
                          className="font-medium text-gray-700"
                        >
                          Upvotes
                        </label>
                        <p className="text-gray-500">
                          Enable upvotes on your feedback posts.
                        </p>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="mt-3 inline-flex justify-center rounded-md border border-transparent bg-sky-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

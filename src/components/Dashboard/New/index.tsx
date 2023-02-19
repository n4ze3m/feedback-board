import { ArrowLongLeftIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useForm } from "@mantine/form";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { api } from "../../../utils/api";

export const NewProject = () => {
  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      username: "",
    },
  });

  const [errMessage, setErrMessage] = React.useState<string | null>(null);
  const router = useRouter()

  const {
    mutate: createProject,
    isLoading: isCreatingProject,
  } = api.project.create.useMutation({
    onError: (data) => {
      setErrMessage(data.message);
    },
    onSuccess: (data) => {
      router.push(`/dashboard/board/${data.id}`)
    }
  });

  return (
    <div className="container max-w-2xl mx-auto px-4">
      <form
        className="space-y-8 divide-y divide-gray-200"
        onSubmit={form.onSubmit((values) => {
          return createProject(values);
        })}
      >
        <div className="space-y-8 divide-y divide-gray-200">
          <div>
            <div>
              <Link
                href="/dashboard"
                className="inline-flex items-center border-b-2 border-transparent pt-4 pr-1 text-sm font-medium text-gray-500 hover:border-gray-200 hover:text-gray-700"
              >
                <ArrowLongLeftIcon
                  className="mr-3 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                Back to Dashboard
              </Link>
            </div>
            {errMessage && (
              <div className="rounded-md  bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <XCircleIcon
                      className="h-5 w-5 text-red-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {errMessage}
                    </h3>
                  </div>
                </div>
              </div>
            )}
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
                    {...form.getInputProps("name")}
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
                    {...form.getInputProps("description")}
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
                    {...form.getInputProps("username")}
                    id="username"
                    autoComplete="username"
                    className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-5">
          <button
            type="submit"
            disabled={isCreatingProject}
            className="w-full inline-flex justify-center rounded-md border border-transparent bg-sky-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          >
            {isCreatingProject
              ? (
                "Hold on..."
              )
              : (
                "Save"
              )}
          </button>
        </div>
      </form>
    </div>
  );
};

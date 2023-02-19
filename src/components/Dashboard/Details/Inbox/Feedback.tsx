import React from "react";
import { api } from "../../../../utils/api";
import { useRouter } from "next/router";
import { notification, Skeleton } from "antd";
import {
  CalendarIcon,
  ChatBubbleLeftEllipsisIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { useForm } from "@mantine/form";

export const FeedbackDetails = () => {
  const router = useRouter();
  const [feedbackStatus, setFeedbackStatus] = React.useState<string | null>();
  const {
    data: projectInfo,
    status,
  } = api.feedback.getFeedbackById.useQuery({
    projectId: router.query.id as string,
    feedbackId: router.query.fid as string,
  });

  const client = api.useContext();

  const {
    mutateAsync: changeStatus,
    isLoading: isChangingStatus,
  } = api.feedback.changeStatus.useMutation({
    onError(error) {
      notification.error({
        message: "Error",
        description: error.message,
      });
    },
    onSuccess: () => {
      client.feedback.getFeedbackById.refetch();
      notification.success({
        message: "Success",
        description: "Feedback status changed successfully",
      });
    },
  });

  return (
    <div>
      {status === "loading" && <Skeleton />}

      {status === "success" && (
        <main className="flex-1">
          <div className="py-8 xl:py-10">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 xl:grid xl:max-w-5xl xl:grid-cols-3">
              <div className="xl:col-span-2 xl:border-r xl:border-gray-200 xl:pr-8">
                <div>
                  <div>
                    <div className="md:flex md:items-center md:justify-between md:space-x-4 xl:border-b xl:pb-6">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                          {projectInfo?.title}
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                          opened by {projectInfo?.name || projectInfo?.email ||
                            "Anonymous"}
                          {" "}
                        </p>
                      </div>
                    </div>
                    <aside className="mt-8 xl:hidden">
                      <h2 className="sr-only">Details</h2>
                      <div className="space-y-5">
                        <div className="flex items-center space-x-2">
                          <ChevronUpIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          <span className="text-sm font-medium text-gray-900">
                            {`${projectInfo?.upVotes} upvotes`}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <ChatBubbleLeftEllipsisIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          <span className="text-sm font-medium text-gray-900">
                            4 comments
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CalendarIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          <span className="text-sm font-medium text-gray-900">
                            Created on{" "}
                            <time
                              dateTime={projectInfo?.createdAt.toDateString()}
                            >
                              {projectInfo?.createdAt.toDateString()}
                            </time>
                          </span>
                        </div>
                      </div>
                      <div className="mt-6 space-y-8 border-t border-b border-gray-200 py-6">
                        <div>
                          <h2 className="text-sm font-medium text-gray-500">
                            Tags
                          </h2>
                          <ul role="list" className="mt-2 leading-8">
                            <li className="inline">
                              <span className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5">
                                <div className="ml-3.5 text-sm font-medium text-gray-900">
                                  {projectInfo?.type.name}
                                </div>
                              </span>
                              {" "}
                            </li>
                          </ul>
                        </div>
                        <div>
                          <label
                            htmlFor="location"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Location
                          </label>
                          <select
                            id="status"
                            name="status"
                            placeholder="Select a status"
                            disabled={isChangingStatus}
                            onChange={async (e) => {
                              await changeStatus({
                                projectId: router.query.id as string,
                                feedbackId: router.query.fid as string,
                                status: e.target.value,
                              });
                              setFeedbackStatus(e.target.value);
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            value={projectInfo?.statusId || undefined}
                          >
                            {projectInfo.project_status.map((status) => (
                              <option key={status.id} value={status.id}>
                                {status.status}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </aside>
                    <div className="py-3 xl:pt-6 xl:pb-0">
                      <h2 className="sr-only">Description</h2>
                      <div className="prose max-w-none">
                        <p>
                          {projectInfo?.message}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <aside className="hidden xl:block xl:pl-8">
                <h2 className="sr-only">Details</h2>
                <div className="space-y-5">
                  <div className="flex items-center space-x-2">
                    <ChevronUpIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {`${projectInfo?.upVotes} upvotes`}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ChatBubbleLeftEllipsisIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      4 comments
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CalendarIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      Created on{" "}
                      <time dateTime={projectInfo?.createdAt.toDateString()}>
                        {projectInfo?.createdAt.toDateString()}
                      </time>
                    </span>
                  </div>
                </div>
                <div className="mt-6 space-y-8 border-t border-gray-200 py-6">
                  <div>
                    <h2 className="text-sm font-medium text-gray-500">Tags</h2>
                    <ul role="list" className="mt-2 leading-8">
                      <li className="inline">
                        <span className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5">
                          <div className="ml-3.5 text-sm font-medium text-gray-900">
                            {projectInfo?.type.name}
                          </div>
                        </span>
                        {" "}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      placeholder="Select a status"
                      disabled={isChangingStatus}
                      onChange={async (e) => {
                        await changeStatus({
                          projectId: router.query.id as string,
                          feedbackId: router.query.fid as string,
                          status: e.target.value,
                        });
                        setFeedbackStatus(e.target.value);
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      value={projectInfo?.statusId || undefined}
                    >
                      {projectInfo.project_status.map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

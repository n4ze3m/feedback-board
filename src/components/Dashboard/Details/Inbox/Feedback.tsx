import React from "react";
import { api } from "../../../../utils/api";
import { useRouter } from "next/router";
import { Empty, notification, Skeleton } from "antd";
import {
  CalendarIcon,
  ChatBubbleLeftEllipsisIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

import {
  CheckBadgeIcon
} from "@heroicons/react/24/solid"
import { useForm } from "@mantine/form";
import moment from "moment";

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

  const form = useForm({
    initialValues: {
      message: "",
      user: null,
      email: null,
    },
  });

  const {
    mutateAsync: createComment,
    isLoading: isCommentLoading,
  } = api.feedback.createAdminComment.useMutation({
    onSuccess: () => {
      client.feedback.getFeedbackById.invalidate({
        projectId: router.query.id as string,
        feedbackId: router.query.fid as string,
      });

      notification.success({
        message: "Comment created successfully",
      });

      form.reset();
    },
    onError: () => {
      notification.error({
        message: "Failed to create comment",
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
                            {`${projectInfo?.votes} votes`}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <ChatBubbleLeftEllipsisIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          <span className="text-sm font-medium text-gray-900">
                          {`${projectInfo?.comments.length} comments`}

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
                    <div className="py-3 xl:pt-6 xl:pb-0">
                      <h2 className="sr-only">Description</h2>
                      <div className="prose max-w-none">
                        <p>
                          {projectInfo?.message}
                        </p>
                      </div>
                    </div>
                  </div>
                  <section
                    aria-labelledby="comment-title"
                    className="mt-8 xl:mt-10"
                  >
                    <div>
                      <div className="divide-y divide-gray-200">
                        <div className="pb-4">
                          <h2
                            id="comment-title"
                            className="text-lg font-medium text-gray-900"
                          >
                            Comments
                          </h2>
                        </div>
                        <div className="pt-6">
                          <div className="flow-root">
                            <ul role="list" className="-mb-8">
                              {/* here */}
                              {projectInfo.comments.map((item, itemIdx) => (
                                <li key={item.id}>
                                  <div className="relative pb-8">
                                    {itemIdx !== projectInfo.comments.length - 1
                                      ? (
                                        <span
                                          className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                                          aria-hidden="true"
                                        />
                                      )
                                      : null}
                                    <div className="relative flex items-start space-x-3">
                                      <div className="relative">
                                        <img
                                          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-400 ring-8 ring-white"
                                          src={`https://api.dicebear.com/5.x/fun-emoji/svg?seed=${
                                            item?.name || "Anonymous"
                                          }`}
                                          alt=""
                                        />
                                        {item?.isAdmin && (
                                          <span className="absolute -bottom-0.5 -right-1 rounded-tl px-0.5 py-px">
                                            <CheckBadgeIcon
                                              className="h-5 w-5 text-blue-800"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        )}
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <div>
                                          <div className="text-sm">
                                            <span className="font-medium text-gray-900">
                                              {item?.name || "Anonymous"}
                                            </span>
                                          </div>
                                          <p className="mt-0.5 text-sm text-gray-500">
                                            {moment(item.createdAt).fromNow()}
                                          </p>
                                        </div>
                                        <div className="mt-2 text-sm text-gray-700">
                                          <p>{item.message}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))}
                              {projectInfo.comments.length === 0 && (
                                <Empty
                                  className="my-6"
                                  description="No comments"
                                />
                              )}
                            </ul>
                          </div>
                          <div className="mt-6">
                            <div className="flex space-x-3">
                              <div className="min-w-0 flex-1">
                                <form
                                  onSubmit={form.onSubmit((data) => {
                                    return createComment({
                                      ...data,
                                      publicId: router.query.id as string,
                                      feedbackId: router.query.fid as string,
                                    });
                                  })}
                                >
                                  <div>
                                    <label
                                      htmlFor="comment"
                                      className="sr-only"
                                    >
                                      Comment
                                    </label>
                                    <textarea
                                      id="comment"
                                      {...form.getInputProps("message")}
                                      name="comment"
                                      rows={3}
                                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-900 focus:ring-sky-900 sm:text-sm"
                                      placeholder="Leave a comment"
                                      defaultValue={""}
                                    />
                                  </div>
                                  <div className="mt-6 flex items-center justify-end space-x-4">
                                    <button
                                      type="submit"
                                      disabled={isCommentLoading}
                                      className="inline-flex items-center justify-center rounded-md border border-transparent bg-sky-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-900 focus:ring-offset-2"
                                    >
                                      {isCommentLoading
                                        ? (
                                          "Submitting..."
                                        )
                                        : (
                                          "Comment"
                                        )}
                                    </button>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
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
                      {`${projectInfo?.votes} votes`}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ChatBubbleLeftEllipsisIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <span className="text-sm font-medium text-gray-900">
                    {`${projectInfo?.comments.length} comments`}

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

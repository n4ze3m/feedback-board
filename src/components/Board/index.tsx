import {
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useForm } from "@mantine/form";
import { Modal, notification, Skeleton } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { api } from "../../utils/api";
import { getUserId } from "./utils/id";

export default function BoardBody() {
  const router = useRouter();

  const form = useForm({
    initialValues: {
      title: "",
      message: "",
      type: "",
      user: null,
      email: null,
    },
  });

  const [open, setOpen] = React.useState(false);

  const {
    data,
    status,
  } = api.feedback.getPubicFeedback.useQuery({
    publicId: router.query.id as string,
  }, {
    onError: () => {
      router.push("/");
    },
    onSuccess(data) {
      if (data) {
        if (data.types.length > 0) {
          //@ts-ignore
          form.setFieldValue("type", data.types[0].id);
        }
      }
    },
  });

  const client = api.useContext();

  const {
    mutate: createFeedback,
    isLoading: createFeedbackLoading,
  } = api.feedback.createPublicFeedback.useMutation({
    onSuccess: () => {
      client.feedback.getPubicFeedback.refetch();
      notification.success({
        message: "Feedback created successfully",
      });
      setOpen(false);
      form.reset();
    },
    onError: (err) => {
      notification.error({
        message: err.message,
      });
    },
  });

  const {
    mutate: createVote,
    isLoading: createVoteLoading,
  } = api.feedback.vote.useMutation({
    onSuccess: () => {
      client.feedback.getPubicFeedback.refetch();
      notification.success({
        message: "Vote created successfully",
      });
    },
    onError: () => {
      notification.error({
        message: "Something went wrong",
      });
    },
  });

  const EmptyState = (
    <div className="divide-y divide-gray-200">
      <div className="text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No Feedback
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Oh no! We haven't received any feedback yet.
        </p>
        <div className="mt-6">
          <button
            onClick={() => setOpen(true)}
            type="button"
            className="inline-flex items-center rounded-md border border-transparent bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          >
            <PlusIcon
              className="-ml-1 mr-2 h-5 w-5"
              aria-hidden="true"
            />
            Add Feedback
          </button>
        </div>
      </div>
    </div>
  );
  return (
    <>
      {status === "loading" && (
        <div className="px-3 py-4">
          <Skeleton />
        </div>
      )}

      {status === "success" && (
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2 lg:col-start-1">
            <section aria-labelledby="notes-title">
              <div className="bg-white  px-4 py-5 sm:overflow-hidden sm:rounded-lg">
                {data.feedbacks.length === 0 && EmptyState}
                {data.feedbacks.length > 0 && (
                  <ul
                    role="list"
                    className="divide-y divide-gray-200 border-b border-gray-200 mt-3"
                  >
                    {data.feedbacks.map((feedback) => (
                      <div
                        key={feedback.id}
                        className="bg-white py-5 px-4"
                        // className="flex mb-4 rounded bg-white divide-y divide-gray-200 border-b border-gray-200 mt-3"
                        id={feedback.id}
                      >
                        <div className="flex justify-between space-x-3">
                          {/* Vote section */}
                          {data.settings.allowVotes && (
                            <div className="flex-shrink-0 flex space-x-2 ">
                              <div className="w-10 py-3 text-center bg-gray-200 rounder-l">
                                <button
                                  disabled={createVoteLoading}
                                  onClick={() => {
                                    createVote({
                                      feedbackId: feedback.id,
                                      publicId: router.query.id as string,
                                      type: "up",
                                      userId: getUserId(),
                                    });
                                  }}
                                  className="w-6 mx-auto text-grey-400 rounder cursor hover:bg-gray-300 hover:text-red-500"
                                >
                                  <ChevronUpIcon
                                    className="text-blue-800 w-5 h-5"
                                    aria-hidden="true"
                                  />
                                </button>
                                <p className="font-medium">
                                  {createVoteLoading
                                    ? (
                                      <svg
                                        className="animate-spin ml-3 h-3 w-3 text-blue-800"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                      >
                                        <circle
                                          className="opacity-25"
                                          cx="12"
                                          cy="12"
                                          r="10"
                                          stroke="currentColor"
                                          strokeWidth="4"
                                        />
                                        <path
                                          className="opacity-75"
                                          fill="currentColor"
                                          d="M4 12a8 8 0 018-8v8H4z"
                                        />
                                      </svg>
                                    )
                                    : feedback?.votes}
                                </p>
                                <button
                                  disabled={createVoteLoading}
                                  onClick={() => {
                                    createVote({
                                      feedbackId: feedback.id,
                                      publicId: router.query.id as string,
                                      type: "down",
                                      userId: getUserId(),
                                    });
                                  }}
                                  className="w-6 mx-auto text-grey-400 rounder cursor hover:bg-gray-300 hover:text-red-500"
                                >
                                  <ChevronDownIcon
                                    className="text-blue-800 w-5 h-5"
                                    aria-hidden="true"
                                  />
                                </button>
                              </div>
                            </div>
                          )}
                          <Link
                            href={{
                              pathname: "/board/[id]/[feedbackId]",
                              query: {
                                id: router.query.id,
                                feedbackId: feedback.id,
                              },
                            }}
                            className="w-full p-2 relative "
                          >
                            <div className="flex items-center">
                              <p className="text-xs text-gray-500">
                                {feedback?.name || "Anonymous"}
                              </p>
                            </div>

                            <div className="block focus:outline-none cursor-pointer">
                              <span
                                className="absolute inset-0"
                                aria-hidden="true"
                              />
                              <p className="truncate text-sm font-medium text-gray-900">
                                {feedback.title}
                              </p>
                              <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-800">
                                {feedback.type.name}
                              </span>
                            </div>
                            <div className="mt-1">
                              <p className="text-sm  text-gray-600 line-clamp-2 truncate">
                                {feedback.message}
                              </p>
                            </div>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </div>

          <section
            aria-labelledby="timeline-title"
            className="lg:col-span-1 lg:col-start-3"
          >
            <div className="bg-white px-4 py-5 border border-gray-200 sm:rounded-lg sm:px-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Tell us what you think
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  We'd love to hear your feedback
                </p>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                  >
                    Submit Feedback
                  </button>
                </div>
              </div>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              Powered by <span className="font-medium">Feedback Board</span>
            </p>
          </section>
        </div>
      )}

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        closable={false}
        width={600}
      >
        <h2 className="text-base font-bold text-gray-500">
          Create a new post
        </h2>
        <form
          className="space-y-4 mt-6"
          onSubmit={form.onSubmit(async (data) => {
            return createFeedback({
              ...data,
              publicId: router.query.id as string,
            });
          })}
        >
          <div className="space-y-4">
            <div className="sm:col-span-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <div className="mt-1">
                <input
                  id="title"
                  name="title"
                  type="text"
                  {...form.getInputProps("title")}
                  required
                  placeholder="A great title"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700"
              >
                Type
              </label>
              <select
                id="type"
                name="type"
                placeholder="Please select a type"
                required
                {...form.getInputProps("type")}
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
              >
                {data?.types.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-6">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Feedback
              </label>
              <div className="mt-1">
                <textarea
                  id="message"
                  {...form.getInputProps("message")}
                  name="message"
                  placeholder="Write something..."
                  required
                  rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  defaultValue={""}
                />
              </div>
            </div>
            <div className="sm:col-span-6">
              <div className="relative">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-start">
                  <span className="bg-white pr-2 text-sm text-gray-500">
                    Additonal Information
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="user"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name (optional)
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="user"
                    id="user"
                    autoComplete="given-name"
                    {...form.getInputProps("user")}
                    placeholder="John Doe"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email (optional)
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="email"
                    {...form.getInputProps("email")}
                    id="email"
                    autoComplete="email"
                    placeholder="john.doe@example.com"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="text-right">
              <button
                type="submit"
                disabled={createFeedbackLoading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                {createFeedbackLoading
                  ? (
                    "Submitting..."
                  )
                  : (
                    "Submit"
                  )}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}

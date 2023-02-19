import { ChevronUpIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Skeleton } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "../../utils/api";

export default function BoardBody() {
  const router = useRouter();

  const {
    data,
    status,
  } = api.feedback.getPubicFeedback.useQuery({
    publicId: router.query.id as string,
  }, {
    onError: () => {
      router.push("/");
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
                {data.length === 0 && EmptyState}
                {data.length > 0 && (
                  <ul
                    role="list"
                    className="divide-y divide-gray-200 border-b border-gray-200 mt-3"
                  >
                    {data.map((feedback) => (
                      <div
                        key={feedback.id}
                        className="relative bg-white py-5 px-4  hover:bg-gray-50"
                        // className="flex mb-4 rounded bg-white divide-y divide-gray-200 border-b border-gray-200 mt-3"
                        id={feedback.id}
                      >
                        <div className="flex justify-between space-x-3">
                          {/* Vote section */}
                          <div className="flex-shrink-0 flex space-x-2 ">
                            <button className="px-2 py-1 w-14 flex flex-col items-center text-gray-500 border rounded-md shadow-none white-btn bg-gray-50/50 border-gray-100/50">
                              <ChevronUpIcon
                                className="text-blue-800 w-5 h-5"
                                aria-hidden="true"
                              />
                              <p className="font-medium">
                                {feedback.upVotes}
                              </p>
                            </button>
                          </div>
                          {/* Post data section */}
                          <Link href="." className="w-full p-2">
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
    </>
  );
}

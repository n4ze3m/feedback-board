import {
  CalendarIcon,
  ChatBubbleLeftEllipsisIcon,
  ChevronUpIcon,
  LockOpenIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useForm } from "@mantine/form";
import { Feedbacks, FeedbackStatus, FeedbackTypes } from "@prisma/client";
import { Modal, Skeleton } from "antd";
import { useRouter } from "next/router";
import React from "react";
import { api } from "../../../../utils/api";
const projects = [
  {
    id: 1,
    subject: "Velit plaed",
    sender: "Gloria Roberston",
    time: "1d ago",
    datetime: "2021-01-27T16:35",
    preview:
      "Doloremque dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor. in. Eos reiciendis deserunt maiores et accusamus quod dolor",
  },
  {
    id: 1,
    subject: "Velit placeat sit ducimus non sed",
    sender: "Gloria Roberston",
    time: "1d ago",
    datetime: "2021-01-27T16:35",
    preview:
      "Doloremque dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.",
  },
  {
    id: 1,
    subject: "Velit placeat sit ducimus non sed",
    sender: "Gloria Roberston",
    time: "1d ago",
    datetime: "2021-01-27T16:35",
    preview:
      "Doloremque dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.",
  },
];

//@ts-ignore
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export const DashboardDetailsInbox = () => {
  const [open, setOpen] = React.useState(false);
  const [openPost, setOpenPost] = React.useState(false);
  const [projectInfo, setProjectInfo] = React.useState<
    Feedbacks & {
      status: FeedbackStatus | null;
      type: FeedbackTypes;
    } | null
  >(null);
  const router = useRouter();

  const client = api.useContext();

  const {
    mutate: createFeedback,
    isLoading: isCreatingFeedback,
  } = api.project.createAdminFeedback.useMutation({
    onSuccess: () => {
      client.project.getOne.invalidate({
        id: router.query.id as string,
      });
      setOpenPost(false);
    },
    onError(error) {
      console.log(error);
    },
  });

  const form = useForm({
    initialValues: {
      title: "",
      content: "",
      type: "",
    },
  });

  const {
    data: project,
    status: projectStatus,
  } = api.project.getOne.useQuery({
    id: router.query.id as string,
  }, {
    onSuccess: (data) => {
      if (data) {
        if (data.feedbackTypes.length > 0) {
          //@ts-ignore
          form.setFieldValue("type", data.feedbackTypes[0].id);
        }
      }
    },
  });

  return (
    <>
      {projectStatus === "success" && (
        <>
          <div className="text-right">
            <button
              type="button"
              onClick={() => setOpenPost(true)}
              className="inline-flex items-center rounded-md border border-transparent bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              New Post
            </button>
          </div>
          {project.feedbacks.length > 0
            ? (
              <ul
                role="list"
                className="divide-y divide-gray-200 border-b border-gray-200 mt-3"
              >
                {project.feedbacks.map((project) => (
                  <li
                    key={project.id}
                    className="relative bg-white py-5 px-4  hover:bg-gray-50"
                  >
                    <div className="flex justify-between space-x-3">
                      <div className="flex-shrink-0 flex space-x-2">
                        <button className="px-2 py-1 w-14 flex flex-col items-center text-gray-500 border rounded-md shadow-none white-btn bg-gray-50/50 border-gray-100/50">
                          <ChevronUpIcon
                            className="text-blue-800 w-5 h-5"
                            aria-hidden="true"
                          />
                          <p className="font-medium">
                            {project.upVotes}
                          </p>
                        </button>
                      </div>
                      {/* rome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
                      <div
                        className="min-w-0 flex-1"
                        onClick={() => {
                          setProjectInfo(project);
                          setOpen(true);
                        }}
                      >
                        <div className="block focus:outline-none cursor-pointer">
                          <span
                            className="absolute inset-0"
                            aria-hidden="true"
                          />
                          <p className="truncate text-sm font-medium text-gray-900">
                            {project.name}
                          </p>
                          <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-800">
                            {project.type.name}
                          </span>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm text-gray-600 line-clamp-3 truncate">
                            {project.message}
                          </p>
                        </div>
                      </div>

                      <time
                        dateTime={project.createdAt.toTimeString()}
                        className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500"
                      >
                        {project.createdAt.toLocaleString()}
                      </time>
                    </div>
                  </li>
                ))}
              </ul>
            )
            : (
              <div className="text-center mt-5">
                <p className="text-gray-500">No feedbacks yet</p>
              </div>
            )}
        </>
      )}

      {projectStatus === "loading" && <Skeleton />}

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={900}
        closable={false}
      >
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
                            <time dateTime="2020-12-02">Dec 2, 2020</time>
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
                          <h2 className="text-sm font-medium text-gray-500">
                            Assignees
                          </h2>
                          <ul role="list" className="mt-3 space-y-3">
                            <li className="flex justify-start">
                              <a
                                href="#"
                                className="flex items-center space-x-3"
                              >
                                <div className="flex-shrink-0">
                                  <img
                                    className="h-5 w-5 rounded-full"
                                    src="https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80"
                                    alt=""
                                  />
                                </div>
                                <div className="text-sm font-medium text-gray-900">
                                  Eduardo Benz
                                </div>
                              </a>
                            </li>
                          </ul>
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
                      Created on <time dateTime="2020-12-02">Dec 2, 2020</time>
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
                    <h2 className="text-sm font-medium text-gray-500">
                      Assignees
                    </h2>
                    <ul role="list" className="mt-3 space-y-3">
                      <li className="flex justify-start">
                        <a href="#" className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <img
                              className="h-5 w-5 rounded-full"
                              src="https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80"
                              alt=""
                            />
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            Eduardo Benz
                          </div>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </main>
      </Modal>

      <Modal
        open={openPost}
        onCancel={() => setOpenPost(false)}
        closable={false}
        footer={null}
      >
        <h2 className="text-base font-bold text-gray-500">
          Create a new post
        </h2>
        <form
          className="space-y-4 mt-6"
          onSubmit={form.onSubmit(async (data) => {
            createFeedback({
              ...data,
              projectId: project!.id,
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
                {project?.feedbackTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-6">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700"
              >
                Content
              </label>
              <div className="mt-1">
                <textarea
                  id="content"
                  {...form.getInputProps("content")}
                  name="content"
                  placeholder="Write something..."
                  required
                  rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  defaultValue={""}
                />
              </div>
            </div>
            <div className="text-right">
              <button
                type="submit"
                disabled={isCreatingFeedback}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                {isCreatingFeedback
                  ? (
                    "Creating..."
                  )
                  : (
                    "Submit feedback"
                  )}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

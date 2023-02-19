import { Tab } from "@headlessui/react";
import { useForm } from "@mantine/form";
import { Modal, notification, Skeleton } from "antd";
import { useRouter } from "next/router";
import React from "react";
import { api } from "../../../../utils/api";

// @ts-ignore
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const DashboardDetailsLabels = () => {
  const router = useRouter();
  const {
    data: project,
    status,
  } = api.project.getOne.useQuery({
    id: router.query.id as string,
  });

  const client = api.useContext();

  const [type, setType] = React.useState<"label" | "status">("label");
  const [openCreate, setOpenCreate] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [editId, setEditId] = React.useState("");

  const editForm = useForm({
    initialValues: {
      name: "",
    },
  });

  const createForm = useForm({
    initialValues: {
      name: "",
    },
  });

  const {
    mutateAsync: addLabelAndStatus,
    isLoading: isAddingLabelAndStatus,
  } = api.project.addLabelAndStatus.useMutation({
    onSuccess: () => {
      client.project.getOne.invalidate({ id: router.query.id as string });
      notification.success({
        message: "Success",
        description: type === "label" ? "Label added" : "Status added",
      });
      setOpenCreate(false);
      createForm.reset();
    },
    onError: (error) => {
      notification.error({
        message: "Error",
        description: error.message,
      });
    },
  });

  const {
    mutateAsync: updateLabelAndStatus,
    isLoading: isUpdatingLabelAndStatus,
  } = api.project.updateLabelAndStatus.useMutation({
    onSuccess: () => {
      client.project.getOne.invalidate({ id: router.query.id as string });
      notification.success({
        message: "Success",
        description: type === "label" ? "Label added" : "Status added",
      });
      setOpenEdit(false);
      editForm.reset();
    },
    onError: (error) => {
      notification.error({
        message: "Error",
        description: error.message,
      });
    },
  });

  return (
    <div>
      {status === "success" && (
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1.5">
            <Tab
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  selected ? "bg-white shadow" : "text-blue-100",
                )}
            >
              Labels
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  selected ? "bg-white shadow" : "text-blue-100",
                )}
            >
              Status
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel
              className={classNames(
                "rounded-xl bg-white p-3",
              )}
            >
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                  <div className="sm:flex-auto">
                    <p className="mt-2 text-sm text-gray-700">
                      A label helps categorize feedback and organize it into
                      actionable groups.
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                      type="button"
                      onClick={() => {
                        setType("label");
                        setOpenCreate(true);
                      }}
                      className="inline-flex items-center justify-center rounded-md border border-transparent bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 sm:w-auto"
                    >
                      Add Label
                    </button>
                  </div>
                </div>
                <div className="mt-8 flex flex-col">
                  <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                          <tr>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
                            >
                              Name
                            </th>
                            <th
                              scope="col"
                              className="relative py-3.5 pl-3 pr-4 sm:pr-6 md:pr-0"
                            >
                              <span className="sr-only">Edit</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {project.feedbackTypes.map((feedback) => (
                            <tr key={feedback.id}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
                                {feedback.name}
                              </td>

                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 md:pr-0">
                                {/* rome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
                                <span
                                  className="text-sky-600 hover:text-sky-900 cursor-pointer"
                                  onClick={() => {
                                    setType("label");
                                    setEditId(feedback.id);
                                    editForm.setFieldValue(
                                      "name",
                                      feedback.name,
                                    );
                                    setOpenEdit(true);
                                  }}
                                >
                                  Edit
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </Tab.Panel>
            <Tab.Panel
              className={classNames(
                "rounded-xl bg-white p-3",
              )}
            >
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                  <div className="sm:flex-auto">
                    <p className="mt-2 text-sm text-gray-700">
                      A status helps to organize feedback into actionable
                      groups.
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                      type="button"
                      onClick={() => {
                        setType("status");
                        setOpenCreate(true);
                      }}
                      className="inline-flex items-center justify-center rounded-md border border-transparent bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 sm:w-auto"
                    >
                      Add Status
                    </button>
                  </div>
                </div>
                <div className="mt-8 flex flex-col">
                  <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                          <tr>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
                            >
                              Name
                            </th>
                            <th
                              scope="col"
                              className="relative py-3.5 pl-3 pr-4 sm:pr-6 md:pr-0"
                            >
                              <span className="sr-only">Edit</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {project.status.map((stat) => (
                            <tr key={stat.id}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
                                {stat.status}
                              </td>

                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 md:pr-0">
                                {/* rome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
                                <span
                                  onClick={() => {
                                    setType("status");
                                    setEditId(stat.id);
                                    editForm.setFieldValue(
                                      "name",
                                      stat.status,
                                    );
                                    setOpenEdit(true);
                                  }}
                                  className="text-sky-600 hover:text-sky-900 cursor-pointer"
                                >
                                  Edit
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      )}
      {status === "loading" && <Skeleton />}

      <Modal
        open={openCreate}
        onCancel={() => setOpenCreate(false)}
        footer={false}
        closable={false}
      >
        <h2 className="text-base font-bold text-gray-500">
          {type === "label" ? "Add a new label" : "Add a new status"}
        </h2>
        <form
          className="space-y-4 mt-6"
          onSubmit={createForm.onSubmit(async (values) => {
            await addLabelAndStatus({
              ...values,
              type,
              projectId: router.query.id as string,
            });
          })}
        >
          <div className="space-y-4">
            <div className="sm:col-span-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  {...createForm.getInputProps("name")}
                  required
                  placeholder={type === "label" ? "Bug" : "In Progress"}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="text-right">
              <button
                disabled={isAddingLabelAndStatus}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                {isAddingLabelAndStatus ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        open={openEdit}
        onCancel={() => setOpenEdit(false)}
        footer={false}
        closable={false}
      >
        <h2 className="text-base font-bold text-gray-500">
          {type === "label" ? "Edit label" : "Edit status"}
        </h2>
        <form
          className="space-y-4 mt-6"
          onSubmit={editForm.onSubmit(async (values) => {
            await updateLabelAndStatus({
              ...values,
              type,
              projectId: router.query.id as string,
              id: editId,
            });
          })}
        >
          <div className="space-y-4">
            <div className="sm:col-span-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  {...editForm.getInputProps("name")}
                  required
                  placeholder={type === "label" ? "Bug" : "In Progress"}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="text-right">
              <button
                disabled={isUpdatingLabelAndStatus}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                {isUpdatingLabelAndStatus ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

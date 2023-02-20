import {
  BellAlertIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";
function OpenSourceIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="h-6 w-6"
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        fill="white"
        d="M12 2c5.523 0 10 4.477 10 10 0 4.4-2.841 8.136-6.789 9.473l-.226.074-2.904-7.55A2.016 2.016 0 0014 12a2 2 0 10-2.083 1.998l-2.903 7.549-.225-.074A10.001 10.001 0 012 12C2 6.477 6.477 2 12 2zm0 2a8 8 0 00-4.099 14.872l1.48-3.849A3.999 3.999 0 0112 8a3.999 3.999 0 012.62 7.023c.565 1.474 1.059 2.757 1.479 3.85A8 8 0 0012 4z"
      />
    </svg>
  );
}

const features = [
  {
    name: "Open Source",
    description:
      "All of our code is open source. You can view the code on GitHub and contribute to the project.",
    icon: OpenSourceIcon,
  },
  {
    name: "Unlimited Boards",
    description: "Create and manage as many boards as you'd like.",
    icon: FolderIcon,
  },
  {
    name: "Email Notifications",
    description:
      "With email notifications you will never miss an important update.",
    icon: BellAlertIcon,
  },
];

export default function FeatureComponents() {
  return (
    <div className="bg-white py-12">
      <div className="mx-auto max-w-xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">A better way to send money.</h2>
        <dl className="space-y-10 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0">
          {features.map((feature) => (
            <div key={feature.name}>
              <dt>
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-sky-500 text-white">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="mt-5 text-lg font-medium leading-6 text-gray-900">
                  {feature.name}
                </p>
              </dt>
              <dd className="mt-2 text-base text-gray-500">
                {feature.description}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

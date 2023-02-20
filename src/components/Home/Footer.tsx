import Link from "next/link";

export const FooterComponent = () => {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-base text-gray-400">
            &copy; 2023 Feedback Board by{" "}
            <Link
              href="https://n4ze3m.com"
              className="text-gray-500 hover:text-gray-900"
            >
              Nazeem
            </Link>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
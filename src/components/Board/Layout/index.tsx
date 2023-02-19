import { Popover } from "@headlessui/react";
import React from "react";

export default function BoardLayout({
  children,
  title,
  description,
  website,
}: {
  children: React.ReactNode;
  title: string;
  description?: string;
  website?: string;
}) {
  return (
    <div className="h-full bg-gray-100">
      <div className="min-h-full">
        <header className="bg-white border-b border-gray-200">
          <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
            <Popover className="flex h-16 justify-between">
              <div className="flex px-2 lg:px-0">
                <div className="flex flex-shrink-0 items-center">
                  <h3 className="text-lg font-bold truncate text-gray-900">
                    {title}
                  </h3>
                </div>
              </div>
            </Popover>
          </div>
        </header>

        <main className="py-10 bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}

import { Popover } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/router";
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
  const router = useRouter();
  return (
    <div className="h-full bg-gray-100">
      <div className="min-h-full">
        <header className="bg-white border-b border-gray-200">
          <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
            <Popover className="flex h-16 justify-between">
              <div className="flex px-2 lg:px-0">
                <div className="flex flex-shrink-0 items-center">
                  <Link
                    href={{
                      pathname: "/board/[id]",
                      query: {
                        id: router.query.id,
                      },
                    }}
                    className="text-lg font-bold truncate text-gray-900"
                  >
                    {title}
                  </Link>
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

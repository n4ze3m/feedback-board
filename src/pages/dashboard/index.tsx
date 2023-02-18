import { GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import React from "react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { DashboardLayout } from "../../components/Layout";
import { DashboardFeedbacks } from "../../components/Dashboard/Projects";
import { useRouter } from "next/router";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

const DashboardPage: NextPage = () => {
  const router = useRouter();
  return (
    <DashboardLayout
      title={
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8   flex flex-wrap items-center justify-between">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900">
            Projects
          </h1>
          <div className="ml-4 mt-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => router.push(`${router.pathname}/new`)}
              className="relative inline-flex items-center rounded-md border border-transparent bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              New Project
            </button>
          </div>
        </div>
      }
    >
      <Head>
        <title>Get Started / Feedback Board</title>
      </Head>
      <DashboardFeedbacks />
    </DashboardLayout>
  );
};

export default DashboardPage;

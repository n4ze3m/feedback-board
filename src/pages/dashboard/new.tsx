import { GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import React from "react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { DashboardLayout } from "../../components/Layout";
import { DashboardFeedbacks } from "../../components/Dashboard/Projects";
import { NewProject } from "../../components/Dashboard/New";

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
  return (
    <DashboardLayout
      title={<></>}
    >
      <Head>
        <title>New Project / Feedback Board</title>
      </Head>
      <NewProject />
    </DashboardLayout>
  );
};

export default DashboardPage;

import { GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import React from "react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { DashboardLayout } from "../../components/Layout";

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
    title="Feedbacks ⚡"
    >
      <Head>
        <title>Get Started / Feedback Board</title>
      </Head>
      some content
    </DashboardLayout>
  );
};

export default DashboardPage;

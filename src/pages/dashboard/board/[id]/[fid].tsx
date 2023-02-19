import { GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import React from "react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { prisma } from "../../../../server/db";
import LayoutDetails from "../../../../components/Layout/details";
import { FeedbackDetails } from "../../../../components/Dashboard/Details/Inbox/Feedback";

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

  const isExist = await prisma.project.findFirst({
    where: {
      id: ctx.query.id as string,
      userId: session.user.id,
    },
  });

  if (!isExist) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  const isFeedbackExist = await prisma.feedbacks.findFirst({
    where: {
      id: ctx.query.fid as string,
      projectId: ctx.query.id as string,
    },
  });

  if (!isFeedbackExist) {
    return {
      redirect: {
        destination: "/dashboard",
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
    <LayoutDetails>
      <Head>
        <title>Feedback / Feedback Board</title>
      </Head>
      <FeedbackDetails />
    </LayoutDetails>
  );
};

export default DashboardPage;

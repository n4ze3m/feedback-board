import { GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import React from "react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { DashboardLayout } from "../../../../components/Layout";
import { prisma } from "../../../../server/db";
import LayoutDetails from "../../../../components/Layout/details";

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

  return {
    props: {},
  };
};

const DashboardPage: NextPage = () => {
  return (
    <LayoutDetails
    >
      <Head>
        <title>Board / Feedback Board</title>
      </Head>
      this will be the board
    </LayoutDetails>
  );
};

export default DashboardPage;

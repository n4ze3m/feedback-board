import { GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import React from "react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
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
        <title>Labels / Feedback Board</title>
      </Head>
      Settigs 
    </LayoutDetails>
  );
};

export default DashboardPage;

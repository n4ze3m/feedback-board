import { GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import React from "react";
import { BoardDetailsBody } from "../../../components/Board/Details";
import BoardLayout from "../../../components/Board/Layout";
import { prisma } from "../../../server/db";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const project = await prisma.project.findFirst({
    where: {
      publicId: ctx.query.id as string,
    },
  });

  if (!project) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const feedback = await prisma.feedbacks.findFirst({
    where: {
      projectId: project.id,
      id: ctx.query.fid as string,
    },
  });

  if (!feedback) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      title: project.name,
      description: project.description,
      website: project.website,
    },
  };
};

//@ts-ignore
const BoardPage: NextPage = ({ title, description, website }) => {
  return (
    <BoardLayout
      title={title}
      description={description}
      website={website}
    >
      <Head>
        <title>{title} / Feedback Board</title>
      </Head>
      <BoardDetailsBody />
    </BoardLayout>
  );
};

export default BoardPage;

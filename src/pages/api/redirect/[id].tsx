import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db";

const handler = async function (req: NextApiRequest, res: NextApiResponse) {
  // // custom logic
  // if (failed)
  //   return res.redirect(307, '/login')
  const { id } = req.query;
  const project = await prisma.project.findFirst({
    where: {
      id: id as string,
    },
  });

  if (project) {
    res.redirect(307, `/${project.publicId}`);
  }

  return res.redirect(307, "/dashboard");
};

export default handler;

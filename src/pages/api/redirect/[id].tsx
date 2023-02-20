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
    // res.redirect(307, `/board/${project.publicId}`);
    res.setHeader("Location", `/board/${project.publicId}`);
    res.statusCode = 307;
    return res.end();
  }

  res.statusCode = 404;
  return res.end();

};

export default handler;

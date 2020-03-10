import { isAuthenticated } from "../../../middlewares";
import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    follow: async (_, args, { request }) => {
      isAuthenticated(request);
      const { user } = request;
      const { userId } = args;
      try {
        await prisma.updateUser({
          where: {
            id: user.id
          },
          data: {
            following: {
              connect: {
                id: userId
              }
            }
          }
        });
        return true;
      } catch {
        return false;
      }
    }
  }
};

import { isAuthenticated } from "../../../middlewares";
import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    toggleFollow: async (_, args, { request }) => {
      isAuthenticated(request);
      const { user } = request;
      const { id } = args;
      try {
        const existingFollow = await prisma.$exists.user({
          AND: [
            {
              id: user.id
            },
            {
              following_none: {
                id: id
              }
            }
          ]
        });

        if (existingFollow) {
          await prisma.updateUser({
            where: {
              id: user.id
            },
            data: {
              following: {
                connect: {
                  id
                }
              }
            }
          });
        } else {
          console.log("안됨?");
          await prisma.updateUser({
            where: {
              id: user.id
            },
            data: {
              following: {
                disconnect: {
                  id
                }
              }
            }
          });
        }
        return true;
      } catch {
        return false;
      }
    }
  }
};

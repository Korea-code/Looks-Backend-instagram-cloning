import { prisma } from "../../../../generated/prisma-client";

const EDIT = "EDIT";
const DELETE = "DELETE";
export default {
  Mutation: {
    editPost: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { id, location, caption, action } = args;
      const { user } = request;
      const isMyPost = await prisma.$exists.post({
        AND: [
          { id },
          {
            user: {
              id: user.id
            }
          }
        ]
      });
      if (isMyPost) {
        if (action === EDIT) {
          return prisma.updatePost({
            where: { id },
            data: { caption, location }
          });
        } else if (action === DELETE) {
          return prisma.deletePost({ id });
        }
      } else throw Error("You only can update your post");
    }
  }
};

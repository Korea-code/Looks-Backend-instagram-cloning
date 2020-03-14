import { prisma } from "../../../generated/prisma-client";
export default {
  User: {
    fullName: parent => {
      return `${parent.firstName} ${parent.lastName}`;
    },
    isSelf: (parent, _, { request }) => {
      return parent.id === request.user.id;
    },
    isFollowing: async (parent, _, { request }) => {
      const { user } = request;
      const { id: parentId } = parent;
      return prisma.$exists.user({
        AND: [
          { id: user.id },
          {
            following_some: {
              id: parentId
            }
          }
        ]
      });
    }
  }
};

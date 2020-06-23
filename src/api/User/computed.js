import { prisma } from "../../../generated/prisma-client";
export default {
  User: {
    posts: ({ id }) => prisma.user({ id }).posts(),
    following: ({ id }) => prisma.user({ id }).following(),
    likes: ({ id }) => prisma.user({ id }).likess(),
    comments: ({ id }) => prisma.user({ id }).comments(),
    rooms: ({ id }) => prisma.user({ id }).rooms(),
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

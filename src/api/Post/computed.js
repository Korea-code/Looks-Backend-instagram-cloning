import { prisma } from "../../../generated/prisma-client";
export default {
  Post: {
    isLiked: async (parent, _, { request }) => {
      const { id: parentId } = parent;
      const { user } = request;
      return prisma.$exists.post({
        AND: [
          { id: parentId },
          {
            likes_some: {
              user: {
                id: user.id
              }
            }
          }
        ]
      });
    },
    likeCount: parent =>
      prisma
        .likesConnection({ where: { post: { id: parent.id } } })
        .aggregate()
        .count()
  }
};

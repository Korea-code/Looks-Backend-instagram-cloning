import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    uploadPost: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { location, caption, urls } = args;
      const { user } = request;
      const post = await prisma.createPost({
        user: { connect: { id: user.id } },
        location,
        caption
      });
      const files = [];
      urls.forEach(async file => {
        await prisma.createFile({
          url: file,
          post: { connect: { id: post.id } }
        });
      });
      return post;
    }
  }
};

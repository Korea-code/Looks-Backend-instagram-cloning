import { prisma } from "../../../../generated/prisma-client";
import { USER_FRAGMENT } from "../../../fragments";

export default {
  Query: {
    myProfile: async (_, __, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { user } = request;

      const myUser = await prisma.user({ id: user.id });
      const posts = await prisma.user({ id: user.id }).posts();
      return {
        user: myUser,
        posts
      };
    }
  }
};

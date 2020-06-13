import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    createAcount: async (_, args) => {
      const { username, email, firstName = "", lastName = "", bio = "" } = args;
      const existsUser = await prisma.$exists.user({ username });
      const existsEmail = await prisma.$exists.user({ email });
      if (existsEmail) {
        throw Error("This email is taken");
      }
      if (existsUser) {
        throw Error("This username is taken");
      }

      await prisma.createUser({
        username,
        email,
        firstName,
        lastName,
        bio
      });
      return true;
    }
  }
};

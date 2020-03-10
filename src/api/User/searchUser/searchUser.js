import { prisma } from "../../../../generated/prisma-client";

// I will add length check
export default {
  Query: {
    searchUser: async (_, args) =>
      prisma.users({
        where: {
          OR: [
            { username_contains: args.word },
            { firstName_contains: args.word },
            { lastName_contains: args.word }
          ]
        }
      })
  }
};

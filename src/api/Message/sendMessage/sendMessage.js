import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    sendMessage: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { user } = request;
      const { roomId, message, toId } = args;
      const isRoomEx = await prisma.$exists.room({
        AND: [
          { id: roomId },
          {
            participants_some: {
              id: user.id
            }
          }
        ]
      });
      if (isRoomEx) {
        var toUser = await prisma.room({ id: roomId }).participants({
          where: {
            id_not: user.id
          }
        });
      } else {
        const isUserEx = await prisma.$exists.user({ id: toId });
        if (isUserEx) {
          var room = await prisma.createRoom({
            participants: {
              connect: [{ id: toId }, { id: user.id }]
            }
          });
        } else {
          throw Error("No room exist");
        }
      }
      return prisma.createMessage({
        text: message,
        from: {
          connect: {
            id: user.id
          }
        },
        to: {
          connect: {
            id: roomId ? toUser[0].id : toId
          }
        },
        room: {
          connect: {
            id: roomId ? roomId : room.id
          }
        }
      });
    }
  }
};

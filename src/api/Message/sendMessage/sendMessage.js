import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    sendMessage: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { user } = request;
      const { roomId, message, toId } = args;
      let room = null;
      const isRoomEx = await prisma.$exists.room({
        OR: [
          {
            AND: [
              { id: roomId },
              {
                participants_some: {
                  id: user.id
                }
              }
            ]
          },
          {
            AND: [
              {
                participants_some: {
                  id: user.id
                }
              },
              {
                participants_some: {
                  id: toId
                }
              }
            ]
          }
        ]
      });
      if (isRoomEx) {
        if (toId === undefined)
          var toUser = await prisma.room({ id: roomId }).participants({
            where: {
              id_not: user.id
            }
          });
        else {
          room = await prisma.rooms({
            where: {
              AND: [
                {
                  participants_some: {
                    id: user.id
                  }
                },
                {
                  participants_some: {
                    id: toId
                  }
                }
              ]
            }
          });
        }
      } else {
        const isUserEx = await prisma.$exists.user({ id: toId });
        if (isUserEx) {
          if (user.id === toId)
            throw Error("You cannot make room with yourself");
          room = await prisma.createRoom({
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
            id: toId ? toId : toUser[0].id
          }
        },
        room: {
          connect: {
            id: roomId ? roomId : room[0].id
          }
        }
      });
    }
  }
};

import { prisma } from '@/config';

async function getBooking(userId: number) {
  return prisma.booking.findUnique({
    where: { userId },
    include: { Room: true },
  });
}

async function postBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: { userId, roomId },
    include: { Room: true },
  });
}

async function updateBooking(bookingId: number, roomId: number) {
  return prisma.booking.update({
    where: { id: bookingId },
    data: { roomId },
    include: { Room: true },
  });
}


export const bookingRepository = {
  getBooking,
  postBooking,
  updateBooking,
};
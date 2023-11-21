import { prisma } from '@/config';

async function findHotel() {
  const hotel = prisma.hotel.findMany();
  return hotel;
}

async function findHotelById(hotelId: number) {
  const hotel = prisma.hotel.findUnique({
    where: { id: hotelId },
    include: { Rooms: true },
  });
  return hotel;
}

export const hotelsRepository = {
  findHotel,
  findHotelById,
};

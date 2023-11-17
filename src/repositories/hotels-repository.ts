import { prisma } from '@/config';

async function findHotel() {
    const hotel = prisma.hotel.findMany();
    return hotel;
}


async function findHotelById(id: number) {
    const hotel = prisma.hotel.findUnique({
        where:{id:id}
    });
    return hotel;
}

export const hotelsRepository = {
  findHotel,
  findHotelById,
};
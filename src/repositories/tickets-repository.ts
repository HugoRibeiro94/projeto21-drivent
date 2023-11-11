import { prisma } from '@/config';

async function findTicketsType() {
  return prisma.ticketType.findMany();
}

async function findTickets() {
  return prisma.ticket.findUnique({
    where:{id:1}
  });
}

async function createTicket() {
  return prisma.ticket.findUnique({
    where:{id:1}
  });
}

export const ticketsRepository = {
  findTickets,
  findTicketsType,
  createTicket
};
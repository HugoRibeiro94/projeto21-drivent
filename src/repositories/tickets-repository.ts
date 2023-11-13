import { prisma } from '@/config';
import { TicketData } from '@/services';

async function findTicketsType() {
  const result = await prisma.ticketType.findMany();
  return result;
}

async function findTickets(id: number) {
  const result = await prisma.ticket.findUnique({
    where: { enrollmentId: id },
    include: { TicketType: true },
  });
  return result;
}

async function createTicket(ticket: TicketData) {
  const result = await prisma.ticket.create({
    data: ticket,
    include: { TicketType: true },
  });

  return result;
}

export const ticketsRepository = {
  findTickets,
  findTicketsType,
  createTicket,
};

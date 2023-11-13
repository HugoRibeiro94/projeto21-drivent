import { Ticket, TicketType } from '@prisma/client';
import { invalidDataError, notFoundError } from '@/errors';
import { enrollmentRepository, ticketsRepository } from '@/repositories';

async function getTicketsType() {
  const tickets = await ticketsRepository.findTicketsType();

  return tickets;
}

async function getTickets(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const tickets = await ticketsRepository.findTickets(enrollment.id);
  if (!tickets) throw notFoundError();

  return tickets;
}

async function postCreateTickets(userId: number, ticketTypeId: number) {
  if (!ticketTypeId) throw invalidDataError('ticketTypeId');

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const enrollmentId = enrollment.id;

  const ticket: TicketData = {
    ticketTypeId,
    enrollmentId,
    status: 'RESERVED',
  };

  const tickets = await ticketsRepository.createTicket(ticket);

  return tickets;
}

export type TicketTypeId = {
  ticketTypeId: number;
};

export type TicketData = Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>;

export const ticketsService = {
  getTickets,
  getTicketsType,
  postCreateTickets,
};

import { ticketsRepository } from "@/repositories";

async function getTickets():Promise<any> {
  const tickets = await ticketsRepository.findTickets();
  
  return tickets;
}

async function getTicketsType():Promise<any> {
  const tickets = await ticketsRepository.findTicketsType();

  return tickets;
}

async function postCreateTickets():Promise<any> {
  const tickets = await ticketsRepository.createTicket();

  return tickets;
}

export const ticketsService = {
  getTickets,
  getTicketsType,
  postCreateTickets
};
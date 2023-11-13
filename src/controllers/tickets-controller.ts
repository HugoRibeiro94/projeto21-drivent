import { Response } from 'express';
import httpStatus from 'http-status';
import { ticketsService } from '@/services';
import { AuthenticatedRequest } from '@/middlewares';

export async function getTicketsType(req: AuthenticatedRequest, res: Response) {
  const tickets = await ticketsService.getTicketsType();
  return res.status(httpStatus.OK).send(tickets);
}

export async function getTickets(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const tickets = await ticketsService.getTickets(userId);
  return res.status(httpStatus.OK).send(tickets);
}

export async function postCreateTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketTypeId } = req.body;

  const tickets = await ticketsService.postCreateTickets(userId, ticketTypeId);
  return res.status(httpStatus.CREATED).send(tickets);
}

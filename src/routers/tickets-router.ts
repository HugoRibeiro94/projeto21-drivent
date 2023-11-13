import { Router } from 'express';
import { getTickets, getTicketsType, postCreateTicket } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/', getTickets)
  .get('/types', getTicketsType)
  .post('/', postCreateTicket);

export { ticketsRouter };

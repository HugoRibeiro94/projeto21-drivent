import { Router } from 'express';
import { getTickets, getTicketsType, postCreateTicket } from '@/controllers';


const ticketsRouter = Router();

ticketsRouter.get('/tickets',getTickets);
ticketsRouter.get('/tickets/types', getTicketsType)
ticketsRouter.post('/', postCreateTicket);


export {ticketsRouter} ;

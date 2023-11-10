import { ticketsService } from '@/services';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

export async function getTickets(req: Request, res: Response) {
    console.log("opa");
    
  //const tickets = await ticketsService.getTickets();
  return res.status(httpStatus.OK).send("tickets");
}

export async function getTicketsType(req: Request, res: Response) {
  console.log("opaa");
  
//const tickets = await ticketsService.getTicketsType();
return res.status(httpStatus.OK).send("ticketsType");
}

export async function postCreateTicket(req: Request, res: Response) {
  console.log("opaa");
  
//const tickets = await ticketsService.postCreateTickets();
return res.status(httpStatus.OK).send("postTickets");
}
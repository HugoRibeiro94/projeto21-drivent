import Joi from 'joi';
import { TicketTypeId } from '@/services';

export const ticketSchema = Joi.object<TicketTypeId>({
  ticketTypeId: Joi.number().required(),
});

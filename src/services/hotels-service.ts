import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { notFoundError, paymentRequiredError } from '@/errors';
import { enrollmentRepository, hotelsRepository, ticketsRepository } from '@/repositories';

async function getHotels(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();
  if (ticket.status !== 'PAID') throw paymentRequiredError();

  const ticketTypeId = ticket.ticketTypeId;
  const ticketType = await ticketsRepository.findTicketTypesById(ticketTypeId);
  if (ticketType.isRemote === true) throw paymentRequiredError();
  if (ticketType.includesHotel === false) throw paymentRequiredError();

  const hotel = await hotelsRepository.findHotel();

  if (hotel.length === 0) throw notFoundError();
  return hotel;
}

async function getHotelsById(userId: number, hotelId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();
  if (ticket.status !== 'PAID') throw paymentRequiredError();

  const ticketTypeId = ticket.ticketTypeId;
  const ticketType = await ticketsRepository.findTicketTypesById(ticketTypeId);
  if (ticketType.isRemote === true) throw paymentRequiredError();
  if (ticketType.includesHotel === false) throw paymentRequiredError();

  const hotel = await hotelsRepository.findHotelById(hotelId);
  if (!hotel) throw notFoundError();
  return hotel;
}

export const hotelsService = {
  getHotels,
  getHotelsById,
};

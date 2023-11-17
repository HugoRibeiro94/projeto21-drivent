import { notFoundError, paymentRequiredError } from '@/errors';
import { enrollmentRepository, hotelsRepository, ticketsRepository } from '@/repositories';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

async function getHotels(userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError();

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) throw notFoundError();
    if (ticket.status !== 'PAID') throw paymentRequiredError();

    const hotel = await hotelsRepository.findHotel();
    return hotel;
}

async function getHotelsById(userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError();

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) throw notFoundError();

    const hotel = await hotelsRepository.findHotelById(userId);
    return hotel;
}

export const hotelsService = {
    getHotels,
    getHotelsById,
  };
  
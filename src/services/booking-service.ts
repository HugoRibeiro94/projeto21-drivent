import { notFoundError } from '@/errors';
import { bookingRepository, enrollmentRepository, ticketsRepository } from '@/repositories';
import { forbiddenError } from '@/errors/forbidden-error';

async function getBooking(userId: number) {
    const booking = await bookingRepository.getBooking(userId);

    if (!booking) throw notFoundError();

    return booking;
}

async function postBooking(userId: number, roomId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw forbiddenError();
  
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) throw forbiddenError();

    const booking = await bookingRepository.postBooking(userId, roomId);

    return booking.id;
}

async function updateBooking(userId: number, roomId: number, bookingId: number) {
  const userBooking = await bookingRepository.getBooking(userId);
  if (!userBooking || userBooking.id !== bookingId) throw forbiddenError();

  const booking = await bookingRepository.updateBooking(bookingId, roomId);

  return booking.id;
}

export const bookingService = {
  getBooking,
  postBooking,
  updateBooking,
};
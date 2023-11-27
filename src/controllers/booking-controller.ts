import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { bookingService } from '@/services';

export async function getBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    
    const booking = await bookingService.getBooking(userId);
    return res.status(httpStatus.OK).send(booking);
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const { roomId } = req.body;

    const booking = await bookingService.postBooking(userId, roomId);

    return res.status(httpStatus.OK).send( booking );
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const { roomId } = req.body;
    const { bookingId } = req.params

    const booking = await bookingService.updateBooking(userId, roomId, parseInt(bookingId));

    return res.status(httpStatus.OK).send( booking );
}
import { AuthenticatedRequest } from '@/middlewares';
import { hotelsService } from '@/services';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const hotel = await hotelsService.getHotels(userId);
    return res.status(httpStatus.OK).send(hotel);
}

export async function getHotelsById(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const hotel = await hotelsService.getHotelsById( userId );
    return res.status(httpStatus.OK).send(hotel);
}

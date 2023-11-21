import { AuthenticatedRequest } from '@/middlewares';
import { hotelsService } from '@/services';
import { log } from 'console';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const hotel = await hotelsService.getHotels(userId);
    return res.status(httpStatus.OK).send(hotel);
}

export async function getHotelsById(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const hotelId = Number(req.params.hotelId);
    
    console.log(hotelId);
    
    const hotel = await hotelsService.getHotelsById( userId, hotelId );
    return res.status(httpStatus.OK).send(hotel);
}

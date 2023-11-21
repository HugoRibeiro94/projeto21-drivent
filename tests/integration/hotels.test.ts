import supertest from 'supertest';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import { cleanDb, generateValidToken } from '../helpers';
import { createHotel, createRoom } from '../factories/hotels-factory';
import { createEnrollmentWithAddress, createPayment, createTicket, createTicketType, createUser } from '../factories';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {
  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 404 when user has no enrollment', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it('should respond with status 404 when user has no ticket', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    await createEnrollmentWithAddress(user);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it('should respond with status 404 when there are no hotels', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(false, true);
    const ticket = await createTicket(enrollment.id, ticketType.id, 'PAID');
    await createPayment(ticket.id, 100000);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it('should respond with status 402 when ticket is remote ', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(true, true);
    const ticket = await createTicket(enrollment.id, ticketType.id, 'PAID');
    await createPayment(ticket.id, 1000);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 402 when ticket is reserved ', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(false, true);
    await createTicket(enrollment.id, ticketType.id, 'RESERVED');

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 402 when ticket no include hotel', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(false, false);
    const ticket = await createTicket(enrollment.id, ticketType.id, 'PAID');
    await createPayment(ticket.id, ticketType.price);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 200 and return the list of hotels', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(false, true);
    await createTicket(enrollment.id, ticketType.id, 'PAID');

    const hotel = await createHotel();

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.OK);
    expect(response.body).toHaveLength(1);
    expect(response.body).toEqual([
      {
        ...hotel,
        createdAt: hotel.createdAt.toISOString(),
        updatedAt: hotel.updatedAt.toISOString(),
      },
    ]);
  });
});

describe('GET /hotels/:hotelId', () => {
  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 404 when user has no enrollment', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it('should respond with status 404 when user has no ticket', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    await createEnrollmentWithAddress(user);

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it('should respond with status 404 for invalid hotel id', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(false, true);
    const ticket = await createTicket(enrollment.id, ticketType.id, 'PAID');
    const hotel = await createHotel();
    await createPayment(ticket.id, ticketType.price);

    await createHotel();

    const response = await server.get('/hotels/100000').set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it('should respond with status 402 when ticket is remote ', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(true, true);
    const ticket = await createTicket(enrollment.id, ticketType.id, 'PAID');
    const hotel = await createHotel();
    await createPayment(ticket.id, ticketType.price);

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 402 when ticket is reserved ', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(false, true);
    const hotel = await createHotel();
    await createTicket(enrollment.id, ticketType.id, 'RESERVED');

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 402 when ticket no include hotel', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(false, false);
    const ticket = await createTicket(enrollment.id, ticketType.id, 'PAID');
    const hotel = await createHotel();
    await createPayment(ticket.id, ticketType.price);

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 200', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(false, true);
    const ticket = await createTicket(enrollment.id, ticketType.id, 'PAID');
    await createPayment(ticket.id, ticketType.price);

    const hotel = await createHotel();

    const createdRoom = await createRoom(hotel.id);

    const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.OK);

    expect(response.body).toEqual({
      ...hotel,
      createdAt: hotel.createdAt.toISOString(),
      updatedAt: hotel.updatedAt.toISOString(),
      Rooms: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          capacity: expect.any(Number),
          hotelId: hotel.id,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      ]),
    });
  });
});

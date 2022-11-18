import { FastifyReply, FastifyRequest } from 'fastify'
import { Container } from 'typedi'
import { listUserHandler, createUserHandler } from '@/routes/user-route';
import UserUseCase from '@/usecases/user-usecase';
import User from '@/entities/user-entity';
import { ApiError, ExistedUsernameError } from '@/commons/error';
import { createUserBodyType } from '@/routes/user-route.schema';

jest.mock('@/usecases/user-usecase')
const MockedUserUseCase = <jest.Mock<UserUseCase>>UserUseCase;
describe('UserRoute', () => {
    const userUseCase = new MockedUserUseCase();
    const log = {
        debug: jest.fn()
    }
    beforeEach(() => {
        jest.resetAllMocks();
        Container.set(UserUseCase, userUseCase);
    });
    describe('listUserHandler()', () => {
        it('should reply with formated user list', async () => {
            const userData = { name: 'nae', username: 'nae3x', password: '123456', birthdate: new Date('2022-01-01'), id: 'id' };
            const user = new User(userData.name, userData.username, userData.password, userData.birthdate, userData.id);
            const request = { log } as unknown as FastifyRequest;
            const reply = jest.fn() as unknown as FastifyReply;
            reply.send = jest.fn();
            userUseCase.listUser = jest.fn().mockResolvedValue([user]);

            await listUserHandler(request, reply);

            const expected = {
                data: [{
                    name: user.name,
                    username: user.username,
                    password: user.password,
                    birthdate: '2022-01-01',
                    id: user.id
                }]
            }
            expect(reply.send).toHaveBeenCalledWith(expected);
        });

        it('should reply with empty list of user', async () => {
            const request = { log } as unknown as FastifyRequest;
            const reply = jest.fn() as unknown as FastifyReply;
            reply.send = jest.fn();
            userUseCase.listUser = jest.fn().mockResolvedValue([]);

            await listUserHandler(request, reply);

            const expected = { data: [] }
            expect(reply.send).toHaveBeenCalledWith(expected);
        })
    });

    describe('createUserHandler()', () => {
        it('should reply created user id if successfully create new user', async () => {
            const user = { name: 'nae', username: 'nae3x', password: '123456', birthdate: new Date('2022-01-01'), id: 'id' };
            const request = {
                body: {
                    name: user.name,
                    username: user.username,
                    password: user.password,
                    birthdate: '2022-01-01',
                },
                log,
            } as unknown as FastifyRequest<{ Body: createUserBodyType }>;
            const reply = jest.fn() as unknown as FastifyReply;
            const send = jest.fn();
            reply.status = jest.fn().mockReturnValue({ send: send });
            userUseCase.createUser = jest.fn().mockResolvedValue(new User(user.name, user.username, user.password, user.birthdate, user.id));

            await createUserHandler(request, reply);

            const expectedStatus = 201
            const expected = { data: { id: user.id } };
            expect(reply.status).toHaveBeenCalledWith(expectedStatus);
            expect(send).toHaveBeenCalledWith(expected);
        });

        it('should throw error if create user unsuccessful in duplicated case', async () => {
            const user = { name: 'nae', username: 'nae3x', password: '123456', birthdate: new Date('2022-01-01'), id: 'id' };
            const request = {
                body: {
                    name: user.name,
                    username: user.username,
                    password: user.password,
                    birthdate: '2022-01-01',
                },
                log,
            } as unknown as FastifyRequest<{ Body: createUserBodyType }>;
            const reply = jest.fn() as unknown as FastifyReply;
            const send = jest.fn();
            reply.status = jest.fn().mockReturnValue({ send: send });
            userUseCase.createUser = jest.fn().mockRejectedValue(new ExistedUsernameError(user.username));

            expect(createUserHandler(request, reply)).rejects.toThrow(ApiError);
        });

        it('should throw error if create user unsuccessful in other case', async () => {
            const user = { name: 'nae', username: 'nae3x', password: '123456', birthdate: new Date('2022-01-01'), id: 'id' };
            const request = {
                body: {
                    name: user.name,
                    username: user.username,
                    password: user.password,
                    birthdate: '2022-01-01',
                },
                log,
            } as unknown as FastifyRequest<{ Body: createUserBodyType }>;
            const reply = jest.fn() as unknown as FastifyReply;
            const send = jest.fn();
            reply.status = jest.fn().mockReturnValue({ send: send });
            userUseCase.createUser = jest.fn().mockRejectedValue(new Error("Unhandled Exception"));

            expect(createUserHandler(request, reply)).rejects.toThrow(Error);
        });
    });
});
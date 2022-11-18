import { ExistedUsernameError } from "@/commons/error";
import User from "@/entities/user-entity";
import UserRepository from "@/repositories/user-repository";

describe('UserUseCase', () => {
    describe('getAll()', () => {
        it('should return list of user', async () => {
            const userList = [new User('best', 'besuto', '123456', new Date('2022-01-01'))];
            const userRepository = new UserRepository();
            await userRepository.create(userList[0]);

            const result = await userRepository.getAll();

            const expected = userList;
            expect(result).toStrictEqual(expected);
        });
    });

    describe('create()', () => {
        it('should create new user if user does not exist', async () => {
            const user = new User('best', 'besuto', '123456', new Date('2022-01-01'));
            const userRepository = new UserRepository();

            const result = await userRepository.create(user);

            const expected = user;
            expect(result.id).not.toBeUndefined();
            expect(result.username).toStrictEqual(expected.username);
        });

        it('should throw error if useranme is already exist', async () => {
            const user = new User('best', 'besuto', '123456', new Date('2022-01-01'));
            const userRepository = new UserRepository();
            await userRepository.create(user);

            expect(userRepository.create(user)).rejects.toThrow(ExistedUsernameError);
        })
    });

    describe('deleteAll()', () => {
        it('should delete user', async () => {
            const user = new User('best', 'besuto', '123456', new Date('2022-01-01'));
            const userRepository = new UserRepository();
            await userRepository.create(user);

            await userRepository.deleteAll();

            const result = await userRepository.getAll();

            expect(result.length).toStrictEqual(0);
        })
    });

});
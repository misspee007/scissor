import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './users.service';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createdUser: User = {
        id: 1,
        email: 'test@example.com',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const prismaUserCreateSpy = jest
        .spyOn(prismaService.user, 'create')
        .mockResolvedValue(createdUser);

      const result = await userService.createUser(
        'test@example.com',
        'password',
      );

      expect(result).toEqual(createdUser);
      expect(prismaUserCreateSpy).toBeCalledWith({
        data: {
          email: 'test@example.com',
          password: 'password',
        },
      });
    });
  });

  describe('findOne', () => {
    it('should find a user by unique input', async () => {
      const foundUser: User | null = {
        id: 1,
        email: 'test@example.com',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const prismaUserFindUniqueSpy = jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(foundUser);

      const result = await userService.findOne({ id: 1 });

      expect(result).toEqual(foundUser);
      expect(prismaUserFindUniqueSpy).toBeCalledWith({ where: { id: 1 } });
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const updatedUser: User = {
        id: 1,
        email: 'newemail@example.com',
        password: 'newpassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const prismaUserUpdateSpy = jest
        .spyOn(prismaService.user, 'update')
        .mockResolvedValue(updatedUser);

      const result = await userService.updateUser({
        where: { id: 1 },
        data: {
          email: 'newemail@example.com',
          password: 'newpassword',
        },
      });

      expect(result).toEqual(updatedUser);
      expect(prismaUserUpdateSpy).toBeCalledWith({
        where: { id: 1 },
        data: {
          email: 'newemail@example.com',
          password: 'newpassword',
        },
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const deletedUser: User = {
        id: 1,
        email: 'test@example.com',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const prismaUserDeleteSpy = jest
        .spyOn(prismaService.user, 'delete')
        .mockResolvedValue(deletedUser);

      const result = await userService.deleteUser(1);

      expect(result).toEqual(deletedUser);
      expect(prismaUserDeleteSpy).toBeCalledWith({ where: { id: 1 } });
    });
  });
});

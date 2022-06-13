import { Test, TestingModule } from '@nestjs/testing';
import UserService from '@services/user/user.service';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { hashSync } from 'bcrypt';
import { MongoRepository } from '@repositories/user/user-repository-mongo';
import CreateUserDto from '@dto/user/create-user-dto';
import User from '@models/user';
import { HttpException } from '@nestjs/common';

describe('User Service Suite', () => {
  let service: UserService;
  let model: Model<User>;

  const mockUser = new User({
    _id: `${new Types.ObjectId()}`,
    name: 'Roberto Freitas',
    email: 'roberto@gmail.com',
    phone: '+5562982978229',
    password: `${hashSync('senha12345678', 10)}`,
    organization: 'Itaú',
    sector: 'Gerência',
    refresh_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkxIiwibmFtZSI6IlJvYmVydG8gRnJlaXRhcyIsImVtYWlsIjoicm9iZXJ0b0BnbWFpbC5jb20iLCJpYXQiOjE1MTYyMzkwMjJ9.rTYHqVcEji7l8Ma2-QJGmi71GsctoP74c7tLVfbDWdc',
  });

  const newUser: CreateUserDto = {
    name: 'Sandro Dias',
    email: 'sandro@gmail.com',
    phone: '+5562982978229',
    password: 'Senha123@',
    organization: 'Itaú',
    sector: 'Gerência',
    refresh_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkxIiwibmFtZSI6IlNhbmRybyBEaWFzIiwiZW1haWwiOiJzYW5kcm9AZ21haWwuY29tIiwiaWF0IjoxNTE2MjM5MDIyfQ.9Atd7f2zc1wl0FyzzW0aiw79qENThhxx9ICfrQ6r9lc',
  };

  let users: User[] = [
    new User({
      _id: `${new Types.ObjectId()}`,
      name: 'Anderson Raphael',
      email: 'anderson@gmail.com',
      phone: '+5562982978229',
      password: `${hashSync('senha12345678', 10)}`,
      organization: 'Magnet Customer',
      sector: 'TI',
      refresh_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkxIiwibmFtZSI6IkFuZGVyc29uIFJhcGhhZWwiLCJlbWFpbCI6ImFuZGVyc29uQGdtYWlsLmNvbSIsImlhdCI6MTUxNjIzOTAyMn0.l-T9vPdvxZ9POzxXM_4G0WSF1MB1Q3hOrBWx7Hqs8sk',
    }),
    mockUser,
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      providers: [
        UserService,
        MongoRepository,
        {
          provide: getModelToken('User'),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn().mockImplementation(() => {
              users.push({
                ...newUser,
                _id: `${new Types.ObjectId()}`,
                password: `${hashSync(`${newUser.password}`, 10)}`,
              });

              return {
                _id: users[users.length - 1]._id,
                name: users[users.length - 1].name,
                email: users[users.length - 1].email,
              };
            }),
            findOneAndUpdate: jest.fn(),
            exec: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockResolvedValueOnce(mockUser.refresh_token),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<User>>(getModelToken('User'));

    users = users.filter((user: User) => user.email !== newUser.email);
  });

  // it('should be defined', () => {
  //   expect(service).toBeDefined();
  // });

  describe('Create User Suite', () => {
    it('should return a HttpException error instance when the password is invalid', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(users),
      } as any);

      try {
        await service.createUser({
          ...newUser,
          password: 'senha123',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error?.message).toBe('Password is invalid!');
        expect(error?.status).toBe(400);
      }
    });

    it('should return a HttpException error instance when the e-mail is invalid', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(users),
      } as any);

      try {
        await service.createUser({
          ...newUser,
          email: 'emailtest@',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error?.message).toBe('E-mail is invalid');
        expect(error?.status).toBe(400);
      }
    });

    it('should return a HttpException error instance when e-mail already exists', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(newUser),
      } as any);

      try {
        await service.createUser(newUser);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error?.message).toBe('E-mail already exists!');
        expect(error?.status).toBe(400);
      }
    });

    it('should create a new user successfully and return it', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(users),
      } as any);

      const quantityUsers = (await service.findAll()).length;

      const createSpy = jest.spyOn(model, 'create');

      const result = await service.createUser(newUser);

      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(users),
      } as any);

      const newQuantityUsers = (await service.findAll()).length;

      expect(result).toHaveProperty('_id');
      expect(newQuantityUsers).toBe(quantityUsers + 1);
      expect(createSpy).toBeCalledTimes(1);
    });
  });

  describe('Update User Suite', () => {
    it('should return a HttpException error instance when the user is not found', async () => {
      const data = {
        name: 'New Name',
      };

      jest.spyOn(model, 'findOneAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce({ ...mockUser, name: data.name }),
      } as any);

      try {
        await service.updateUser(mockUser.email, data);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error?.message).toBe('User not found');
        expect(error?.status).toBe(400);
      }
    });

    it('should update an user successfully and return it', async () => {
      const data = {
        name: 'New Name',
      };

      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockUser),
      } as any);

      jest
        .spyOn(model, 'findOneAndUpdate')
        .mockResolvedValue({ ...mockUser, name: data.name });

      const userUpdated = await service.updateUser(mockUser.email, data);

      expect(userUpdated).toHaveProperty('_id');
      expect(userUpdated?.name).not.toEqual(mockUser.name);
    });
  });

  describe('Get All Users Suite', () => {
    it('should return all users', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(users),
      } as any);

      const usersReturned = await service.findAll();

      expect(usersReturned).toBeDefined();
      expect(usersReturned).toEqual(users);
    });
  });

  describe('Find By E-mail Suite', () => {
    it('should return a HttpException instance if email is invalid', async () => {
      try {
        await service.findByEmail('emailinvalido@teste123');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error?.message).toBe('E-mail is invalid');
        expect(error?.status).toBe(400);
      }
    });

    it('should return an user filtered by email successfully', async () => {
      const userFiltered = users.filter(
        (user) => user.email === mockUser.email,
      )[0];

      jest.spyOn(model, 'findOne').mockResolvedValueOnce(userFiltered);

      const userFounded = await service.findByEmail(mockUser.email);

      expect(userFounded).toHaveProperty('_id');
      expect(userFounded).toBeDefined();
      expect(userFounded.email).toEqual(mockUser.email);
    });
  });

  describe('E-mail Already Exists Suite', () => {
    it('should return a HttpException instance if the e-mail is invalid', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(users),
      } as any);

      try {
        await service.emailAlreadyExists('emailtest@123');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error?.message).toBe('E-mail is invalid');
        expect(error?.status).toBe(400);
      }
    });

    it('should return a HttpException instance if the e-mail already exists', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockUser),
      } as any);

      try {
        await service.emailAlreadyExists(
          Buffer.from(String(mockUser.email)).toString('base64'),
        );
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error?.message).toBe('E-mail already exists');
        expect(error?.status).toBe(400);
      }
    });

    it('should return an object with emailNotExists=true', async () => {
      const result = await service.emailAlreadyExists(
        Buffer.from(String('emailnovo@gmail.com')).toString('base64'),
      );
      expect(result).toBeDefined();
      expect(result).toMatchObject({
        emailNotExists: true,
      });
    });
  });
});

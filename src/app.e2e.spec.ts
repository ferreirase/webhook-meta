import supertest from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';

// GET /users(retorna todos os usuários cadastrados)
// POST /api/auth/login (loga na aplicação)

describe('App Module E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('Get /users', () => {
    return supertest(app.getHttpServer()).get('/users').expect(200);
  });

  describe('Login E2E', () => {
    it('Valid POST /api/auth/login', () => {
      return supertest(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'casemiro@gmail.com',
          password: 'Senha123@',
        })
        .expect(200);
    });

    it('Invalid POST /api/auth/login', () => {
      return supertest(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'casemiro@gmail.com',
          password: 'Senha123',
        })
        .expect(401);
    });
  });

  describe('Signup E2E', () => {
    const user = {
      name: 'Sandro Dias',
      email: 'sandro@gmail.com',
      phone: '+5562982978229',
      password: 'Senha123@',
      organization: 'Itaú',
      sector: 'Gerência',
    };

    const { name, ...userMissingFields } = user;

    const userInvalidPassword = {
      ...user,
      password: 'Senha123',
    };

    const userInvalidEmail = {
      ...user,
      email: 'nicolas@gmail',
    };

    it('Valid POST /signup', () => {
      try {
        return supertest(app.getHttpServer())
          .post('/signup')
          .send(user)
          .expect(201);
      } catch (error) {
        console.log(error);
      }
    });

    it('Missing Fields POST /signup', () => {
      return supertest(app.getHttpServer())
        .post('/signup')
        .send(userMissingFields)
        .expect(400);
    });

    it('Invalid Password POST /signup', () => {
      return supertest(app.getHttpServer())
        .post('/signup')
        .send(userInvalidPassword)
        .expect(400);
    });

    it('Invalid Email POST /signup', () => {
      return supertest(app.getHttpServer())
        .post('/signup')
        .send(userInvalidEmail)
        .expect(400);
    });
  });

  describe('Email already exists', () => {
    it('Valid GET /users/:email', () => {
      return supertest(app.getHttpServer())
        .get('/users/Y2FzZW1pcm9AY2FzZW1pcm8uY29t')
        .expect(200);
    });

    it('Invalid GET /users/:email', () => {
      return supertest(app.getHttpServer())
        .get('/users/Y2FzZW1pcm9AZW1haWwuY29t')
        .expect(400);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});

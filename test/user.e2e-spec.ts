import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('User GraphQL (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('User Queries', () => {
    it('should get users', () => {
      const query = `
        query {
          getUsers {
            id
            name
            email
            rut
            role {
              id
              name
            }
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200);
    });
  });

  describe('User Mutations', () => {
    it('should create user with valid data', () => {
      const mutation = `
        mutation {
          createUser(input: {
            name: "Juan Pérez"
            rut: "12345678-9"
            password: "password123"
            email: "juan@example.com"
            idRole: "role-id"
          }) {
            id
            name
            email
            rut
            role {
              id
              name
            }
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation })
        .expect(200);
    });

    it('should handle user creation with missing fields', () => {
      const mutation = `
        mutation {
          createUser(input: {
            name: "Juan Pérez"
            rut: "12345678-9"
            password: "password123"
            email: "juan@example.com"
          }) {
            id
            name
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation })
        .expect(400);
    });

    it('should handle user creation with invalid email', () => {
      const mutation = `
        mutation {
          createUser(input: {
            name: "Juan Pérez"
            rut: "12345678-9"
            password: "password123"
            email: "invalid-email"
            idRole: "role-id"
          }) {
            id
            name
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation })
        .expect(400);
    });
  });
});

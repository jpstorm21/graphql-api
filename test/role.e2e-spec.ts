import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Role GraphQL (e2e)', () => {
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

  describe('Role Queries', () => {
    it('should get roles', () => {
      const query = `
        query {
          getRoles {
            id
            name
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200);
    });
  });

  describe('Role Mutations', () => {
    it('should create role with valid data', () => {
      const mutation = `
        mutation {
          createRole(input: {
            name: "admin"
          }) {
            id
            name
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation })
        .expect(200);
    });

    it('should edit role with valid data', () => {
      const mutation = `
        mutation {
          editRole(id: "role-id", input: {
            name: "updated-admin"
          }) {
            id
            name
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation })
        .expect(200);
    });

    it('should delete role', () => {
      const mutation = `
        mutation {
          deleteRole(id: "role-id") {
            id
            name
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation })
        .expect(200);
    });

    it('should handle role creation with missing name', () => {
      const mutation = `
        mutation {
          createRole(input: {}) {
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

    it('should handle role creation with empty name', () => {
      const mutation = `
        mutation {
          createRole(input: {
            name: ""
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

    it('should handle edit role with non-existent id', () => {
      const mutation = `
        mutation {
          editRole(id: "non-existent", input: {
            name: "updated-name"
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

    it('should handle delete role with non-existent id', () => {
      const mutation = `
        mutation {
          deleteRole(id: "non-existent") {
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

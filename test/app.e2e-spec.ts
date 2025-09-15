import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('GraphQL API (e2e)', () => {
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

  describe('GraphQL Endpoint', () => {
    it('should respond to GraphQL queries', () => {
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

    it('should respond to GraphQL mutations', () => {
      const mutation = `
        mutation {
          createRole(input: { name: "test-role" }) {
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

    it('should handle invalid GraphQL queries', () => {
      const invalidQuery = `
        query {
          invalidField {
            id
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query: invalidQuery })
        .expect(400);
    });
  });

  describe('Health Check', () => {
    it('should return 200 for health check', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200);
    });
  });
});

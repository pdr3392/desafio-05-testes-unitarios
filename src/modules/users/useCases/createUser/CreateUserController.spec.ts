import { hash } from "bcryptjs";
import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { app } from "../../../../app";
import "../../../../database/index";

let connection: Connection;

describe("Create User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
    /*
    const id = uuidv4();
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at, updated_at)
        values('${id}', 'testUser', 'test@test.com.br', '${password}', 'now()', 'now()')
        `
    ); */
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "Pedro",
      email: "phrcorreia3392@gmail.com",
      password: "123456",
    });

    expect(response.statusCode).toBe(201);
  });

  it("should not be able to create a new user with an already picked up email address", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "Pedro",
      email: "phrcorreia3392@gmail.com",
      password: "123456",
    });

    expect(response.statusCode).toBe(400);
  });
});

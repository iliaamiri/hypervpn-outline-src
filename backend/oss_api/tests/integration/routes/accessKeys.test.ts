import request from 'supertest';
import getApplication from "../../../app";


describe("/keys REST API", () => {
  beforeAll(() => {
    process.env.SQLITE_FILE_PATH = "./tests/integration/dal/sqlite.db";
  });
  
  test("SQLite file path should be set", () => {
    expect(process.env.SQLITE_FILE_PATH).toBeDefined();
  });
  
  describe("GET /keys/all", () => {
    describe("Happy Path", async () => {
      const response = await request(getApplication()).get("/keys/all");
      expect(response.statusCode).toBe(200);
    });
    describe("Sad Path", () => {
    
    });
  });
  
  describe("GET /keys/getById/{key}", () => {
    describe("Happy Path", () => {
    
    });
    describe("Sad Path", () => {
    
    });
  });
});
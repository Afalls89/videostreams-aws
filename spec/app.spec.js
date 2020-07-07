process.env.NODE_ENV = "test";

const app = require("../app.js");
const request = require("supertest");

describe("/api", () => {
  test("status: 200 returns a json file with endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        console.log(body);
        expect(body).toHaveProperty(
          "GET /api",
          "GET /api/startstream/:user_id",
          "GET /api/endstream/:user_id"
        );
      });
  });
});

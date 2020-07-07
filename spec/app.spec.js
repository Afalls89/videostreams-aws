process.env.NODE_ENV = "test";

const app = require("../app.js");
const request = require("supertest");

describe("/", () => {
  test("status: 404 returns object with message of Route not found", () => {
    return request(app)
      .get("/isNotAPath")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toEqual("Route not found");
      });
  });
});

describe("/api", () => {
  describe("INVALID METHODS", () => {
    test("returns status: 405, with object containing message of  Method not allowed", () => {
      const invalidMethods = ["patch", "put", "delete", "post"];
      const promises = invalidMethods.map((method) => {
        return request(app)
          [method]("/api")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).toEqual("Method not allowed");
          });
      });
      return Promise.all(promises);
    });
  });
  describe("GET", () => {
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
});

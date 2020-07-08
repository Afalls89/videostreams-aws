process.env.NODE_ENV = "test";

const app = require("../app.js");
const request = require("supertest");
const knex = require("../db/connection");

beforeEach(() => {
  return knex.seed.run();
});

// after(() => {
//   return knex.destroy();
// });

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
  test("status: 404 returns object with message of Route not found", () => {
    return request(app)
      .get("/api/isNotAPath")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toEqual("Route not found");
      });
  });
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

  describe("/api/startstream/1", () => {
    describe("INVALID METHODS", () => {
      test("returns status: 405, with object containing message of  Method not allowed", () => {
        const invalidMethods = ["patch", "put", "delete", "post"];
        const promises = invalidMethods.map((method) => {
          return request(app)
            [method]("/api/startstream/1")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).toEqual("Method not allowed");
            });
        });
        return Promise.all(promises);
      });
    });
    describe("GET", () => {
      test("status: 200 if user who already has one active stream , requests to open another stream", () => {
        return request(app)
          .get("/api/startstream/1")
          .expect(200)
          .then(({ body }) => {
            console.log(body);
            expect(body.streamStatus).toHaveProperty(
              "isNewStreamAllowed",
              true
            );
            expect(body.streamStatus).toHaveProperty("streamCount", 2);
          });
      });
      test("status: 200 if user is starting their first stream , requests to open first stream", () => {
        return request(app)
          .get("/api/startstream/4")
          .expect(200)
          .then(({ body }) => {
            console.log(body);
            expect(body.streamStatus).toHaveProperty(
              "isNewStreamAllowed",
              true
            );
            expect(body.streamStatus).toHaveProperty("streamCount", 1);
          });
      });
      test("status: 200 if user already has three active stream , requests to open a fourth stream, returns isNewStreamAllowed = false  ", () => {
        return request(app)
          .get("/api/startstream/3")
          .expect(200)
          .then(({ body }) => {
            console.log(body);
            expect(body.streamStatus).toHaveProperty(
              "isNewStreamAllowed",
              false
            );
            expect(body.streamStatus).toHaveProperty("streamCount", 3);
          });
      });
      test("status: 400 if user ID supplied in request is not a number", () => {
        return request(app)
          .get("/api/startstream/two")
          .expect(400)
          .then(({ body: { msg } }) => {
            console.log(msg);
            expect(msg).toEqual("user_id is invalid , needs to be a number");
          });
      });
    });
  });

  describe("/api/endstream/:user_id", () => {
    describe("INVALID METHODS", () => {
      test("returns status: 405, with object containing message of  Method not allowed", () => {
        const invalidMethods = ["patch", "put", "delete", "post"];
        const promises = invalidMethods.map((method) => {
          return request(app)
            [method]("/api/endstream/2")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).toEqual("Method not allowed");
            });
        });
        return Promise.all(promises);
      });
    });
    describe("GET", () => {
      test("status: 200 if user who already has one active stream , requests to close a stream", () => {
        return request(app)
          .get("/api/endstream/2")
          .expect(200)
          .then(({ body }) => {
            console.log(body);
            expect(body.streamStatus).toHaveProperty("msg", "stream closed");
            expect(body.streamStatus).toHaveProperty("streamCount", 1);
          });
      });

      test("status: 400 if user ID supplied in request is not a number", () => {
        return request(app)
          .get("/api/endstream/two")
          .expect(400)
          .then(({ body: { msg } }) => {
            console.log(msg);
            expect(msg).toEqual("user_id is invalid , needs to be a number");
          });
      });
      test("status: 400 if user has no active streams, yet requests to close one", () => {
        return request(app)
          .get("/api/endstream/5")
          .expect(400)
          .then(({ body: { msg } }) => {
            console.log(msg);
            expect(msg).toEqual("no active streams to close for user");
          });
      });
      test("status: 400 if user has no active streams, yet requests to close one", () => {
        return request(app)
          .get("/api/endstream/999999")
          .expect(400)
          .then(({ body: { msg } }) => {
            console.log(msg);
            expect(msg).toEqual("user_id not present in the database");
          });
      });
    });
  });
});

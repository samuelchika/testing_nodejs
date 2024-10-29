const request = require("supertest");
const app = require("../../app");

const newTodo = require("../mock-data/new-todo.json");
const endpointUrl = "/todos/";
let _id;

describe(endpointUrl, () => {
  it(`POST  ${endpointUrl}`, async () => {
    const response = await request(app).post(endpointUrl).send(newTodo);

    expect(response.statusCode).toBe(201);
    expect(response.body._id).toBeDefined();
    _id = response.body._id;
    expect(response.body.title).toBe(newTodo.title);
    expect(response.body.done).toBe(newTodo.done);
  });

  it("Error Handling expects 500", async () => {
    const response = await request(app)
      .post(endpointUrl)
      .send({ title: "Done property missing" });
    expect(response.statusCode).toBe(500);
    expect(response.body.message).toStrictEqual("Done property is missing");
  });
});

describe("Fetching single todo", () => {
  it("Get a single todo", async () => {
    const response = await request(app).get(endpointUrl + _id);
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBeDefined();
    expect(response.body.title).toBeDefined();
    expect(response.body.done).toBeDefined();
  });

  it("Error Handling expects 404", async () => {
    const response = await request(app).get(
      endpointUrl + "670d2ee5ae52911904431207"
    );
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toStrictEqual("Todo not found");
  });
});
describe("Fetch all todos", () => {
  it("Get all todos", async () => {
    const response = await request(app).get(endpointUrl);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].title).toBeDefined();
    expect(response.body[0].done).toBeDefined();
  });
});

describe("Updating a new Todo", () => {
  it("Update a new Todo", async () => {
    const putData = { title: "Updated Title", done: true };
    const response = await request(app)
      .put(endpointUrl + _id)
      .send(putData);

    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBeDefined();
    expect(response.body.title).toStrictEqual("Updated Title");
    expect(response.body.done).toBe(true);
  });

  it("Error Handling expects 404", async () => {
    const response = await request(app)
      .put(endpointUrl + "670d2ee5ae52911904431207")
      .send({ ...newTodo, title: "Updated Title" });

    expect(response.statusCode).toBe(404);
  });
});

describe("Deleting Todo", () => {
  it("Delete a Todo", async () => {
    const response = await request(app).delete(endpointUrl + _id);

    expect(response.statusCode).toBe(204);
    expect(response.body).toBeDefined();
    console.log(response.body);
  });
});

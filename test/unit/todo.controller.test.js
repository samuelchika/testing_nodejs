const TodoController = require("../../controllers/todo.controller");
const TodoModel = require("../../models/todo.models");
const httpMocks = require("node-mocks-http");

const newTodo = require("../mock-data/new-todo.json");
const allTodo = require("../mock-data/all-todo.json");

// // create a mock for the mongoose model
// TodoModel.create = jest.fn(); // This is a mock function, adding createTodo funcionality to the TodoModel constructor
// TodoModel.find = jest.fn(); // This is a mock function, adding find
// TodoModel.findById = jest.fn(); // This is a mock
// TodoModel.findByIdAndUpdate = jest.fn(); // This is a mock
jest.mock("../../models/todo.models"); // you pass the file path and not the variable reference.

let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe("TodoCotroller deleteTodo", () => {
  it("Calls the deleteTodo method", async () => {
    expect(typeof TodoController.deleteTodo).toBe("function");
  });

  it("Called the TodoModel.findByIdAndDelete method", async () => {
    req.params.id = "670d2eac90501973e14559b2"; //
    await TodoController.deleteTodo(req, res, next);
    expect(TodoModel.findByIdAndDelete).toBeCalledWith(
      "670d2eac90501973e14559b2"
    );
  });

  it("Should return the deleted Todo object", async () => {
    req.params.id = "670d2eac90501973e14559";
    TodoModel.findByIdAndDelete.mockReturnValue({
      ...newTodo,
      _id: "670d2eac90501973e14559",
    });
    await TodoController.deleteTodo(req, res, next);
    expect(res.statusCode).toBe(204);
    expect(res._isEndCalled).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual({
      _id: "670d2eac90501973e14559",
      ...newTodo,
    });
  });

  it("Should return Error", async () => {
    const errorMessage = { message: "Error Deleting Todo" };
    const rejectPromise = Promise.reject(errorMessage);
    req.params.id = "670d2eac90501973e14559b3"; //
    TodoModel.findByIdAndDelete.mockReturnValue(rejectPromise);
    await TodoController.deleteTodo(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });

  it("Should return 404 Error", async () => {
    req.params.id = "670d2eac90501973e14559b3"; //
    TodoModel.findByIdAndDelete.mockReturnValue(null);
    await TodoController.deleteTodo(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual({ message: "Todo not found" });
  });
});

describe("TodoController updateTodo", () => {
  it("Call the updateTodo Function", () => {
    expect(typeof TodoController.updateTodo).toBe("function");
  });

  it("Check if the TodoModel.findByIdAndUpdate function is called", async () => {
    req.params.id = "670d2eac90501973e14559b2"; //
    req.body = newTodo;
    await TodoController.updateTodo(req, res, next);
    expect(TodoModel.findByIdAndUpdate).toBeCalledWith(
      "670d2eac90501973e14559b2",
      newTodo,
      {
        new: true,
        useFindAndModify: false,
        runValidators: true,
      }
    );
  });

  it("Should return the updated TodoModel", async () => {
    TodoModel.findByIdAndUpdate.mockReturnValue({
      id: "670d2eac90501973e14559b2",
      ...newTodo,
      done: true,
    });
    req.params.id = "670d2eac90501973e14559b2"; //
    await TodoController.updateTodo(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual({
      ...newTodo,
      id: "670d2eac90501973e14559b2",
      done: true,
    });
  });

  it("Should return Error", async () => {
    const errorMessage = { message: "Error updating Todo" };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
    req.params.id = "670d2eac90501973e14559b2"; //
    await TodoController.updateTodo(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });

  it("Should return Error 404", async () => {
    TodoModel.findByIdAndUpdate.mockReturnValue(null);
    req.params.id = "670d2eac90501973e14559b2"; //
    await TodoController.updateTodo(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toStrictEqual({ message: "Todo not found" });
  });
});

describe("TodoController getTodoById", () => {
  it("should have the TodoController.getTododById method", () => {
    expect(typeof TodoController.getTodoById).toBe("function");
  });

  it("Should call TodoModel.findById with parameters", async () => {
    req.params.id = "670d2eac90501973e14559b2"; // 3
    await TodoController.getTodoById(req, res, next); //2
    expect(TodoModel.findById).toBeCalledWith("670d2eac90501973e14559b2"); // 1
  });

  it("Should return JSON response", async () => {
    TodoModel.findById.mockReturnValue({
      id: "670d2eac90501973e14559b2",
      ...newTodo,
    });
    req.params.id = "670d2eac90501973e14559b2"; //
    await TodoController.getTodoById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled).toBeTruthy();
    expect(JSON.parse(res._getData())).toStrictEqual({
      ...newTodo,
      id: "670d2eac90501973e14559b2",
    });
  });

  it("Should return Error response", async () => {
    const errorMessage = { message: "Todo not found" };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.findById.mockReturnValue(rejectedPromise);
    req.param.id = "670d2eac90501973e14559b";
    await TodoController.getTodoById(req, res, next); // This function will fetch a todo
    expect(next).toHaveBeenCalledWith(errorMessage);
  });

  it("Should return 404 when item don't exist", async () => {
    TodoModel.findById.mockResolvedValue(null); // This is the mock response that the TodoModel.findById will return
    req.params.id = "670d2eac90501973e14559b";
    await TodoController.getTodoById(req, res, next); // This function will fetch a todo
    expect(res.statusCode).toBe(404);
  });
});
describe("TodoController.getTodo", () => {
  // we have to verify the getTodo method exist
  it("Should have a getTodo method", () => {
    expect(typeof TodoController.getTodo).toBe("function");
  });

  it("Should call TodoModel.find", () => {
    TodoController.getTodo(req, res, next);
    expect(TodoModel.find).toBeCalled();
  });

  it("Should return JSON response", async () => {
    TodoModel.find.mockResolvedValue([allTodo]); // This is the mock response that the TodoModel.find will return
    await TodoController.getTodo(req, res, next); // This function will fetch all todos

    expect(res.statusCode).toBe(200); // This is what we expected when the function above is called
    expect(res._isEndCalled).toBeTruthy(); //
    expect(JSON.parse(res._getData())).toStrictEqual([allTodo]);
  });
  it("Should return Error when encountered exception", async () => {
    const errorMessage = { message: "Error finding Todo" };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.find.mockReturnValue(rejectedPromise);
    await TodoController.getTodo(req, res, next); // This function will fetch all todos
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});
describe("TodoController.createTodo", () => {
  beforeEach(() => {
    req.body = newTodo;
  });
  it("Should have a createTodo function", () => {
    expect(typeof TodoController.createTodo).toBe("function");
  });

  it("Should call TodoModel.create", () => {
    // we can mock our req, res and next objects
    // req.body = newTodo; - Changed this to seen from the beforeEach under the describe.
    // This below will call the TodoConroller.createTodo function
    // we are expecting, when the function is executed, TodoModel.createTodo should also be called
    // we can't see if a functon is called if we dont use jest.fn()
    TodoController.createTodo(req, res, next);
    //expect(TodoModel.createTodo).toBeCalled();
    expect(TodoModel.create).toBeCalledWith(newTodo);
  });

  it("Should return 201 response code", async () => {
    // THis is not about the function to run inside the controller
    // This is more about the response from the controller function itself.
    // req.body = newTodo; - Changed this to seen from the beforeEach under the describe.
    await TodoController.createTodo(req, res, next); // This function will create or Todo
    expect(res.statusCode).toBe(201); // This is what we expected when the function above is called
    expect(res._isEndCalled()).toBeTruthy(); // This is to check if the response has been ended (which means it has been sent to the client)
  });

  it("Should return JSON body in response", async () => {
    TodoModel.create.mockReturnValue(newTodo); // The expected value from the mock function
    await TodoController.createTodo(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newTodo);
  });

  it("Should handle error", async () => {
    const errorMessage = { message: "Done property missing" };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.create.mockReturnValue(rejectedPromise); // The expected value from the mock function
    await TodoController.createTodo(req, res, next);
    expect(next).toBeCalledWith(errorMessage); // This is what we expected when the function above is called
  });
});

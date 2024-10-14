const TodoController = require("../../controllers/todo.controller");
const TodoModel = require("../../models/todo.models");
const httpMocks = require("node-mocks-http");

const newTodo = require("../mock-data/new-todo.json");

// create a mock for the mongoose model
TodoModel.createTodo = jest.fn(); // This is a mock function, adding createTodo funcionality to the TodoModel constructor

let req, res, next;
beforeEach(() => {        
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = null;
})
describe('TodoController.createTodo', () => {
    beforeEach(() => {
        req.body = newTodo;
    })
    it('Should have a createTodo function', () => {
        expect(typeof TodoController.createTodo).toBe('function');
    });

    it("Should call TodoModel.create", () => {
        // we can mock our req, res and next objects
        // req.body = newTodo; - Changed this to seen from the beforeEach under the describe.
        // This below will call the TodoConroller.createTodo function
        // we are expecting, when the function is executed, TodoModel.createTodo should also be called
        // we can't see if a functon is called if we dont use jest.fn()
        TodoController.createTodo(req, res, next);
        //expect(TodoModel.createTodo).toBeCalled();
        expect(TodoModel.createTodo).toBeCalledWith(newTodo);
    });

    it("Should return 201 response code", () => {
        // THis is not about the function to run inside the controller
        // This is more about the response from the controller function itself.
        // req.body = newTodo; - Changed this to seen from the beforeEach under the describe.
        TodoController.createTodo(req, res, next); // This function will create or Todo
        expect(res.statusCode).toBe(201); // This is what we expected when the function above is called
        expect(res._isEndCalled()).toBeTruthy(); // This is to check if the response has been ended (which means it has been sent to the client)
    });
    
    it("Should return JSON body in response", () => {
        TodoModel.createTodo.mockReturnValue(newTodo); // The expected value from the mock function
        TodoController.createTodo(req, res, next);
        expect(res._getJSONData()).toStrictEqual(newTodo);
    })
});

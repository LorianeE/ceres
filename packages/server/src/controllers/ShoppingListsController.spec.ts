import {TestContext} from "@tsed/testing";
import {ShoppingListsController} from "./ShoppingListsController";
import {ShoppingListService} from "../services/ShoppingListService";
import {BadRequest, NotFound} from "ts-httpexceptions";
import {ShoppingList} from "../models/ShoppingList";

describe("ShoppingListsController", () => {
    describe("get()", () => {
        beforeEach(() => TestContext.create());
        afterEach(() => TestContext.reset());

        it("should return a result from shoppinglistservice if not undefined", async () => {
            // GIVEN
            const shoppingListService = {
                find: jest.fn().mockResolvedValue({id: "1", items: []})
            };

            const shoppingListCtrl = await TestContext.invoke(ShoppingListsController, [{
                provide: ShoppingListService,
                use: shoppingListService
            }]);

            // WHEN
            const result = await shoppingListCtrl.get({}, "1");

            // THEN
            expect(result).toEqual({id: "1", items: []});
            expect(shoppingListService.find).toHaveBeenCalledTimes(1);
            expect(shoppingListService.find).toHaveBeenCalledWith("1");

            expect(shoppingListCtrl).toBeInstanceOf(ShoppingListsController);
            expect(shoppingListCtrl.shoppingListService).toEqual(shoppingListService);
        });

        it("should return notfound error if result from shoppinglistservice is undefined", async () => {
            // GIVEN
            const shoppingListService = {
                find: jest.fn().mockResolvedValue(undefined)
            };

            const shoppingListCtrl = await TestContext.invoke(ShoppingListsController, [{
                provide: ShoppingListService,
                use: shoppingListService
            }]);

            // WHEN
            let actualError;
            try {
                const result = await shoppingListCtrl.get({}, "1");
            } catch (e) {
                actualError = e;
            }

            // THEN
            expect(shoppingListCtrl.shoppingListService).toEqual(shoppingListService);
            expect(shoppingListService.find).toHaveBeenCalledTimes(1);
            expect(shoppingListService.find).toHaveBeenCalledWith("1");
            expect(actualError).toBeInstanceOf(NotFound);
        });
    });
    describe("create()", () => {
        beforeEach(() => TestContext.create());
        afterEach(() => TestContext.reset());

        it("should return a result from shoppinglistservice if not undefined", async () => {
            // GIVEN
            const shoppingList = new ShoppingList();
            shoppingList._id = "1234";
            shoppingList.items = [];

            const shoppingListService = {
                save: jest.fn().mockResolvedValue(shoppingList)
            };

            const shoppingListCtrl = await TestContext.invoke(ShoppingListsController, [{
                provide: ShoppingListService,
                use: shoppingListService
            }]);

            // WHEN
            const result = await shoppingListCtrl.create(shoppingList);

            // THEN
            expect(shoppingListService.save).toHaveBeenCalledTimes(1);
            expect(shoppingListService.save).toHaveBeenCalledWith(shoppingList);
            expect(result).toEqual(shoppingList);
        });
        it("should throw error if shoppinglistservice throws error", async () => {
            // GIVEN
            const shoppingList = new ShoppingList();
            shoppingList._id = "1234";
            shoppingList.items = [];

            const shoppingListService = {
                save: jest.fn().mockRejectedValue(new Error("An error occured"))
            };

            const shoppingListCtrl = await TestContext.invoke(ShoppingListsController, [{
                provide: ShoppingListService,
                use: shoppingListService
            }]);

            // WHEN
            let actualError;
            try {
                await shoppingListCtrl.create(shoppingList);
            } catch (e) {
                actualError = e;
            }

            // THEN
            expect(shoppingListService.save).toHaveBeenCalledTimes(1);
            expect(actualError).toBeInstanceOf(Error);
        });
    });
    describe("update()", () => {
        beforeEach(() => TestContext.create());
        afterEach(() => TestContext.reset());

        it("should return a result from shoppinglistservice if ok", async () => {
            // GIVEN
            const shoppingList = new ShoppingList();
            shoppingList._id = "1234";
            shoppingList.items = [];

            const shoppingListService = {
                save: jest.fn().mockResolvedValue(shoppingList)
            };

            const shoppingListCtrl = await TestContext.invoke(ShoppingListsController, [{
                provide: ShoppingListService,
                use: shoppingListService
            }]);

            // WHEN
            const result = await shoppingListCtrl.update("1234", shoppingList);

            // THEN
            expect(shoppingListService.save).toHaveBeenCalledTimes(1);
            expect(shoppingListService.save).toHaveBeenCalledWith(shoppingList);
            expect(result).toEqual(shoppingList);
        });
        it("should throw BadRequest if shoppinglist id does not match with path id", async () => {
            // GIVEN
            const shoppingList = new ShoppingList();
            shoppingList._id = "1";
            shoppingList.items = [];

            const shoppingListService = {
                save: jest.fn().mockResolvedValue(shoppingList)
            };

            const shoppingListCtrl = await TestContext.invoke(ShoppingListsController, [{
                provide: ShoppingListService,
                use: shoppingListService
            }]);

            // WHEN
            let actualError;
            try {
                const result = await shoppingListCtrl.update("1234", shoppingList);
            } catch (e) {
                actualError = e;
            }

            // THEN
            expect(shoppingListService.save).toHaveBeenCalledTimes(0);
            expect(actualError).toBeInstanceOf(BadRequest);
        });
        it("should throw error if shoppinglistservice throws error", async () => {
            // GIVEN
            const shoppingList = new ShoppingList();
            shoppingList._id = "1234";
            shoppingList.items = [];

            const shoppingListService = {
                save: jest.fn().mockRejectedValue(new Error("An error occured"))
            };

            const shoppingListCtrl = await TestContext.invoke(ShoppingListsController, [{
                provide: ShoppingListService,
                use: shoppingListService
            }]);

            // WHEN
            let actualError;
            try {
                await shoppingListCtrl.update("1234", shoppingList);
            } catch (e) {
                actualError = e;
            }

            // THEN
            expect(shoppingListService.save).toHaveBeenCalledTimes(1);
            expect(actualError).toBeInstanceOf(Error);
        });
    });
})
;

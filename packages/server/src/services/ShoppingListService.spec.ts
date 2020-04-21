import {TestContext} from "@tsed/testing";
import {ShoppingListService} from "./ShoppingListService";
import {ShoppingList} from "../models/ShoppingList";

describe("ShoppingListService", () => {
    afterEach(() => jest.resetAllMocks());
    describe("find()", () => {
        beforeEach(() => TestContext.create());
        afterEach(() => TestContext.reset());

        it("should return all products from db", async () => {
            // GIVEN
            const products = {
                findById: jest.fn().mockResolvedValue([{id: "1234"}]),
            };

            const shoppingListService = await TestContext.invoke(ShoppingListService, [
                {
                    provide: ShoppingList,
                    use: products,
                },
            ]);

            // WHEN
            const result = await shoppingListService.find('1234');

            // THEN
            expect(result).toEqual([{id: "1234"}]);
            expect(products.findById).toHaveBeenCalled();

            expect(shoppingListService).toBeInstanceOf(ShoppingListService);
        });
    });
});

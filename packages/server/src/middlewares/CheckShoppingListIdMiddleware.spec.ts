import {PlatformTest} from "@tsed/common";
import {BadRequest} from "@tsed/exceptions";
import {CheckShoppingListIdMiddleware} from "./CheckShoppingListIdMiddleware";
import {ShoppingList} from "../models/ShoppingList";

describe("CheckShoppingListIdMiddleware", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  it("should throw BadRequest error if shopping list id does not match id in param", async () => {
    // GIVEN
    const checkShoppingListIdMiddleware = PlatformTest.get<CheckShoppingListIdMiddleware>(CheckShoppingListIdMiddleware);
    const shoppingListId = "shoppingListId";
    const shoppingList = new ShoppingList();
    shoppingList._id = "anotherShoppingList";

    // WHEN
    let actualError;
    try {
      await checkShoppingListIdMiddleware.use(shoppingListId, shoppingList);
    } catch (e) {
      actualError = e;
    }

    // THEN
    expect(actualError).toBeInstanceOf(BadRequest);
  });
  it("should not throw BadRequest error if shopping list id does match id in param", async () => {
    // GIVEN
    const checkShoppingListIdMiddleware = PlatformTest.get<CheckShoppingListIdMiddleware>(CheckShoppingListIdMiddleware);
    const shoppingListId = "shoppingListId";
    const shoppingList = new ShoppingList();
    shoppingList._id = "shoppingListId";

    // WHEN
    let actualError;
    try {
      await checkShoppingListIdMiddleware.use(shoppingListId, shoppingList);
    } catch (e) {
      actualError = e;
    }

    // THEN
    expect(actualError).toBeUndefined();
  });
});

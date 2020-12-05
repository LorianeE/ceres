import {Controller} from "@tsed/common";
import {ShoppingListsController} from "./ShoppingListsController";
import {UserProductsController} from "./UserProductsController";

@Controller({
  path: "/users",
  children: [ShoppingListsController, UserProductsController]
})
export class UsersController {}

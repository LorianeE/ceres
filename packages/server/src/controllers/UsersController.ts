import {BodyParams, Controller, PathParams, Post} from "@tsed/common";
import {ShoppingListsController} from "./ShoppingListsController";
import {UserProductsController} from "./UserProductsController";
import {Returns, Summary} from "@tsed/schema";
import {Store} from "../models/Store";
import {StoreService} from "../services/StoreService";
import {UsersService} from "../services/users/UsersService";

@Controller({
  path: "/users",
  children: [ShoppingListsController, UserProductsController]
})
export class UsersController {
  constructor(private storeService: StoreService, private usersService: UsersService) {}

  @Post("/:userId/store")
  @Summary("Add a new store for a user")
  @Returns(201, Store)
  async addStore(@PathParams("userId") userId: string, @BodyParams(Store) store: Store): Promise<Store> {
    const createdStore = await this.storeService.save(store);
    await this.usersService.addStore(userId, createdStore);

    return createdStore;
  }
}

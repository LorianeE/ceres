import {BodyParams, Controller, Delete, Get, PathParams, Post, Put, UseBefore, UseBeforeEach} from "@tsed/common";
import {Groups, Returns, Summary} from "@tsed/schema";
import {Authenticate} from "@tsed/passport";
import {Store} from "../models/Store";
import {StoreService} from "../services/StoreService";
import {StoreItem} from "../models/StoreItem";
import {CheckItemIdMiddleware} from "../middlewares/CheckItemIdMiddleware";
import {NotFound} from "@tsed/exceptions";
import {UsersService} from "../services/users/UsersService";
import {CheckIsAllowedUserStoreMiddleware} from "../middlewares/CheckIsAllowedUserStoreMiddleware";

@Controller("/stores")
@Authenticate("facebook")
@UseBeforeEach(CheckIsAllowedUserStoreMiddleware)
export class StoreController {
  constructor(private storeService: StoreService, private usersService: UsersService) {}

  @Get("/:storeId")
  @Summary("Get a store")
  @Returns(200, Store)
  async getStore(@PathParams("storeId") storeId: string): Promise<Store> {
    const store = await this.storeService.find(storeId);
    if (!store) {
      throw new NotFound("Store not found.");
    }
    return store;
  }

  @Post("/:storeId/items")
  @Summary("Add a new item to store")
  @Returns(201, StoreItem)
  async addStoreItem(
    @PathParams("storeId") storeId: string,
    @BodyParams(StoreItem) @Groups("creation") item: StoreItem
  ): Promise<StoreItem> {
    return this.storeService.addItemToStore(storeId, item);
  }

  @Put("/:storeId/items/:itemId")
  @UseBefore(CheckItemIdMiddleware)
  @Summary("Update an item in store")
  @Returns(200, StoreItem)
  async updateStoreItem(@PathParams("storeId") storeId: string, @BodyParams(StoreItem) item: StoreItem): Promise<StoreItem | null> {
    return this.storeService.updateStoreItem(storeId, item);
  }

  @Delete("/:storeId/items/:itemId")
  @Summary("Remove an item in store")
  @Returns(204)
  async removeStoreItem(@PathParams("storeId") storeId: string, @PathParams("itemId") itemId: string): Promise<void> {
    return this.storeService.removeStoreItem(storeId, itemId);
  }
}

import {BodyParams, Controller, Delete, Get, PathParams, Post, Put, UseBefore, UseBeforeEach} from "@tsed/common";
import {Groups, Returns, Summary} from "@tsed/schema";
import {Authenticate} from "@tsed/passport";
import {CheckUserIdMiddleware} from "../middlewares/CheckUserIdMiddleware";
import {Store} from "../models/Store";
import {StoreService} from "../services/StoreService";
import {StoreItem} from "../models/StoreItem";
import {CheckItemIdMiddleware} from "../middlewares/CheckItemIdMiddleware";

@Controller("/:userId/store")
@Authenticate("facebook")
@UseBeforeEach(CheckUserIdMiddleware)
export class StoreController {
  constructor(private storeService: StoreService) {}

  @Get("/")
  @Summary("Get user's store")
  @Returns(200, Store)
  async getStore(@PathParams("userId") userId: string): Promise<Store> {
    return this.storeService.getUserStore(userId);
  }

  @Post("/")
  @Summary("Add a new store for a user")
  @Returns(201, Store)
  async addStore(@PathParams("userId") userId: string, @BodyParams(Store) store: Store): Promise<Store> {
    return this.storeService.addStoreForUser(userId, store);
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

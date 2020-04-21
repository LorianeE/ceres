import {inject, TestContext} from "@tsed/testing";
import {ProductsService} from "./ProductsService";
import Product from "../models/Product";
import {ShelfTypes} from "../models/ShelfTypes";
import {DuplicateKeyError} from "./errors/DuplicateKeyError";
// import {DuplicateKeyError} from "./errors/DuplicateKeyError";
//
// const mockSave = jest.fn();
// jest.mock('../models/Product', () => {
//     return {
//         default: jest.fn().mockImplementation(() => {
//             return {save: mockSave};
//         })
//     }
// });

describe("ProductsService", () => {
    afterEach(() => jest.resetAllMocks());
    describe("findAll()", () => {
        beforeEach(() => TestContext.create());
        afterEach(() => TestContext.reset());

        it("should return all products from db", async () => {
            // GIVEN
            const products = {
                find: jest.fn().mockResolvedValue([{id: "eggs"}]),
            };

            const productsService = await TestContext.invoke(ProductsService, [
                {
                    provide: Product,
                    use: products,
                },
            ]);

            // WHEN
            const result = await productsService.findAll();

            // THEN
            expect(result).toEqual([{id: "eggs"}]);
            expect(products.find).toHaveBeenCalled();

            expect(productsService).toBeInstanceOf(ProductsService);
        });
    });
    // describe("save()", () => {
    //     describe("when everything is ok", () => {
    //         beforeEach(() => TestContext.create());
    //         afterEach(() => TestContext.reset());
    //
    //         it("should save product", async () => {
    //             // GIVEN
    //             const product = new Product();
    //             product.id = "apple";
    //             product.label = "Pommes";
    //             product.shelf = ShelfTypes.PRODUCE;
    //
    //             const products = jest.fn().mockImplementation(function () {
    //                 return {
    //                     save: jest.fn().mockResolvedValue('toto')
    //                 }
    //             });
    //
    //             const productsService = await TestContext.invoke(ProductsService, [
    //                 {
    //                     provide: Product,
    //                     use: products,
    //                 },
    //             ]);
    //
    //             // WHEN
    //             await productsService.save(product);
    //
    //             // THEN
    //             expect(products().save).toHaveBeenCalledTimes(1);
    //
    //             expect(productsService).toBeInstanceOf(ProductsService);
    //         });
    //     });
    //     describe("when an error is thrown", () => {
    //         beforeEach(() => TestContext.create());
    //         afterEach(() => TestContext.reset());
    //
    //         it("should not save product", async () => {
    //             // GIVEN
    //             const product = new Product();
    //             product.id = 'apple';
    //             product.label = "Pommes";
    //             product.shelf = ShelfTypes.PRODUCE;
    //
    //             const error = new DuplicateKeyError();
    //             error.code = 11000;
    //
    //             const products = jest.fn().mockImplementation(function () {
    //                 return {
    //                     save: jest.fn().mockResolvedValue('toto')
    //                 }
    //             });
    //
    //             const productsService = await TestContext.invoke(ProductsService, [
    //                 {
    //                     provide: Product,
    //                     use: products,
    //                 },
    //             ]);
    //
    //             // WHEN
    //             let actualError;
    //             try {
    //                 await productsService.save(product);
    //             } catch (err) {
    //                 actualError = err;
    //             }
    //
    //             // THEN
    //             expect(productsService.products).toEqual(products);
    //             // expect(actualError).toEqual({});
    //             // expect(Product).toHaveBeenCalledTimes(1);
    //
    //         });
    //     });
    // });






    // describe("save()", () => {
    //     describe("when everything is ok", () => {
    //         beforeEach(() => TestContext.create());
    //         afterEach(() => TestContext.reset());
    //
    //         it("should save product", inject([ProductsService],  (productsService: ProductsService) => {
    //             // GIVEN
    //             const product = new Product();
    //             product.id = "apple";
    //             product.label = "Pommes";
    //             product.shelf = ShelfTypes.PRODUCE;
    //
    //             // WHEN
    //             const result = productsService.save(product);
    //
    //             // THEN
    //             // expect(result).toEqual([{id: "eggs"}]);
    //             expect(Product).toHaveBeenCalledTimes(1);
    //
    //             expect(productsService).toBeInstanceOf(ProductsService);
    //         }));
    //     });
    //     // describe("when an error is thrown", () => {
    //     //     beforeEach(() => TestContext.create());
    //     //     afterEach(() => TestContext.reset());
    //     //
    //     //     it("should not save product", inject([ProductsService],  async (productsService: ProductsService) => {
    //     //         // GIVEN
    //     //         const product = new Product();
    //     //         product.id = 'apple';
    //     //         product.label = "Pommes";
    //     //         product.shelf = ShelfTypes.PRODUCE;
    //     //
    //     //         const error = new DuplicateKeyError();
    //     //         error.code = 11000;
    //     //
    //     //         const mockSave = jest.fn().mockRejectedValue(error);
    //     //         jest.mock('../models/Product', () => {
    //     //             return jest.fn().mockImplementation(() => {
    //     //                 return {save: mockSave};
    //     //             });
    //     //         });
    //     //
    //     //         // WHEN
    //     //         let actualError;
    //     //         try {
    //     //             await productsService.save(product);
    //     //         } catch (err) {
    //     //             actualError = err;
    //     //         }
    //     //
    //     //         // THEN
    //     //         // expect(result).toEqual([{id: "eggs"}]);
    //     //         expect(Product).toHaveBeenCalledTimes(1);
    //     //
    //     //     }));
    //     // });
    // });
});

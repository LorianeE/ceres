import {Controller, Get} from "@tsed/common";

@Controller("/products")
export class ProductsController {
  @Get("/")
  get() {
    return [
      {
        id: "baconStrips",
        label: "Lardons",
        shelf: "cold"
      },
      {
        id: "cider",
        label: "Cidre",
        shelf: "drinks"
      },
      {
        id: "apple",
        label: "Pommes",
        shelf: "produce"
      },
      {
        id: "pear",
        label: "Poires",
        shelf: "produce"
      },
      {
        id: "pineapple",
        label: "Ananas",
        shelf: "produce"
      },
      {
        id: "bigCreamJar",
        label: "Gros pot de crème",
        shelf: "cold"
      },
      {
        id: "smokedHam-4",
        label: "Jambon fumé - 4 tranches",
        shelf: "cold"
      }
    ];
  }
}

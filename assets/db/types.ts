import menuJson from "./menuItems.json";
export interface MenuList {
  Drinks: DrinkData[];
  Fries: Fries[];
  Cheesestick: Cheesestick[];
  "Snack with Drink": SnackWithDrink[];
  Frappe: Cheesestick[];
  Siomai: Siomai[];
  "Add On": AddOn[];
}

export interface DrinkData {
  id: string;
  menu_name: string;
  price: OzDrinkPrice;
}

export interface OzDrinkPrice {
  "12oz": number;
  "16oz": number;
  "22oz": number;
}

export interface Fries {
  id: string;
  menu_name: string;
  price: FryPrice;
}

export interface FryPrice {
  small: number;
  medium: number;
  large: number;
  jumbo: number;
  monster: number;
}

export interface Cheesestick {
  id: string;
  menu_name: string;
  price: CheesestickPrice;
}

export interface CheesestickPrice {
  "8pcs": number;
  "12pcs": number;
  "16pcs": number;
  "20pcs": number;
}

export interface SnackWithDrink {
  id: string;
  menu_name: string;
  price: SnackWithDrinkPrice;
}

export interface SnackWithDrinkPrice {
  "with Fruit Juice": number;
  "with Milk Tea": number;
}

export interface Siomai {
  id: string;
  menu_name: string;
  price: SiomaiPrice;
}

export interface SiomaiPrice {
  "3pcs": number;
  "6pcs": number;
  "9pcs": number;
  "12pcs": number;
  "15pcs": number;
  "20pcs": number;
  "30pcs": number;
}

export interface SuperMeal {
  id: string;
  menu_name: string;
  siomai: number;
  price: SuperMealPrice;
}

export interface SuperMealPrice {
  "SM1 (3pcs siomai + 1 rice)": number;
  "SM2 (4pcs siomai + 1 rice)": number;
  "SM3 (6pcs siomai + 1 rice)": number;
}

export interface OtherData {
  id: string;
  menu_name: string;
  price: number;
}

export interface AddOn {
  for: string;
  add_on: AddOnClass;
}

interface AddOnClass {
  "Ice Cream"?: number;
  Pearl?: number;
  "Whipped Cream"?: number;
  "Cream Cheese"?: number;
  Graham?: number;
  Oreo?: number;
  Dip?: number;
}

export interface Drinks {
  Drinks: DrinkData[];
}

export interface FriesAndCheesestick {
  Fries: Fries[];
  Cheesestick: Cheesestick[];
  "Snack with Drink": SnackWithDrink[];
}

export interface SiomaiAndSuperMeal {
  Siomai: Siomai[];
  "Super Meal": SuperMeal[];
}

export interface Other {
  Others: OtherData[];
}

export const DrinkList: Drinks = {
  Drinks: menuJson["Drinks"],
};

export const FriesAndCheesestickList: FriesAndCheesestick = {
  Fries: menuJson["Fries"],
  Cheesestick: menuJson["Cheesestick"],
  "Snack with Drink": menuJson["Snack with Drink"],
};

export const SiomaiAndSuperMealList: SiomaiAndSuperMeal = {
  Siomai: menuJson["Siomai"],
  "Super Meal": menuJson["Super Meal"],
};

// export const AddOnsList:

export const DrinksAddOnList: AddOn = menuJson["Add On"][0];
export const FriesAddOnList: AddOn = menuJson["Add On"][1];

export const OtherList: Other = { Others: menuJson["Others"] };

export const images = {
  "Mango Plain": require("../img/menu_images/Mango Plain.png"),
  "Mango Graham": require("../img/menu_images/Mango Graham.png"),
  "Mango Chocolate": require("../img/menu_images/Mango Chocolate.png"),
  "Mango Caramel": require("../img/menu_images/Mango Caramel.png"),
  "Mango Blueberry": require("../img/menu_images/Mango Blueberry.png"),
  "Mango Strawberry": require("../img/menu_images/Mango Strawberry.png"),
  "Mango Chips Delight": require("../img/menu_images/Mango Chips Delight.png"),
  "Mango Oreo": require("../img/menu_images/Mango Oreo.png"),
  "Mango Cream Cheese": require("../img/menu_images/Mango Cream Cheese.png"),
  "Mango Nutella": require("../img/menu_images/Mango Nutella.png"),
  "Mango Overload": require("../img/menu_images/Mango Overload.png"),
  "Mango Extra Overload": require("../img/menu_images/Mango Extra Overload.png"),
  "Java Chips": require("../img/menu_images/Java Chips.png"),
  "Mocha Frappe": require("../img/menu_images/Mocha Frappe.png"),
  Fries: require("../img/menu_images/Fries.png"),
  Cheesestick: require("../img/menu_images/Cheesestick.png"),
  "Fries with Drinks": require("../img/menu_images/Fries with Drinks.png"),
  "Fries and Hotdog with Drinks": require("../img/menu_images/Fries and Hotdog with Drinks.png"),
  "Fries and Cheesestick with Drinks": require("../img/menu_images/Fries and Cheesestick with Drinks.png"),
  Siomai: require("../img/menu_images/3pcs.png"),
  "SM1 (3pcs siomai + 1 rice)": require("../img/menu_images/SM1 (3pcs siomai + 1 rice).png"),
  "SM2 (4pcs siomai + 1 rice)": require("../img/menu_images/SM2 (4pcs siomai + 1 rice).png"),
  "SM3 (6pcs siomai + 1 rice)": require("../img/menu_images/SM3 (6pcs siomai + 1 rice).png"),
};

export interface OrderSummary {
  order_id: string;
  mode_of_payment: "GCASH" | "MAYA" | "CASH";
  discount_percentage: number;
  discount_cash: number;
  "d/t": "d" | "t";
  raw_total: number;
  total: number;
  tendered_amount: number;
  change: number;
}

export interface Receipt {
  receipt_id: string;
  order_id: string;
  type: string;
  item_id: string;
  specifications: string;
  quantity: number;
  add_on_price: number;
  item_price: number;
  total_price: number;
}

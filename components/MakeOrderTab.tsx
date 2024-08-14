import { useFonts } from "expo-font";
// import uniqid from "uniqid";
import {
  DrinkData,
  Fries,
  Cheesestick,
  SnackWithDrink,
  Siomai,
  DrinkList,
  SuperMeal,
  OtherData,
  DrinksAddOnList,
  OzDrinkPrice,
  FriesAddOnList,
  FryPrice,
  CheesestickPrice,
  SnackWithDrinkPrice,
  SiomaiPrice,
  images,
  Receipt,
  AddOnReceipt,
} from "../assets/db/types";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import defaults, { MENU_CATEGORY_NAME } from "../assets/defaults";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useEffect, useState } from "react";
import AddOnTab from "./AddOnTab";
import menuJson from "../assets/db/menuItems.json";

interface MakeOrderTabDetails {
  menu_item:
    | DrinkData
    | Fries
    | Cheesestick
    | SnackWithDrink
    | Siomai
    | SuperMeal
    | OtherData
    | null;

  menu_category_name: string;
  color: string;
  receipt_list: { receipt: Receipt; menu_name: string }[];
  add_receipt: (item: {
    receipt: Receipt;
    menu_name: string;
    add_on: AddOnReceipt[];
  }) => void;
}
export default function MakeOrderTab(props: MakeOrderTabDetails) {
  const { menu_item, menu_category_name, color, receipt_list, add_receipt } =
    props;
  const [fonts] = useFonts({
    Boogaloo: require("../assets/fonts/Boogaloo.ttf"),
    Monument: require("../assets/fonts/Monument Extended.otf"),
    Poppins: require("../assets/fonts/Poppins.ttf"),
  });

  const [size, setSize] = useState<{ [key: string]: number } | null>(null);
  const [sizeIndexSelected, setSizeIndexSelected] = useState<number>(-1);
  const [quantity, setQuantity] = useState<number>(1);
  const [addOn, setAddOn] = useState<{ [key: string]: number }[] | []>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  function add_add_ons(add_on_object: { [key: string]: number }) {
    setAddOn([...addOn, add_on_object]);
  }

  function remove_add_on(nth: number) {
    const newArray = [...addOn];
    newArray.splice(nth, 1);
    setAddOn(newArray);
  }

  function makeReceipt(): {
    receipt: Receipt;
    menu_name: string;
    add_on: AddOnReceipt[];
  } {
    console.log("menu_item");
    console.log(menu_item);

    let add_on_price = 0;

    addOn.map((el) => {
      add_on_price += Object.values(el)[0];
    });

    let addOnStringResult = "";

    if (addOn.length === 0) {
      addOnStringResult = "";
    } else if (addOn.length === 1) {
      addOnStringResult = Object.keys(addOn[0])[0];
    } else if (addOn.length === 2) {
      addOnStringResult =
        Object.keys(addOn[0])[0] + " and " + Object.keys(addOn[1])[0];
    } else {
      for (let index = 0; index < addOn.length - 1; index++) {
        addOnStringResult += Object.keys(addOn[index])[0] + ", ";
      }
      addOnStringResult =
        addOnStringResult + " and " + Object.keys(addOn[addOn.length - 1])[0];
    }

    let receiptType = "DRINKS";

    if (menu_item !== null) {
      if (typeof menu_item.price === "number") {
        receiptType = MENU_CATEGORY_NAME.OTHERS.toUpperCase();
      } else if (Object.keys(menu_item.price).includes("12oz")) {
        receiptType = MENU_CATEGORY_NAME.DRINKS.toUpperCase();
      } else if (Object.keys(menu_item.price).includes("small")) {
        receiptType = MENU_CATEGORY_NAME.FRIES.toUpperCase();
      } else if (Object.keys(menu_item.price).includes("8pcs")) {
        receiptType = MENU_CATEGORY_NAME.CHEESESTICK.toUpperCase();
      } else if (Object.keys(menu_item.price).includes("with Fruit Juice")) {
        receiptType = MENU_CATEGORY_NAME.SNACK_WITH_DRINK.toUpperCase();
      } else if (Object.keys(menu_item.price).includes("3pcs")) {
        receiptType = MENU_CATEGORY_NAME.SIOMAI.toUpperCase();
      } else {
        receiptType = MENU_CATEGORY_NAME.SUPER_MEAL.toUpperCase();
      }
    }

    const receipt_id = Date.now();
    const receipt: Receipt = {
      receipt_id: receipt_id,
      order_id: "",
      type: receiptType,
      item_id: menu_item?.id || "",
      specifications:
        size === null || receiptType === MENU_CATEGORY_NAME.OTHERS.toUpperCase()
          ? ""
          : Object.keys(size)[0],
      quantity: quantity,
      add_on_price: add_on_price,
      item_price:
        menu_item === null
          ? 0
          : size !== null
          ? typeof menu_item?.price === "number"
            ? menu_item?.price
            : menu_item?.price[
                Object.keys(size)[0] as keyof typeof menu_item.price
              ]
          : 0,
      total_price: totalPrice,
    };

    console.log(receipt);

    const menu_name = `${
      size
        ? receiptType !== MENU_CATEGORY_NAME.OTHERS.toUpperCase()
          ? Object.keys(size)[0] + " - "
          : ""
        : ""
    }${menu_item?.menu_name} ${
      addOn.length === 0 ? "" : `with ${addOnStringResult}`
    }`;

    let add_on: AddOnReceipt[] = [];
    if (addOn.length > 0) {
      addOn.map((el) => {
        add_on.push({
          receipt_id: receipt_id,
          order_id: "",
          for: Object.keys(menuJson["Add On"][0].add_on).includes(
            Object.keys(el)[0]
          )
            ? 0
            : 1,
          add_ons_id: Object.keys(el)[0],
        });
      });
    }

    return { receipt, menu_name, add_on };
  }

  //reset
  useEffect(() => {
    setSize(null);
    setSizeIndexSelected(-1);
    setQuantity(1);
    setAddOn([]);
    setTotalPrice(0);
  }, [menu_item]);

  useEffect(() => {
    let add_on_price = 0;
    addOn.map((el) => {
      add_on_price += Object.values(el)[0];
    });
    const sizePrice = size === null ? 0 : Object.values(size)[0];
    setTotalPrice((sizePrice + add_on_price) * quantity);
  }, [size, addOn, quantity]);

  const styles = StyleSheet.create({
    container: {
      width: "45%",
      height: "100%",
      backgroundColor: "white",
      padding: hp(2),
      display: "flex",
      flexDirection: "column",
      gap: hp(1),
    },
    total_price_container: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    total_price_text: {
      fontFamily: "Monument",
      color: "#2E8B57",
      fontSize: hp(1),
    },
    add_to_receipt_button: {
      paddingHorizontal: hp(1),
      paddingVertical: hp(0.5),
    },

    add_to_receipt_text: {
      fontFamily: "Monument",
    },

    specification_button_container: {
      display: "flex",
      flexDirection: "row",
      gap: hp(1),
      width: "100%",
      alignItems: "center",
      flexWrap: "wrap",
    },

    specifications_button: {
      paddingHorizontal: hp(0.5),
      paddingVertical: hp(1),
      flexGrow: 1,
    },

    specifications_button_text: {
      fontFamily: "Poppins",
      textAlign: "center",
      fontSize: hp(1),
    },

    description_text: {
      fontSize: hp(2),
      fontFamily: "Monument",
    },

    menu_name: {
      fontSize: hp(2),
      fontFamily: "Monument",
    },

    add_on_container: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    add_on_text: {
      fontFamily: "Poppins",
      fontSize: hp(1),
      textAlign: "center",
    },

    add_on_button: {
      paddingVertical: hp(0.5),
      paddingHorizontal: hp(1),
    },
  });

  function SetQuantity() {
    const styles = StyleSheet.create({
      container: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderTopColor: "black",
        borderTopWidth: hp(0.1),
        padding: hp(0.25),
      },

      button: {
        paddingVertical: hp(0.5),
        paddingHorizontal: hp(0.5),
      },

      text: {
        fontFamily: "Monument",
        fontSize: hp(1),
        textAlign: "center",
      },
    });
    return (
      <View style={[styles.container]}>
        <Text style={[styles.text]}>Quantity</Text>
        <TouchableOpacity
          style={[styles.button, defaults.small_shadow]}
          onPress={() => {
            if (quantity !== 1) {
              setQuantity(quantity - 1);
            }
          }}
        >
          <Text style={styles.text}>-</Text>
        </TouchableOpacity>
        <Text style={styles.text}>{quantity}</Text>
        <TouchableOpacity
          style={[styles.button, defaults.small_shadow]}
          onPress={() => {
            setQuantity(quantity + 1);
          }}
        >
          <Text style={styles.text}>+</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function SpecificationButton(
    index: number,
    el: string,
    setSizeFunction: () => void,
    price: number
  ) {
    if (price === 0) {
      return <></>;
    }
    return (
      <TouchableOpacity
        style={[
          styles.specifications_button,
          defaults.small_shadow,
          sizeIndexSelected === index
            ? { backgroundColor: color }
            : { backgroundColor: "white" },
        ]}
        key={index}
        onPress={() => {
          setSizeIndexSelected(index);
          setSizeFunction();
        }}
      >
        <Text>
          {el}
          {" - P"}
          {price}
        </Text>
      </TouchableOpacity>
    );
  }

  function Drink(item: DrinkData) {
    const drink_styles = StyleSheet.create({
      container: {
        width: "45%",
        height: "100%",
        backgroundColor: "white",
        padding: hp(2),
      },

      add_on_container: {
        display: "flex",
        flexDirection: "row",
        gap: hp(1),
        width: "100%",
      },

      add_on_button_container: {
        display: "flex",
        flexDirection: "column",
        gap: hp(1),
        width: "40%",
      },

      add_on_button: {
        paddingHorizontal: hp(0.5),
        paddingVertical: hp(1),
        width: "100%",
      },

      scroll_view_style: {
        display: "flex",
        gap: hp(1),
      },
    });
    return (
      <>
        <ScrollView style={{ paddingBottom: hp(2), flexGrow: 0 }}>
          <View style={[drink_styles.scroll_view_style]}>
            {MenuTemplate(item)}
            <Text style={[styles.description_text]}>Add Ons</Text>
            <View style={[drink_styles.add_on_container]}>
              <View style={[drink_styles.add_on_button_container]}>
                {Object.keys(DrinksAddOnList.add_on).map(
                  (el: string, index) => {
                    return (
                      <TouchableOpacity
                        style={[
                          drink_styles.add_on_button,
                          defaults.small_shadow,
                        ]}
                        key={index}
                        onPress={() => {
                          add_add_ons({
                            [el]:
                              DrinksAddOnList.add_on[
                                el as keyof typeof DrinksAddOnList.add_on
                              ] || 0,
                          });
                        }}
                      >
                        <Text style={[styles.specifications_button_text]}>
                          {el}
                          {" - "}
                          {Object.values(DrinksAddOnList.add_on)[index]}
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                )}
              </View>
              <AddOnTab add_ons={addOn} onClick={remove_add_on} />
            </View>
          </View>
        </ScrollView>
      </>
    );
  }

  function DipAddOnButton() {
    return (
      <View style={[styles.add_on_container]}>
        <Text style={[styles.add_on_text]}>Add on: </Text>
        <TouchableOpacity
          style={[
            styles.add_on_button,
            defaults.small_shadow,
            addOn.length === 0
              ? { backgroundColor: "white" }
              : { backgroundColor: color },
          ]}
          onPress={() => {
            addOn.length === 0 ? add_add_ons({ Dip: 5 }) : setAddOn([]);
          }}
        >
          <Text style={[styles.add_on_text]}>With Dip - 5</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function MenuTemplate(
    item: Fries | Cheesestick | SnackWithDrink | Siomai | DrinkData | SuperMeal
  ) {
    const prices = item.price;

    return (
      <ScrollView>
        <View style={{ flexGrow: 1, gap: hp(1) }}>
          <Text style={[styles.menu_name]}>{item.menu_name}</Text>
          <Image
            source={images[item.menu_name as keyof typeof images]}
            style={{ width: hp(10), height: hp(10), alignSelf: "center" }}
          ></Image>
          <View style={[styles.specification_button_container]}>
            {Object.keys(item.price).map((el, index) => {
              return SpecificationButton(
                index,
                el.charAt(0).toUpperCase() + el.slice(1),
                () => {
                  setSize({ [el]: prices[el as keyof typeof prices] });
                },
                Object.values(prices)[index]
              );
            })}
          </View>
          {!Object.keys(prices).includes("3pcs") &&
          !Object.keys(prices).includes("12oz") &&
          !Object.keys(prices).includes("SM1 (3pcs siomai + 1 rice)")
            ? DipAddOnButton()
            : null}
        </View>
      </ScrollView>
    );
  }

  function NonObjectPrice(item: OtherData) {
    return (
      <View style={{ flexGrow: 1, gap: hp(1) }}>
        <Text style={[styles.menu_name]}>{item.menu_name}</Text>
        <Image
          source={images[item.menu_name as keyof typeof images]}
          style={{ width: hp(15), height: hp(15), alignSelf: "center" }}
        ></Image>
        <TouchableOpacity
          style={[styles.specifications_button, defaults.small_shadow]}
          onPress={() => setSize({ price: item.price })}
        >
          <Text style={[styles.specifications_button_text]}>Add</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={[styles.container, defaults.big_shadow]}>
      {menu_item !== null ? (
        typeof menu_item.price === "number" ? (
          NonObjectPrice(menu_item as OtherData)
        ) : Object.keys(menu_item.price).includes("12oz") ? (
          Drink(menu_item as DrinkData)
        ) : (
          MenuTemplate(
            menu_item as
              | Fries
              | Cheesestick
              | SnackWithDrink
              | Siomai
              | SuperMeal
          )
        )
      ) : (
        <></>
      )}
      <SetQuantity />
      <View style={[styles.total_price_container]}>
        <Text style={[styles.total_price_text]}>PRICE: P{totalPrice}</Text>
        <TouchableOpacity
          style={[styles.add_to_receipt_button, defaults.small_shadow, size === null ? { backgroundColor: "#ffffff" }
            : { backgroundColor: "#03C04A" }]}
          onPress={() => {
            size === null
              ? Alert.alert(
                  "No size selected",
                  "Please select a size to add to your receipt."
                )
              : add_receipt(makeReceipt());
            setSize(null);
            setSizeIndexSelected(-1);
            setQuantity(1);
            setAddOn([]);
            setTotalPrice(0);
          }}
        >
          <Text style={[styles.add_to_receipt_text]}>Add to Receipt</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

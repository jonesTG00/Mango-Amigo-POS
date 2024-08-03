import { useFonts } from "expo-font";
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
  FriessAddOnList,
  FryPrice,
  CheesestickPrice,
  SnackWithDrinkPrice,
  SiomaiPrice,
  images,
} from "../assets/db/types";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import defaults from "../assets/defaults";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useEffect, useState } from "react";
import AddOnTab from "./AddOnTab";

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
}
export default function MakeOrderTab(props: MakeOrderTabDetails) {
  const { menu_item, menu_category_name, color } = props;
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
    console.log(add_on_object);
    setAddOn([...addOn, add_on_object]);
  }

  function remove_add_on(nth: number) {
    const newArray = [...addOn];
    newArray.splice(nth, 1);
    setAddOn(newArray);
  }

  useEffect(() => {
    console.log(addOn);
  }, [addOn]);

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
    console.log(size);
    console.log(add_on_price);
    console.log(sizePrice);
    console.log(quantity);
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
      fontSize: hp(2),
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
      fontSize: hp(1.5),
    },

    description_text: {
      fontSize: hp(2),
      fontFamily: "Monument",
    },

    menu_name: {
      fontSize: hp(3),
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
      fontSize: hp(2),
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
      },

      button: {
        paddingVertical: hp(1),
        paddingHorizontal: hp(1),
      },

      text: {
        fontFamily: "Monument",
        fontSize: hp(2),
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
    const prices: OzDrinkPrice = item.price;
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
                          console.log(el);
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
        {/* </View>
        </ScrollView> */}
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
    item: Fries | Cheesestick | SnackWithDrink | Siomai | DrinkData
  ) {
    const prices = item.price;
    console.log(prices);

    return (
      <View style={{ flexGrow: 1, gap: hp(1) }}>
        <Text style={[styles.menu_name]}>{item.menu_name}</Text>
        <Image
          source={images[item.menu_name as keyof typeof images]}
          style={{ width: hp(15), height: hp(15), alignSelf: "center" }}
        ></Image>
        <View style={[styles.specification_button_container]}>
          {Object.keys(item.price).map((el, index) => {
            return SpecificationButton(
              index,
              el.charAt(0).toUpperCase() + el.slice(1),
              () => {
                setSize({ el: prices[el as keyof typeof prices] });
              },
              Object.values(prices)[index]
            );
          })}
        </View>
        {!Object.keys(prices).includes("3pcs") &&
        !Object.keys(prices).includes("12oz")
          ? DipAddOnButton()
          : null}
      </View>
    );
  }

  function NonObjectPrice(item: SuperMeal | OtherData) {
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
          NonObjectPrice(menu_item as SuperMeal | OtherData)
        ) : Object.keys(menu_item.price).includes("12oz") ? (
          Drink(menu_item as DrinkData)
        ) : (
          MenuTemplate(
            menu_item as Fries | Cheesestick | SnackWithDrink | Siomai
          )
        )
      ) : (
        <></>
      )}
      <SetQuantity />
      <View style={[styles.total_price_container]}>
        <Text style={[styles.total_price_text]}>PRICE: P{totalPrice}</Text>
        <TouchableOpacity
          style={[styles.add_to_receipt_button, defaults.small_shadow]}
        >
          <Text style={[styles.add_to_receipt_text]}>Add to Receipt</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

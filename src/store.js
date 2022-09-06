import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { isMobile } from "react-device-detect";
import rudderanalytics from "./rudderService";
import faker from "faker"

const initialState = {
  sidebarShow: "responsive",
  products: [
    {
      id: "1234",
      name: "Primer",
      description:
        "Cult classic Smashbox Photo Finish Foundation Primer is a top-notch choice. It creates a smooth, silky texture that allows your foundation to glide on. Photo Finish diminishes the look of pores and fine lines, reduces oils and makes makeup up lasts longer. Beauty bonus: It contains vitamins and antioxidants so it’s actually good for your skin.  ",
      picture:
        "https://www.sheknows.com/wp-content/uploads/2018/08/noc-out-cover-up_yklz8u.jpeg",
      price: 32000
    },
    {
      id: "346",
      name: "Bronzer",
      description:
        "If you want to get that sun-kissed look without the damaging effects of the sun (really, the only way to tan), turn to CARGO WaterResistant Bronzer. It gives you a natural glow that never looks fake and it’s water and sweat-resistant making it the perfect poolside beauty essential!",
      picture:
        "https://www.sheknows.com/wp-content/uploads/2018/08/loreal-hip_wwqlx0.jpeg",
      price: 28000
    },
    {
      id: "543",
      name: "Eyeliner",
      description:
        "There are so many eyeliners to choose from – pencils, pens, liquids and gels. But if you are looking for something that lasts, opt for Bobbi Brown Long-Wear Gel Eyeliner. It glides on smooth and dries quickly, staying on all day (and night) until you take it off.",
      picture:
        "https://www.sheknows.com/wp-content/uploads/2018/08/Sephora-Triple-Action-Mascara_o0trsl.jpeg",
      price: 21000
    },
    {
      id: "53677",
      name: "Foundation",
      description:
        "For liquid foundation, you can’t go wrong with anything from Chanel. However, the best inexpensive foundation in our opinion is Perfetly Real Makeup($24) from Clinque. It controls oil, wicks away sweat and lasts all day long.",
      picture:
        "https://www.sheknows.com/wp-content/uploads/2018/08/Laura_Mercier_Invisible_Loose_Setting_Powder_f4vnnh.png",
      price: 34000
    },
    {
      id: "660",
      name: "Facial mask",
      description:
        "Queen Helene Masks are affordable and effective. Choose the Mint Julep Masque to dry up acne, shrink large pores and rinse away blackheads.",
      picture:
        "https://www.sheknows.com/wp-content/uploads/2018/08/philosophy-hope-in-a-jar_jihap0.jpeg",
      price: 24000
    },
    {
      id: "62360",
      name: "Body lotion",
      description:
        "Bath & Body Works body lotions are the fun and fresh. They hydrate, nourish and smell wonderful. Two of our favorite scents are Cherry Blossom and Lemongrass Sage, but for a sultry summer treat try their Bali Mango.",
      picture:
        "https://www.sheknows.com/wp-content/uploads/2018/08/brown-sugar-body-polish_ravzkc.jpeg",
      price: 25000
    },
    {
      id: "61360",
      name: "Night cream",
      description:
        "Olay Regenerist Micro-Sculpting Cream is a fantastic product that is effective and inexpensive. Used nightly, the cream will leave your skin looking — and feeling smooth and soft. It works at the cellular level to really nourish, hydrate and tone your skin.  ",
      picture:
        "https://www.sheknows.com/wp-content/uploads/2018/08/olay-regenerist_clsghy.jpeg",
      price: 30000
    }
  ],
  productDetail: "",
  cart: [],
  currentUser: null,
  users: [
    {
      name: "Miranda Beautika",
      email: "miranda_b@gmail.com",
      check: true,
      checkTerms: true
    }
  ]
};

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case "set":
      return { ...state, ...rest };
    case "setProductDetail":
      const product = state.products.find(product => product.id === rest.id);

      rudderanalytics.track(
        "viewProduct",
        {
          id: product.id,
          name: product.name,
          description: product.description,
          picture: product.picture,
          price: product.price
        }
      );
      return {
        ...state,
        productDetail: state.products.find(product => product.id === rest.id)
      };
    case "addUser":
      return { ...state, users: [...state.users, rest.user] };
    case "addItemtoCart":
      if (
        state.cart.findIndex(
          cartItem => cartItem.detail.id === rest.item.detail.id
        ) === -1
      ) {
        rudderanalytics.track(
          "addToCart",
          {
            inCart: [...state.cart, rest.item]
              .map(cart => cart.detail.name)
              .join(","),
            qty: rest.item.amount,
            id: rest.item.detail.id,
            name: rest.item.detail.name,
            description: rest.item.detail.description,
            picture: rest.item.detail.picture,
            price: rest.item.detail.price
          }
        );
        rudderanalytics.track(
          "cartQty",
          {
            qty: state.cart.reduce((a, b) => { return a + b.amount }, 0) + rest.item.amount,
          }
        );
        if (state.currentUser && state.currentUser.email) {
          rudderanalytics.identify(
            state.currentUser.email,
            {
              email: state.currentUser.email,
              name: state.currentUser.name,
              picture: "https://cutt.ly/zvJyFft",
              location: state.currentUser.location,
              gender: state.currentUser.gender,
              emailConsent: state.currentUser.check ? "granted" : "denied",
              pushConsent: state.currentUser.check ? "granted" : "denied",
              itemInCart: state.cart.reduce((a, b) => { return a + b.amount }, 0) + rest.item.amount,
            },
            {
            }
          );
        }
        return { ...state, cart: [...state.cart, rest.item] };
      } else {
        let copyCart = [...state.cart];
        copyCart[
          state.cart.findIndex(
            cartItem => cartItem.detail.id === rest.item.detail.id
          )
        ].amount += rest.item.amount;
        rudderanalytics.track(
          "addToCart",
          {
            inCart:
              state.cart.length === 0
                ? "-"
                : copyCart.map(cart => cart.detail.name).join(","),
            qty: rest.item.amount,
            id: rest.item.detail.id,
            name: rest.item.detail.name,
            description: rest.item.detail.description,
            picture: rest.item.detail.picture,
            price: rest.item.detail.price
          }
        );
        rudderanalytics.track(
          "cartQty",
          {
            qty: copyCart.reduce((a, b) => { return a + b.amount }, 0),
          }
        );
        if (state.currentUser && state.currentUser.email) {
          rudderanalytics.identify(
            state.currentUser.email,
            {
              email: state.currentUser.email,
              name: state.currentUser.name,
              picture: "https://cutt.ly/zvJyFft",
              location: state.currentUser.location,
              gender: state.currentUser.gender,
              emailConsent: state.currentUser.check ? "granted" : "denied",
              pushConsent: state.currentUser.check ? "granted" : "denied",
              itemInCart: copyCart.reduce((a, b) => { return a + b.amount }, 0),
            },
            {
            }
          );
        }
        return { ...state, cart: copyCart };
      }
    case "setItemAmount":
      let copyCart = [...state.cart];
      copyCart[
        state.cart.findIndex(
          cartItem => cartItem.detail.id === rest.item.detail.id
        )
      ].amount = rest.item.amount;
      rudderanalytics.track(
        "cartQty",
        {
          qty: copyCart.reduce((a, b) => { return a + b.amount }, 0)
        }
      );
      rudderanalytics.identify(
        state.currentUser.email,
        {
          email: state.currentUser.email,
          name: state.currentUser.name,
          picture: "https://cutt.ly/zvJyFft",
          location: state.currentUser.location,
          gender: state.currentUser.gender,
          emailConsent: state.currentUser.check ? "granted" : "denied",
          pushConsent: state.currentUser.check ? "granted" : "denied",
          itemInCart: copyCart.reduce((a, b) => { return a + b.amount }, 0)
        },
        {
        }
      );
      return { ...state, cart: copyCart };
    case "removeItemfromCart":
      let cart = [...state.cart];
      let filteredCart = cart.filter(
        cartItem => cartItem.detail.id !== rest.item.detail.id
      );
      rudderanalytics.track(
        "removeItemFromCart",
        {
          inCart:
            filteredCart.length === 0
              ? "-"
              : filteredCart.map(cart => cart.detail.name).join(","),
          qty: rest.item.amount,
          id: rest.item.detail.id,
          name: rest.item.detail.name,
          description: rest.item.detail.description,
          picture: rest.item.detail.picture,
          price: rest.item.detail.price
        }
      );
      rudderanalytics.identify(
        state.currentUser.email,
        {
          email: state.currentUser.email,
          name: state.currentUser.name,
          picture: "https://cutt.ly/zvJyFft",
          location: state.currentUser.location,
          gender: state.currentUser.gender,
          emailConsent: state.currentUser.check ? "granted" : "denied",
          pushConsent: state.currentUser.check ? "granted" : "denied",
          itemInCart: filteredCart.reduce((a, b) => { return a + b.amount }, 0)
        },
        {
        }
      );
      rudderanalytics.track(
        "cartQty",
        {
          qty: filteredCart.reduce((a, b) => { return a + b.amount }, 0),
        }
      );
      return { ...state, cart: filteredCart };
    case "emptyCart":
      rudderanalytics.identify(
        state.currentUser.email,
        {
          email: state.currentUser.email,
          name: state.currentUser.name,
          picture: "https://cutt.ly/zvJyFft",
          location: state.currentUser.location,
          gender: state.currentUser.gender,
          emailConsent: state.currentUser.check ? "granted" : "denied",
          pushConsent: state.currentUser.check ? "granted" : "denied",
          itemInCart: 0
        },
        {
        }
      );
      return { ...state, cart: [] };
    case "setCurretUser":
      if (rest.userEmail === "logout") {
        rudderanalytics.track(
          "logout",
          {

          }
        );
        rudderanalytics.reset()
        const anonymousId = faker.random.uuid()
        rudderanalytics.setAnonymousId(anonymousId)
        return { ...state, currentUser: null };
      }
      let user =
        state.users.find(user => user.email === rest.userEmail) || null;
      user.location = faker.random.arrayElement(["Jawa", "Bali", "Sumatra", "Kalimantan", "Sulawesi", "Papua"])
      user.gender = faker.random.arrayElement(["Male", "Female"])
      if (user) {
        rudderanalytics.identify(
          user.email,
          {
            email: user.email,
            name: user.name,
            picture: "https://cutt.ly/zvJyFft",
            location: user.location,
            gender: user.gender,
            emailConsent: user.check ? "granted" : "denied",
            pushConsent: user.check ? "granted" : "denied",
            itemInCart: 0
          },
          {
          }
        );
        rudderanalytics.track(
          "signUp",
          {
            email: user.email,
            name: user.name,
            emailConsent: user.check ? "granted" : "denied",
            pushConsent: user.check ? "granted" : "denied"
          }
        );
      }
      return { ...state, currentUser: user };
    default:
      return state;
  }
};

const persistConfig = {
  key: "root",
  storage
};
const persistedReducer = persistReducer(persistConfig, changeState);
const store = createStore(persistedReducer);
const persistor = persistStore(store);
export { store, persistor };

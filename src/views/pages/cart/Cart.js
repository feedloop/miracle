import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  CRow,
  CCol,
  CCard,
  CCardTitle,
  CButton,
  CCardGroup
} from "@coreui/react";
import CartItem from "./CartItem";
import swal from "sweetalert2";
import aixpTracker from "aixp-analytics";

const Cart = () => {
  const cartProducts = useSelector(state => state.cart);
  const history = useHistory();
  const dispatch = useDispatch();
  const [total, setTotal] = React.useState(calculateTotal(cartProducts));
  const signedIn = useSelector(state => state.currentUser);

  useEffect(() => {
    setTotal(calculateTotal());
  }, [cartProducts]);
  function calculateTotal() {
    const totalCart = { price: 0, amount: 0 };
    for (let i in cartProducts) {
      const price = cartProducts[i].detail.price
      const amount = cartProducts[i].amount
      totalCart.price += price * amount;
      totalCart.amount += amount;
    }
    return totalCart;
  }

  function formatPrice(price) {
    let priceString = JSON.stringify(price);
    let formatString = "";
    let count = 1;
    for (let i = priceString.length - 1; i >= 0; i--) {
      formatString = priceString[i] + formatString;
      if (count == 3 && i != 0) {
        formatString = "." + formatString;
        count = 1;
      } else {
        count++;
      }
    }
    return formatString;
  }

  function handleCheckout() {
    if (signedIn) {
      history.push(`/checkout`);
    } else {
      swal
        .mixin({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: toast => {
            toast.addEventListener("mouseenter", swal.stopTimer);
            toast.addEventListener("mouseleave", swal.resumeTimer);
          }
        })
        .fire({
          icon: "error",
          title: "Sign in or register before continuing"
        });
    }
  }

  return (
    <>
      {!cartProducts.length ? (
        <div
          style={{
            height: "100%",
            minHeight: "70vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column"
          }}
        >
          <CRow className="justify-content-center">
            <h1>Nothing in your cart</h1>
          </CRow>
          <CRow className="justify-content-center">
            <CButton to="/">
              <h2 style={{ color: "#3399ff", cursor: "pointer" }}>
                Continue Shopping
              </h2>
            </CButton>
          </CRow>
        </div>
      ) : (
          <div>
            <CButton to="/">
              <h5 style={{ color: "#3399ff", cursor: "pointer" }}>
                Continue Shopping
            </h5>
            </CButton>
            <CRow className="justify-content-center">
              <CCol className="col-auto mb-4">
                {cartProducts.map(product => {
                  return (
                    <CRow
                      key={product.detail.id}
                      className="row justify-content-center"
                    >
                      <CCard>
                        <CartItem product={product} editable={true} />
                      </CCard>
                    </CRow>
                  );
                })}
              </CCol>
              <CCol
                className="col-auto mb-4"
                style={{ minWidth: "300px", marginLeft: "10%" }}
              >
                <CCard style={{ padding: "1em" }}>
                  <CCardTitle
                    style={{
                      textAlign: "center",
                      fontSize: "30px",
                      fontWeight: "bold",
                      margin: "20px 0px"
                    }}
                  >
                    Summary
                </CCardTitle>
                  <div
                    style={{
                      margin: "5em 1em 2em 1em",
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "20px"
                    }}
                  >
                    <span>Total Price</span>
                    <span>Rp.{formatPrice(total.price)}</span>
                  </div>
                  <CButton
                    color="primary"
                    style={{ margin: "1em" }}
                    onClick={handleCheckout}
                  >
                    {`Checkout (${total.amount})`}
                  </CButton>
                </CCard>
              </CCol>
            </CRow>
          </div>
        )}
    </>
  );
};

export default Cart;

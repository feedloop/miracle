import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  CRow,
  CCol,
  CCard,
  CCardTitle,
  CButton,
  CFormGroup,
  CLabel,
  CInput,
  CCardHeader,
  CCardBody,
  CCollapse,
  CSelect
} from "@coreui/react";
import CartItem from "../cart/CartItem";
import swal from "sweetalert2";
import { isMobile } from "react-device-detect";
import moment from "moment";
import rudderanalytics from "../../../rudderService";

const Checkout = () => {
  const cartProducts = useSelector(state => state.cart);
  const history = useHistory();
  const dispatch = useDispatch();
  const [total, setTotal] = React.useState(calculateTotal(cartProducts));
  const [accordion, setAccordion] = React.useState(0);
  const signedInUser = useSelector(state => state.currentUser);
  const [address, setAddress] = React.useState({
    name: signedInUser.name || "",
    street: "Jl. Sudirman II",
    city: "Jakarta Pusat",
    postal: "10150",
    country: "Indonesia"
  });
  const [payment, setPayment] = React.useState("BCA");

  useEffect(() => {
    setTotal(calculateTotal());
  }, [cartProducts]);

  function calculateTotal() {
    const totalCart = { price: 0, amount: 0 };
    for (let i in cartProducts) {
      const price = cartProducts[i].detail.price;
      const amount = cartProducts[i].amount;
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
    for(const p of cartProducts) {
      rudderanalytics.track("payment", {
        paymentType: payment,
        city: address.city,
        address: address.street,
        name: p.detail.name,
        price: Number(formatPrice(p.detail.price).replace(".", "")),
        date: moment().format("D MMM YYYY, hh:mm a"),
      });
    }
    rudderanalytics.track(
      "cartQty",
      {
        qty: 0,
      }
    );
    dispatch({
      type: "emptyCart"
    });
    history.push(`/purchased`);
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
                Back to cart
            </h5>
            </CButton>
            <CRow className="justify-content-center">
              <h1>Checkout</h1>
            </CRow>

            <CRow className="justify-content-center">
              <CCol>
                <div>
                  <div id="accordion">
                    <CCard className="mb-0">
                      <CCardHeader id="headingOne">
                        <CButton
                          block
                          color="link"
                          className="text-left m-0 p-0"
                          onClick={() => setAccordion(accordion === 0 ? null : 0)}
                        >
                          <h5 className="m-0 p-0">Shipping Address</h5>
                        </CButton>
                      </CCardHeader>
                      <CCollapse show={accordion === 0}>
                        <CCardBody>
                          <CFormGroup>
                            <CLabel htmlFor="company">Name</CLabel>
                            <CInput disabled id="company" value={address.name} />
                          </CFormGroup>
                          <CFormGroup>
                            <CLabel htmlFor="street">Street</CLabel>
                            <CInput
                              onChange={e => setAddress("street", e.target.value)}
                              id="street"
                              value={address.street}
                            />
                          </CFormGroup>
                          <CFormGroup row className="my-0">
                            <CCol xs="8">
                              <CFormGroup>
                                <CLabel htmlFor="city">City</CLabel>
                                <CInput
                                  onChange={e =>
                                    setAddress("city", e.target.value)
                                  }
                                  id="city"
                                  value={address.city}
                                />
                              </CFormGroup>
                            </CCol>
                            <CCol xs="4">
                              <CFormGroup>
                                <CLabel htmlFor="postal-code">Postal Code</CLabel>
                                <CInput
                                  onChange={e =>
                                    setAddress("postal", e.target.value)
                                  }
                                  id="postal-code"
                                  value={address.postal}
                                />
                              </CFormGroup>
                            </CCol>
                          </CFormGroup>
                          <CFormGroup>
                            <CLabel htmlFor="country">Country</CLabel>
                            <CInput
                              onChange={e =>
                                setAddress("country", e.target.value)
                              }
                              id="country"
                              value={address.country}
                            />
                          </CFormGroup>
                        </CCardBody>
                      </CCollapse>
                    </CCard>
                    <CCard className="mb-0">
                      <CCardHeader id="headingTwo">
                        <CButton
                          block
                          color="link"
                          className="text-left m-0 p-0"
                          onClick={() => setAccordion(accordion === 1 ? null : 1)}
                        >
                          <h5 className="m-0 p-0">Cart</h5>
                        </CButton>
                      </CCardHeader>
                      <CCollapse show={accordion === 1}>
                        {cartProducts.map(product => {
                          return (
                            <div key={product.detail.id}>
                              <CartItem product={product} editable={false} />
                            </div>
                          );
                        })}
                      </CCollapse>
                    </CCard>
                    <CCard className="mb-0">
                      <CCardHeader id="headingThree">
                        <CButton
                          block
                          color="link"
                          className="text-left m-0 p-0"
                          onClick={() => setAccordion(accordion === 2 ? null : 2)}
                        >
                          <h5 className="m-0 p-0">Payment</h5>
                        </CButton>
                      </CCardHeader>
                      <CCollapse show={accordion === 2}>
                        <CCardBody>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <h5 style={{ marginRight: "2em" }}>
                              Select Bank Transfer with:
                          </h5>
                            <CSelect
                              style={{ width: "180px" }}
                              value={payment}
                              onChange={e => {
                                setPayment(e.target.value);
                              }}
                            >
                              <option value="BCA">BCA</option>
                              <option value="Mandiri">Mandiri</option>
                              <option value="BRI">BRI</option>
                              <option value="BNI">BNI</option>
                            </CSelect>
                          </div>
                        </CCardBody>
                      </CCollapse>
                    </CCard>
                  </div>
                </div>
              </CCol>
              <CCol sm="3" style={{ width: "300px", marginLeft: "1em" }}>
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
                  <div style={{ margin: "5em 1em 2em 1em", fontSize: "20px" }}>
                    {cartProducts.map(product => {
                      return (
                        <div
                          key={product.detail.id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between"
                          }}
                        >
                          <span>{product.detail.name}</span>
                          <span>
                            Rp.{product.detail.price}
                            {" X"}
                            {product.amount}
                          </span>
                        </div>
                      );
                    })}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        paddingTop: "1em"
                      }}
                    >
                      <span>Total Price</span>
                      <span>Rp.{formatPrice(total.price)}</span>
                    </div>
                  </div>
                  <CButton
                    color="primary"
                    style={{ margin: "1em" }}
                    onClick={handleCheckout}
                  >
                    {`Pay`}
                  </CButton>
                </CCard>
              </CCol>
            </CRow>
          </div>
        )}
    </>
  );
};

export default Checkout;

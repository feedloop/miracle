import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { CSpinner, CButton, CCol } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  isMobile
} from "react-device-detect";
import aixpTracker from "aixp-analytics";
import { cilCart } from "@coreui/icons";
import swal from "sweetalert2";

const ProductDetail = () => {
  const dispatch = useDispatch();
  const [amount, setAmount] = React.useState(1);
  const history = useHistory();
  const { id } = useParams();
  const product = useSelector(state => state.productDetail);
  const cart = useSelector(state => state.cart);
  useEffect(() => {
    
    dispatch({ type: "setProductDetail", id });
    return () => {
      dispatch({ type: "clearProductDetail" });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function addToCart(item) {
    dispatch({
      type: "addItemtoCart",
      item: {
        detail: item,
        amount
      }
    });
   
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
        icon: "success",
        title: "Item added to cart  "
      });
  }
  function checkEvent(input) {
    const regex = /^[0-9]+$/;
    if (!input.match(regex)) {
      setAmount(1);
    } else {
      if (input === 0 && amount === 0) {
        setAmount(1);
      } else {
        setAmount(input);
      }
    }
  }
  return (
    <>
      {product === "" ? (
        <CSpinner />
      ) : (
        <div className="row justify-content-center">
          <CCol key="pic" className="col-auto mb-4">
            <img
              src={product.picture}
              alt={product.id}
              style={{
                backgroundSize: "cover",
                maxWidth: "450px",
                maxHeight: "450px",
                minWidth: "300px",
                minHeight: "300px"
              }}
            />
          </CCol>
          <CCol key="detail" className="col-auto mb-4">
            <div
              style={{
                maxWidth: "500px"
              }}
            >
              <div style={{ fontSize: "30px", fontWeight: "bold" }}>
                {product.name}
              </div>
              <div style={{ fontSize: "20px" }}>{product.description}</div>
              <div style={{ fontSize: "20px" }}>
                Prize:{" "}
                <span style={{ fontWeight: "bolder" }}>Rp{product.price}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <CButton
                  disabled={amount < 2}
                  onClick={() => setAmount(amount - 1)}
                  variant="outline"
                  color="primary"
                  style={{
                    width: "35px",
                    height: "35px",
                    fontWeight: "bold",
                    fontSize: "20px",
                    padding: "0px"
                  }}
                >
                  -
                </CButton>
                <input
                  style={{
                    width: "70px",
                    margin: "5px",
                    textAlign: "center",
                    height: "35px",
                    MozAppearance: "textfield"
                  }}
                  type="number"
                  value={amount}
                  onChange={e => {
                    checkEvent(e.target.value);
                  }}
                  min={1}
                />
                <CButton
                  variant="outline"
                  onClick={() => setAmount(amount + 1)}
                  color="primary"
                  style={{
                    width: "35px",
                    height: "35px",
                    fontWeight: "bold",
                    fontSize: "20px",
                    padding: "0px"
                  }}
                >
                  +
                </CButton>
                <CButton
                  style={{ width: "130px", margin: "10px" }}
                  block
                  variant="outline"
                  color="success"
                  onClick={() => {
                    addToCart(product);
                  }}
                >
                  <CIcon style={{ marginRight: "5px" }} content={cilCart} />
                  Add to cart
                </CButton>
                <CButton
                  style={{ width: "130px", margin: "10px" }}
                  block
                  variant="outline"
                  color="success"
                  onClick={() => {
                    history.push("/");
                  }}
                >
                  More products
                </CButton>
              </div>
              <CButton
                style={{ width: "130px", margin: "10px" }}
                block
                variant="outline"
                color="primary"
                onClick={() => {
                  history.push("/cart");
                }}
              >
                Checkout
              </CButton>
            </div>
          </CCol>
        </div>
      )}
    </>
  );
};

export default ProductDetail;
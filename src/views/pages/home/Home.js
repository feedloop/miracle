import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { CRow, CCol, CCard, CCardTitle, CButton } from "@coreui/react";
import swal from "sweetalert2";
import {
  isMobile
} from "react-device-detect";
import CIcon from "@coreui/icons-react";
import rudderanalytics from "../../../rudderService";
import { cilCart } from "@coreui/icons";

const Home = () => {
  const user = useSelector((state) => state.currentUser);
  const products = useSelector((state) => state.products);
  const history = useHistory();
  const dispatch = useDispatch()
  useEffect(()=>{
    rudderanalytics.track(
      "visitWeb",
      {}
    );
  },[])
  function toDetail(product) {
    history.push(`/product/${product.id}`);
  }
  function addToCart(item) {
    dispatch({
      type: "addItemtoCart",
      item: {
        detail: item,
        amount: 1,
      },
    });
    swal
      .mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", swal.stopTimer);
          toast.addEventListener("mouseleave", swal.resumeTimer);
        },
      })
      .fire({
        icon: "success",
        title: "Item added to cart  ",
      });
  }
  return (
    <>
      <CRow className="row justify-content-center">
        {products.map((product) => {
          return (
            <CCol key={product.id} className="col-auto mb-3">
              <CCard
                borderColor="info"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minWidth: "250px",
                  maxWidth: "250px"
                }}
              >
                <img
                  alt={product.picture}
                  src={product.picture}
                  style={{
                    backgroundSize: "cover",
                    borderRadius: "2px",
                    width: "100%",
                    height: "250px",
                  }}
                />
                <CCardTitle>{product.name}</CCardTitle>
                <div>Rp. {product.price}</div>
                <div style={{ display: "flex" }}>
                  <CButton
                    style={{ width: "100px", margin: "10px" }}
                    block
                    variant="outline"
                    color="warning"
                    onClick={() => toDetail(product)}
                  >
                    Detail
                </CButton>
                  <CButton
                    style={{ width: "120px", margin: "10px" }}
                    onClick={() => {
                      addToCart(product);
                    }}
                    block
                    variant="outline"
                    color="success"
                  >
                    <CIcon style={{ marginRight: "5px" }} content={cilCart} />
                  Add to cart
                </CButton>
                </div>
              </CCard>
            </CCol>
          );
        })}
      </CRow>
    </>
  );
};

export default Home;
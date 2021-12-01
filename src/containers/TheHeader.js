import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CToggler,
  CLink,
  CNavbar,
  CNavbarBrand,
  CNavbarNav,
  CButton,
  CDropdown,
  CDropdownToggle,
  CDropdownItem,
  CDropdownMenu,
  CModal,
  CModalBody,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
  CCol,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilCart, cilUser } from "@coreui/icons";
import swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import aixpTracker from "aixp-analytics";

const TheHeader = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);
  const signedIn = useSelector((state) => state.currentUser);

  const toggleSidebar = () => {
    const val = [true, "responsive"].includes(sidebarShow)
      ? false
      : "responsive";
    dispatch({ type: "set", sidebarShow: val });
  };

  const toggleSidebarMobile = () => {
    const val = [false, "responsive"].includes(sidebarShow)
      ? true
      : "responsive";
    dispatch({ type: "set", sidebarShow: val });
  };

  const handleSignIn = () => {
    history.push("/login")
  };

  const handleSignOut = () => {
    dispatch({ type: "setCurretUser", userEmail: "logout" });
    document.cookie.split(";").forEach(function (c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;Max-Age=-99999999;path=/"); });
    history.push("/")
    swal
      .mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 2000,
      })
      .fire({
        icon: "success",
        title: "Sucessfully Signed Out",
      });
  };


  return (
    <div>

      <CNavbar color="secondary" style={{ padding: "0px" }}>
        <CToggler
          inHeader
          className="ml-3 d-md-down-none"
          onClick={toggleSidebar}
        />

        <CNavbarBrand to="/">
          <img
            alt=""
            onClick={() => history.push(`/`)}
            style={{
              width: "70px",
              height: "50px",
              cursor: "pointer",
              marginRight: "10px",
            }}
            src="logo/miracle.jpeg"
          />
        </CNavbarBrand>
        <CNavbarNav
          className="ml-auto"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {signedIn ? (
            <span
              style={{ marginRight: "5px" }}
            >{`Welcome, ${signedIn.name}`}</span>
          ) : (
              ""
            )}
          <CButton
            color="primary"
            className="my-2 my-sm-0 mr-2"
            to="/cart"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CIcon content={cilCart} />
          </CButton>

          {signedIn ? (
            <CDropdown className="m-1 btn-group">
              <CDropdownToggle color="primary">
                <CIcon content={cilUser} />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem onClick={handleSignOut}>Sign Out</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          ) : (
              <CButton
                color="primary"
                className="my-2 my-sm-0 mr-2"
                onClick={handleSignIn}
              >
                Sign In
              </CButton>
            )}
        </CNavbarNav>
      </CNavbar>
    </div>
  );
};

export default TheHeader;
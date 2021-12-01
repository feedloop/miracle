import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
  CModal
} from "@coreui/react";
import { useSelector, useDispatch } from "react-redux";
import aixpTracker from "aixp-analytics";
import CIcon from "@coreui/icons-react";
import swal from "sweetalert2";
import ReactPDF from "@react-pdf/renderer";
import PDFViewer from "pdf-viewer-reactjs";
import { Document, Page, pdfjs } from "react-pdf";
import { cilUser, cilLockLocked } from "@coreui/icons";
import { Viewer } from "@react-pdf-viewer/core";
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Register = () => {
  const users = useSelector(state => state.users);
  const history = useHistory();
  const dispatch = useDispatch();
  const [name, setName] = React.useState("Miranti Cantika");
  const [email, setEmail] = React.useState("miranti_c@gmail.com");
  const [password, setPassword] = React.useState("12345678");
  const [confirmPassword, setConfirmPassword] = React.useState("12345678");
  const [error, setError] = React.useState("");
  const [check, setCheck] = React.useState(false);
  const [checkTerms, setCheckTerms] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const watch = React.useMemo(() => {
    setError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, password, confirmPassword]);
  function createAccount() {
    if (email.trim() === "") {
      setError("please fill email");
    } else if (name.trim() === "") {
      setError("please fill username");
    } else if (users.findIndex(user => user.name === name) !== -1) {
      setError("username already used");
    } else if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email.toLocaleLowerCase()
      )
    ) {
      setError("email not valid");
    } else if (password.length < 8) {
      setError("password at least 8 digits");
    } else if (confirmPassword !== password) {
      setError("password not match");
    } else if (users.findIndex(user => user.email === email) !== -1) {
      setError("email already used");
    } else {
      setError("");
      clearState();
      dispatch({
        type: "addUser",
        user: { name, email, password, check, checkTerms }
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
          title: `${email} account created`
        });
      dispatch({ type: "setCurretUser", userEmail: email });
      history.push(`/`);
    }
  }
  function clearState() {
    setName("");
    setConfirmPassword("");
    setEmail("");
    setPassword("");
  }

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CModal onClose={()=>setShow(!show)} style={{ width: "750px" }} show={show}>
        <Viewer fileUrl="/pdf/terms.pdf" />
      </CModal>
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="9" lg="7" xl="6">
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <img
                      alt=""
                      onClick={() => history.push(`/`)}
                      style={{
                        width: "100px",
                        height: "100px",
                        cursor: "pointer",
                        marginRight: "10px"
                      }}
                      src="logo/miracle.jpeg"
                    />
                    <h1>Register</h1>
                  </div>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon content={cilUser} />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput
                      required
                      value={name}
                      onChange={e => {
                        setName(e.target.value);
                      }}
                      type="text"
                      placeholder="Username"
                      autoComplete="username"
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>@</CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput
                      required
                      value={email}
                      onChange={e => {
                        setEmail(e.target.value);
                      }}
                      type="email"
                      placeholder="Email"
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon content={cilLockLocked} />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput
                      value={password}
                      minLength={8}
                      required
                      onChange={e => setPassword(e.target.value)}
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-2">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon content={cilLockLocked} />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput
                      value={confirmPassword}
                      required
                      minLength={8}
                      onChange={e => setConfirmPassword(e.target.value)}
                      type="password"
                      placeholder="Repeat password"
                      autoComplete="new-password"
                    />
                  </CInputGroup>
                  <CInputGroup
                    className="mb-2"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <input
                      type="checkbox"
                      onClick={() => setCheckTerms(!checkTerms)}
                      checked={checkTerms}
                    />{" "}
                    <span
                      style={{
                        marginLeft: "10px",
                        color: "blue",
                        cursor: "pointer"
                      }}
                      onClick={() => setShow(!show)}
                    >
                      I agree with the Terms & Condition
                    </span>
                  </CInputGroup>
                  <CInputGroup
                    className="mb-2"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <input
                      type="checkbox"
                      onClick={() => setCheck(!check)}
                      checked={check}
                    />{" "}
                    <span
                      style={{
                        marginLeft: "10px"
                      }}
                    >
                      I want to receive newsletter and special offers
                    </span>
                  </CInputGroup>
                  <span style={{ color: "red", marginBottom: "5px" }}>
                    {error === "" ? "" : error}
                  </span>
                  <CButton
                    onClick={() => createAccount()}
                    color="success"
                    block
                    style={{ marginTop: "8px" }}
                  >
                    Create Account
                  </CButton>
                  <CButton
                    onClick={() => history.push("/login")}
                    color="success"
                    block
                    style={{ marginTop: "8px" }}
                  >
                    Login
                  </CButton>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Register;

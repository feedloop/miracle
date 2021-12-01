import React, { useEffect } from 'react'
import { useHistory } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useSelector, useDispatch } from "react-redux";
import aixpTracker from "aixp-analytics";
import swal from "sweetalert2"
import { cilUser, cilLockLocked } from "@coreui/icons";
import rudderanalytics from "../../../rudderService";

const Login = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [error, setError] = React.useState("");
  const users = useSelector((state) => state.users);
  const [email, setEmail] = React.useState("miranti_c@gmail.com");
  const [password, setPassword] = React.useState("12345678");
  function handleLogin() {
    const user = users.find((user) => user.email === email)
    if (!user) {
      setError("account not found");
    } else if (user.password !== password) {
      setError("username/password not match");
    } else {
      dispatch({ type: 'setCurretUser', userEmail: email })
      rudderanalytics.identify(email, {
        email
      });
      rudderanalytics.track("login", {
        email
      });
      history.push("/")
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
          title: `Succesfully logged in`,
        });
    }
  }
  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="6">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        alt=""
                        onClick={() => history.push(`/`)}
                        style={{
                          width: "100px",
                          height: "100px",
                          cursor: "pointer",
                          marginRight: "10px",
                        }}
                        src="logo/miracle.jpeg"
                      />
                      <h1>Login</h1>
                    </div>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon content={cilUser} />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" onChange={(e) => {
                        setEmail(e.target.value);
                      }} value={email} placeholder="Email" autoComplete="email" />
                    </CInputGroup>
                    <CInputGroup className="mb-2">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon content={cilLockLocked} />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput onChange={(e) => {
                        setPassword(e.target.value);
                      }} type="password" value={password} placeholder="Password" autoComplete="new-password" />
                    </CInputGroup>
                    <span style={{ color: "red", marginBottom: "15px" }}>
                      {error === "" ? "" : error}
                    </span>
                    <CRow>
                      <CCol xs="6">
                        <CButton onClick={() => handleLogin()} color="success" className="px-4">Login</CButton>
                      </CCol>
                      <CCol xs="6" className="text-right">
                        <CButton onClick={() => history.push("/register")} color="secondary" className="px-4">Register</CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
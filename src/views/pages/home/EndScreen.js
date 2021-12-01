import React, { useEffect } from "react";
import { CRow, CCol, CCard, CCardTitle, CButton } from "@coreui/react";
import swal from "sweetalert2";
const Home = () => {

  useEffect(() => {
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
        title: "Items Purchased",
      });
  }, []);

  return (
    <>
      <div style={{ height: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

        <h1>Thank you for shopping with Miracle</h1>
        <CButton to='/'>
          <h3 style={{ color: '#3399ff', cursor: 'pointer' }} >Shop more</h3>
        </CButton>

      </div>
    </>
  );
};

export default Home;

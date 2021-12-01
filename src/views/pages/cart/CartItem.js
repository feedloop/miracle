import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { CSpinner, CButton, CCol, CRow } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilTrash } from "@coreui/icons";

const CartItem = (props) => {
  const { product, editable } = props
  const dispatch = useDispatch();
  const history = useHistory()
  const [amount, setAmount] = React.useState(product.amount);

  useEffect(() => {
    dispatch({
      type: "setItemAmount",
      item: {
        detail: product.detail,
        amount,
      },
    });
  }, [amount]);

  function removeItem() {
    dispatch({
      type: "removeItemfromCart",
      item: {
        detail: product.detail,
        amount,
      },
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
      <div className="row justify-content-center">
        <CCol key={product.detail.id} className="col-auto mb-4">
          <img
            src={product.detail.picture}
            style={{
              backgroundSize: "cover",
              width: '200px',
              height: '200px',
              margin: '1em',
            }}
          />
        </CCol>
        <CCol key={product.detail.id} className="col-auto mb-4">
          <div
            style={{
              maxWidth: "500px",
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              height: '100%',
              paddingRight: '200px',
            }}
          >
            <div style={{ fontSize: "30px", fontWeight: "bold", cursor: 'pointer' }} onClick={() => history.push(`/product/${product.detail.id}`)}>
              {product.detail.name}
            </div>
            <div style={{ fontSize: "20px" }}>
              Price:{" "}
              <span style={{ fontWeight: "bolder" }}>Rp{product.detail.price}</span>
            </div>
            {editable ?
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
                    padding: "0px",
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
                    MozAppearance: "textfield",
                  }}
                  type="number"
                  value={amount}
                  onChange={(e) => {
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
                    padding: "0px",
                  }}
                >
                  +
                </CButton>
                <CButton
                  style={{ width: "40px", margin: "10px" }}
                  block
                  variant="outline"
                  color="danger"
                  onClick={removeItem}
                >
                  <CIcon content={cilTrash} />

                </CButton>
              </div>
              :
              <div style={{ fontSize: "16px" }}>
                <span style={{ fontWeight: "bolder" }}>{product.amount} X</span>
              </div>}
          </div>
        </CCol>
      </div>

    </>
  );
};

export default CartItem;

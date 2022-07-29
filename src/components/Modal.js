import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
import { forwardRef, useImperativeHandle } from "react";

const ModalC  = forwardRef((props, ref) =>  {

  const [show, setShow] = useState(false);
  const [modalMessage,setModalMessage] = useState('Complete all the steps');


  const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);

  useImperativeHandle(ref, () => ({
    handleShow(a, text) {
        // if(columnsToInclude.length<=0 && VINColumnName==="Nothing" && selectedSheetNumber===-1 ) {
        //   setModalText("Please complete steps 2 3 4");
        // }
        setShow(a);
        setModalMessage(text);
    }
  }));

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
});
export default ModalC;
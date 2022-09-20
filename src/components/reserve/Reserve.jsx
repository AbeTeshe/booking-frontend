import React from 'react';
import CancelIcon from '@mui/icons-material/Cancel';

const Reserve = ({setOpenModal, hotelId}) => {
  return (
    <div className="reserve">
        <div className="rContainer">
            <CancelIcon className="rClose" onClick={() => setOpenModal(false)}/>
            <span>Select your rooms:</span>
        </div>
    </div>
  )
}

export default Reserve;
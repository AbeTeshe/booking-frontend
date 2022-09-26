import React, { useState } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from "axios";
import useFetch from "../../hooks/useFetch";
import { useContext } from 'react';
import {useNavigate} from "react-router-dom";
import { SearchContext } from '../../context/SearchContext';
import "./reserve.css";

const Reserve = ({setOpenModal, hotelId}) => {
  const [selectedRooms, setSelectedRooms] = useState([]);

  const {data, loading, error} = useFetch(`/hotels/room/${hotelId}`);

  const {dates} = useContext(SearchContext);

  const navigate = useNavigate();

  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);


    const date = new Date(start.getTime());

    let list = [];

    while (date <= end) {
      list.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }

    return list;
  }

  const allDates = getDatesInRange(dates[0].startDate, dates[0].endDate);

  const isAvailable = (roomNumber) => {
    const isFound = roomNumber.unavailableDates.some((date) => 
    allDates.includes(new Date(date).getTime()));

    return !isFound;
  }
  const handleSelect = (e) => {
    const checked = e.target.checked
    const value = e.target.value
    setSelectedRooms(
      checked 
      ? [...selectedRooms, value] : selectedRooms.filter((item) => item !==value))
  }

  const handleClick = async () => {
    try {
      await Promise.all(selectedRooms.map(roomId => {
        const res = axios.put(`http://localhost:5000/api/rooms/availability/${roomId}`, {dates: allDates});
        return res.data;
      }));
      setOpenModal(false);
      navigate("/");
    }
    catch (err) {

    }
  }

  return (
    <div className="reserve">
        <div className="rContainer">
            <CancelIcon className="rClose" onClick={() => setOpenModal(false)}/>
            <span>Select your rooms:</span>
           {data.map(item => (
            <div className="rItem">
              <div className="rItemInfo">
                <div className="rTitle">{item.title}</div>
                <div className="rDesc">{item.desc}</div>
                <div className="rMax">Max people: <b>{item.maxPeople}</b></div>
                <div className="rPrice">{item.price}</div>
              </div>
             <div className="rSelectRooms">
              {item.roomNumbers.map((roomNumber) => (
                  <div className="room">
                    <label>{roomNumber.number}</label>
                    <input 
                      type="checkbox" 
                      value={roomNumber._id} 
                      onChange={handleSelect}
                      disabled={!isAvailable(roomNumber)}
                    />
                  </div>
                ))}
             </div>
            </div>
           ))}
           <button onClick={handleClick} className="rButton">Reserve Now!</button>
        </div>
    </div>
  )
}

export default Reserve;
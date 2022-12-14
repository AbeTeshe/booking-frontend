
import {useState, useContext} from 'react';
import HotelIcon from '@mui/icons-material/Hotel';
import LocalHotelIcon from '@mui/icons-material/LocalHotel';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import { DateRange } from 'react-date-range';
import {format} from "date-fns";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

import "./header.css";
import { SearchContext } from '../../context/SearchContext';

const Header = ({type}) => {
    const [destination, setDestination] = useState("");
    const [openDate, setOpenDate] = useState(false);
    const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    room: 1
  });

  const { user} = useContext(AuthContext);

  const navigate = useNavigate();

  const handleOption = (name, operation) => {
    setOptions((prev) => {return {
        ...prev, [name]: operation ==="i" ? options[name] + 1 : options[name] -1,
    }})
  };

  const {dispatch}= useContext(SearchContext);

  const handleSearch = () => {
    dispatch({type: "NEW_SEARCH", payload: {destination, dates, options}})
    navigate("/hotels", {state: {destination, dates, options}});
  }


  return (
    <div className="header">
        <div className={type==="list" ? "headerContainer listMode" : "headerContainer"}>
            <div className="headerList">
                <div className="headerListItem active">
                    <HotelIcon />
                    <span>Stays</span>
                </div>
                <div className="headerListItem">
                    <FlightTakeoffIcon />
                    <span>Flights</span>
                </div>
                <div className="headerListItem">
                    <DirectionsCarIcon />
                    <span>Car rentals</span>
                </div>
                <div className="headerListItem">
                    <LocalHotelIcon />
                    <span>Attractions</span>
                </div>
                <div className="headerListItem">
                    <LocalTaxiIcon />
                    <span>Airport taxis</span>
                </div>
            </div>
            { type !=="list" && <><h1 className="headerTitle">A lifetiem of discounts? It's Genius.</h1>
            <p className="headerDesc">Get rewarded for your travels - unlock instant savings of 10% or more with a free lamabooking account </p>
           {!user &&  <button className="headerBtn">Sign in / Register</button>}
            <div className="headerSearch">
                <div className="headerSearchItem">
                    <HotelIcon className="headerIcon" />
                    <input type="text" 
                        placeholder="Where are you goingh?" 
                        className="headerSearchInput"
                        onChange={(e) => setDestination(e.target.value)}
                        />
                </div>
                <div className="headerSearchItem">
                    <CalendarMonthIcon className="headerIcon" />
                    <span className="headerSearchText" onClick={() => setOpenDate(!openDate)}>{`${format(dates[0].startDate, "MM/dd/yyyy")} to ${format(dates[0].endDate, "MM/dd/yyyy")}` }</span>
                    {openDate && <DateRange
                        editableDateInputs={true}
                        onChange={item => setDates([item.selection])}
                        moveRangeOnFirstSelection={false}
                        ranges={dates}
                        className="date"
                    />}
                </div>
                <div className="headerSearchItem">
                    <PersonIcon className="headerIcon" />
                    <span onClick={() => setOpenOptions(!openOptions)} className="headerSearchText">{`${options.adult} adult . ${options.children} children . ${options.room} room`}</span>
                    {openOptions && <div className="options">
                        <div className="optionItem">
                            <span className="optionText">Adult</span>
                            <div className="optionCounter">
                                <button 
                                    disabled={options.adult <=1}
                                    className="optionCounterButton" 
                                    onClick={() => handleOption("adult", "d")}>-</button>
                                <span className="optionCounterNumber">{options.adult}</span>
                                <button className="optionCounterButton" onClick={() => handleOption("adult", "i")}>+</button>
                            </div>
                        </div>
                        <div className="optionItem">
                            <span className="optionText">Children</span>
                            <div className="optionCounter">
                                <button 
                                    disabled={options.children <=0}
                                    className="optionCounterButton" 
                                    onClick={() => handleOption("children", "d")}>-</button>
                                <span className="optionCounterNumber">{options.children}</span>
                                <button className="optionCounterButton" onClick={() => handleOption("children", "i")}>+</button>
                            </div>
                        </div>
                        <div className="optionItem">
                            <span className="optionText">Room</span>
                            <div className="optionCounter">
                                <button 
                                    disabled={options.room <=1}
                                    className="optionCounterButton" 
                                    onClick={() => handleOption("room", "d")}>-</button>
                                <span className="optionCounterNumber">{options.room}</span>
                                <button className="optionCounterButton" onClick={() => handleOption("room", "i")}>+</button>
                            </div>
                        </div>
                    </div>}
                </div>
                <div className="headerSearchItem">
                   <button className="headerBtn" onClick={handleSearch}>Search</button>
                </div>
            </div></> }
        </div>
    </div>
  )
}

export default Header
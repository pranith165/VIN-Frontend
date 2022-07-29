import Dropdown from 'react-bootstrap/Dropdown';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from "react";
import {setVINColumnNumber} from '../redux/reducers/excelBagReducer';


const SelectVinColumn = () => {
    const {excelColumns} = useSelector((state)=> state.excelBag);
    const dispatch = useDispatch();
    const[selectedVinColumn, setSelectedVIN]  = useState("Select VIN Column");

    const handleSelect = (key) => {
       setSelectedVIN(key);
       dispatch(setVINColumnNumber(key));
    }

    useEffect(()=> {
        setSelectedVIN("Select VIN Column");
    },[excelColumns])

    return (
        <div>
            <Dropdown onSelect={handleSelect}>
                <Dropdown.Toggle variant="success" id="dropdown-basic" onSelect={handleSelect}>
                    {selectedVinColumn}
                </Dropdown.Toggle>
            
                <Dropdown.Menu>
                    <Dropdown.Item disabled eventKey="home">Select Sheet Column</Dropdown.Item>
                        {
                            excelColumns.map((item) => {
                                return (
                                    <Dropdown.Item key={item.toString()} eventKey={item}>{item}</Dropdown.Item>
                                );
                            })
                        }
                    </Dropdown.Menu>
            </Dropdown>
        </div>

      );
}

export default SelectVinColumn;



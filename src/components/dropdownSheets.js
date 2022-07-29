import Dropdown from 'react-bootstrap/Dropdown';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from "react";
import {setDropdownSelectedSheetNumber,setexcelDetails } from '../redux/reducers/excelBagReducer';
import * as XLSX from 'xlsx';

const SelectVinSheet = () => {
    const {sheetNames, workbookSheets} = useSelector((state)=> state.excelBag);
    const dispatch = useDispatch();
    const[selectedSheetName, setSelectedSheetName]  = useState("Select Sheet Name");

    const handleSelectSheetName = (key) => {
        setSelectedSheetName(sheetNames[key]);
        dispatch(setDropdownSelectedSheetNumber(key));
        // console.log(workbookSheets);
        let worksheet=workbookSheets[sheetNames[key]];
        let data = XLSX.utils.sheet_to_json(worksheet);
        console.log(data);
        // finding duplicate columns
        // let excelAllColumns = Object.keys(data);


        // const toFindDuplicates = arry => arry.filter((item, index) => arr.indexOf(item) !== index)
        // const duplicateElementa = tofindDuplicates(arry);
        dispatch(setexcelDetails(data))
    }

    return (
        <div>
            <Dropdown onSelect={handleSelectSheetName}>
                <Dropdown.Toggle variant="success" id="dropdown-basic" onSelect={handleSelectSheetName}>
                    {selectedSheetName}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item disabled eventKey="home">Select Sheet</Dropdown.Item>
                    {
                        sheetNames.map((item, index) => {
                            return (
                                <Dropdown.Item key={index} eventKey={index}>{item}</Dropdown.Item>
                            );
                        })

                    }
                    
                </Dropdown.Menu>
            </Dropdown>
        </div>

      );
}

export default SelectVinSheet;



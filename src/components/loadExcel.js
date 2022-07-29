import { useState, useEffect } from "react";
import './loadExcel.css';
import * as XLSX from 'xlsx';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import {setexcelDetails, decrement} from '../redux/reducers/excelBagReducer';
import OrderColumn from "./orderColumn";


const SubmitButton = styled.button`
    color: white;
    cursor: pointer;
    background: #198754;
    padding: 8px;
    border-radius: 6%;
    border: none;
`;

const ExcelDiv = styled.div`
    border: 1px solid white;
`;


const ExcelLoad = () => {

    const [excelFile, setExcelFile] = useState(null);
    const [excelData, setExcelData] = useState(null);

    const dispatch = useDispatch();

    const handleOnChange = (e) => {
        e.preventDefault();
        let selectedFile = e.target.files[0];
        if(selectedFile) {
            let reader = new FileReader();
            reader.readAsArrayBuffer(selectedFile);
            reader.onload = (e) => {
                setExcelFile(e.target.result);
            }
        } else {
            console.log('pls select your file');
        }
    };

    const handleSubmit = () => {
        if(excelFile!=null) {
            const workbook = XLSX.read(excelFile,{type:'buffer'});
            console.log(workbook.SheetNames);
            const worksheetName = workbook.SheetNames[0];
            const worksheet=workbook.Sheets[worksheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);
            setExcelData(data);
            dispatch(setexcelDetails(data))
        }
    }

    return (
        <div>
            <div>
                Import the excel file
            </div>
            <div>
            <ExcelDiv>
                <input type="file" onChange ={(e) => {handleOnChange(e)}}/>
                <SubmitButton onClick={handleSubmit}>Load Sheet</SubmitButton>
                <OrderColumn></OrderColumn>
            </ExcelDiv>
            </div>
        </div>
    );
};

export default ExcelLoad;
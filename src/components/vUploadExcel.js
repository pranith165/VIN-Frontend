import React from 'react';
import axios from 'axios';
import styled from 'styled-components';
import * as XLSX from 'xlsx';
import './vUpload.css';
import { SpinnerInfinity } from 'spinners-react';
import ModalC from './Modal';
import { useRef, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {setSheetnames, setHeaderPresentValue, setWorkbookDetails, setSources, setExcelGeneratorData} from '../redux/reducers/excelBagReducer';
import MultiSelectDropdown from './multiselect' ;
import SelectVinColumn from './dropdownVIN';
import SelectVinSheet from './dropdownSheets';
import Preview from './preview';
import BadgeNumber from './badge';
import ExcelDownloader from './excelDownloader';
import * as FileSaver from 'file-saver';

const Downlaodtag = styled.a`
  color: white;
  background: ${props => props.dangerColor ? '#DC3545' : '#198754'};
  padding: 15px 36px;
  border-radius: 10px;
  border: none;
  cursor: ${props => props.cursorPointer ? props.cursorPointer : 'not-allowed'};
  text-decoration: none;
  opacity: ${props => props.opacityNumber ? 0.6 : ''};
  font-weight: bold;
  letter-spacing: 2px;
`

const FormContainer = styled.div`
  margin-bottom: 64px;
`
const SubmitButton = styled.span`
    color: white;
    cursor: pointer;
    background: #198754;
    padding: 8px;
    border-radius: 6%;
    border: none;
`;

const Form = () => {

  const childRef = useRef(null);

  const {sheetNames, headerPresent, selectedSheetNumber, excelColumns, VINColumnName, columnsToInclude,includedColumnsArray} = useSelector((state)=> state.excelBag);
  // a local state to store the currently selected file.
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [downloadLink, setDownloadLink] = React.useState('');
  const [cursorFeature, setCursor] = React.useState('');
  const [uploadButton, setUploadButton] = React.useState(true);
  const [enableDownloadLink, setEnableDownloadLink] = React.useState(true);
  const [opacityNumber, setOpacityNumber] = React.useState(true);
  const [linkText, setLinktext] = React.useState('Download ');
  const [spinnerComp, setSpinner] = React.useState(false);
  const [disableClass, setDisabledClass] = React.useState('disabledLinkClass');
  // const [displayHeaders, setDisplayHeaders] = useState(false);
  const [dangerColor, setDangerColor] = useState(false);


  const [excelFile, setExcelFile] = useState(null);
  // const [excelData, setExcelData] = useState(null);

  const dispatch = useDispatch();

  // const baseURL = "http://localhost:8000/" 
  const baseURL = "https://vinextractor-backend.herokuapp.com/" 
//   "http://127.0.0.1:8000/api/maps/"


  const updateMessage = (text) => {
    console.log(text);
    childRef.current.handleShow(true, text);
  };


  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';
  const centralData = useSelector((state)=> state.excelBag); 
  const exportToCSV = () => {
    // checking how many sheets to create
    const wb = XLSX.utils.book_new();
    if(centralData.isNHTSA && centralData.isVindicator) {
        const ws1 = XLSX.utils.json_to_sheet(centralData.excelGeneratorData.response_NHTSA);
        const ws2 = XLSX.utils.json_to_sheet(centralData.excelGeneratorData.response_Vindicator);
        const ws3 = XLSX.utils.json_to_sheet(centralData.excelGeneratorData.response_Compare);

        XLSX.utils.book_append_sheet(wb, ws1, "NHTSA");
        XLSX.utils.book_append_sheet(wb, ws2, "Vindicator");
        XLSX.utils.book_append_sheet(wb, ws3, "Compare");
    }

    if(centralData.isNHTSA && centralData.isVindicator===false) {
        const ws1 = XLSX.utils.json_to_sheet(centralData.excelGeneratorData.response_NHTSA);
        XLSX.utils.book_append_sheet(wb, ws1, "NHTSA");
    }


    if(centralData.isNHTSA === false && centralData.isVindicator) {
        const ws1 = XLSX.utils.json_to_sheet(centralData.excelGeneratorData.response_Vindicator);
        XLSX.utils.book_append_sheet(wb, ws1, "Vindicator");
    }

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type:'array'});

    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, 'vinData' + fileExtension);
  }


  const handleSubmit = async(event) => {
    event.preventDefault()
    setDangerColor(false);
    let x = document.getElementById("NHTSA").checked;
    let y = document.getElementById("vindicator").checked;
    if((x || y)  && VINColumnName && columnsToInclude.length>0) {
      setLinktext('Downloading ')
      setSpinner(true);
      const formData = new FormData();
      formData.append("selectedFile", selectedFile);
      formData.append("detailsNHTSA", x);
      formData.append("detailsVindicator", y);
      formData.append("headerPresent", headerPresent);
      formData.append("selectedVINColumn", VINColumnName);
      formData.append("columnsToInclude",  JSON.stringify(columnsToInclude));      
      try {
        const response = await axios({
          method: "post",
          //url:"http://127.0.0.1:8000/api/maps/",
          url: 'https://vinextractor-backend.herokuapp.com/api/maps/',
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        });
        // setDownloadLink(response.data);
        setDownloadLink("hello world");
        console.log(response.status)
        const responseObject = {};
        if(response.status===200) {
          if(x && y === false) {
            const obj = JSON.parse(JSON.stringify(response.data));
            const s1 = JSON.parse(obj.response_NHTSA);
            console.log(s1);
            const responseObject = {
              response_NHTSA : s1,
            }
            dispatch(setExcelGeneratorData(responseObject));
          }
          else if (x===false && y===true) {
            const obj = JSON.parse(JSON.stringify(response.data));
            const s1 = JSON.parse(obj.response_vindicator);
            console.log(s1);
            const responseObject = {
              response_Vindicator : s1,
            }
            dispatch(setExcelGeneratorData(responseObject));
          }
          else if( x && y) {
            const obj = JSON.parse(JSON.stringify(response.data));
            const s1 = JSON.parse(obj.response_NHTSA)
            const s2 = JSON.parse(obj.response_vindicator);
            const s3 = JSON.parse(obj.response_Compare)
            console.log(s1);
            const responseObject = {
              response_NHTSA : s1,
              response_Vindicator : s2,
              response_Compare : s3
            }
            dispatch(setExcelGeneratorData(responseObject));
          }

          setCursor('pointer');
          setOpacityNumber(false);
          setEnableDownloadLink(false);
          setSpinner(false);
          setDisabledClass('');
          setLinktext('Download');
          setDangerColor(false);
          
        }
        else if(response.status===203) {
          updateMessage(response.data.message);
          setLinktext('Download Failed');
          setSpinner(false);
          setDangerColor(true);
        }
      } catch(error) {
          setLinktext('Download Failed');
          setSpinner(false);
          setDangerColor(true);
        console.log(error)
      }
    } else {
      updateMessage('Please complete all fields');
    }

  }


  const handleLoadSheets = (e) => {

    try {
      if(excelFile!=null) {
        const workbook = XLSX.read(excelFile,{type:'buffer'});
        // const worksheetName = workbook.SheetNames[0];
        // const worksheet=workbook.Sheets[worksheetName];
        // const data = XLSX.utils.sheet_to_json(worksheet);
        // setExcelData(data);
        dispatch(setSheetnames(workbook.SheetNames));
        // dispatch(setexcelDetails(data))
        console.log(workbook.Sheets);
        dispatch(setWorkbookDetails(workbook.Sheets));
        // const workbook = XLSX.read(excelFile,{type:'buffer'});
        // dispatch(setSheetnames(workbook.SheetNames));
      }
    } catch (e) {
        updateMessage('File Type is not supported');
    }

  }

  const handleFileSelect = (event) => {
    setUploadButton(false);
    setSelectedFile(event.target.files[0]);
    setOpacityNumber(false);
  }

  const handleOnChange = (e) => {
    e.preventDefault();
    let selectedFile = e.target.files[0];
    console.log(selectedFile.type);
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

  const headerCheck = (id) => {
    let headerPresent = id;
    dispatch(setHeaderPresentValue(headerPresent))
  }

  const handleSourceCheck = (source) => {
    dispatch(setSources(source))
  };

  const downloadURL = baseURL + downloadLink+'.xlsx';

  return (
    <div className='fileContainer'>
      <h1 className='excelHeader'>VIN   Extractor</h1>
      <ModalC ref={childRef}/>
      <div className="backgroundContainer">
      <FormContainer>
        <form onSubmit={handleSubmit}>    
          <div>
            <BadgeNumber className="badgeAlignment" number={1}/>
            <p className="dropdownText"> Select the Excel file from your device</p>
            <input className='inputFile' type="file" onChange={(e) => {handleOnChange(e); handleFileSelect(e)}}/>
            <SubmitButton onClick={handleLoadSheets}>Load Sheet</SubmitButton>
          </div>
          <hr className="separator"></hr>
          <div className="sheetsDropdownContainer">
          <BadgeNumber className="badgeAlignment" number={2}/>
            <p className="dropdownText"> Select the sheet from your excel file</p>
            <SelectVinSheet/>
            <Preview></Preview>
          </div>
          <hr className="separator"></hr>
 
          <div className="vinColumnDropdownContainer">
          <BadgeNumber className="badgeAlignment" number={3}/>
            <p className="dropdownText"> {`Does Selected ${excelColumns.length> 0 ? sheetNames[selectedSheetNumber]: ''} sheet from your excel consists Header? `}</p>
            <div className="radioboxContainer">
              <input className="radioButton" onClick={(e) => {headerCheck(true)}} type="radio" id="YesCheckbox" name="fav_language" value="Yes" />
              <label className="radioButtonLabel" for="Yes">Yes</label>
              <input className="radioButton" onClick={(e) => {headerCheck(false)}}  type="radio" id="NoCheckbox" name="fav_language" value="No" /> 
              <label className="radioButtonLabel" for="No">No</label>
            </div>
            <SelectVinColumn />
          </div>
          <hr className="separator"></hr>
          <div>
            <BadgeNumber className="badgeAlignment" number={4}/>
            <p className="dropdownText"> {`Select the columns which needs to be included in output file`}</p>
            <MultiSelectDropdown displayHeaders={true}/>
          </div>
          <hr className="separator"></hr>
          <div className='fullCheckboxContainer'>
            <BadgeNumber className="badgeAlignment" number={5}/>
            <p className="dropdownText"> {`Select the below sources to retrieve the data`}</p>
            <span className="checkboxContainer">
              <input className="fromCheckboxes" onClick={(e) => {handleSourceCheck('NHTSA')}} type="checkbox" id="NHTSA" name="NHTSA" value="NHTSA"></input>
              <label className="checkboxLabel" for="NHTSA">NHTSA  </label>
            </span>
            <span className="checkboxContainer">
              <input className="fromCheckboxes" onClick={(e) => {handleSourceCheck('Vindicator')}}type="checkbox" id="vindicator" name="vindicator" value="vindicator"></input>
              <label className="checkboxLabel" for="vindicator">Vindicator</label>
            </span>
          </div>
          <hr className="separator"></hr>
          <div>            
          </div>
          <input disabled={uploadButton} className='submitButton' type="submit" value="Upload File" />
        </form>
      </FormContainer>
      {/* <MultiSelectDropdown displayHeaders={true}/> */}
      {/* <SelectVinColumn/> */}
      <hr className="separator"></hr>
      {/* <SelectVinSheet/> */}
      {/* <SubmitButton onClick={handleLoadSheets}>Load Sheet</SubmitButton> */}

      <Downlaodtag className={`downloadLink ${disableClass}`}  opacityNumber={opacityNumber} dangerColor={dangerColor} cursorPointer={cursorFeature} onClick={(e) => exportToCSV()}>{linkText}<SpinnerInfinity secondaryColor={'#4A4A4A'} size={30} enabled={spinnerComp} /></Downlaodtag>

      {/* <Downlaodtag className={`downloadLink ${disableClass}`}  opacityNumber={opacityNumber} dangerColor={dangerColor} cursorPointer={cursorFeature} onClick={(e) => exportToCSV()} href={downloadURL} download>{linkText}<SpinnerInfinity secondaryColor={'#4A4A4A'} size={30} enabled={spinnerComp} /></Downlaodtag> */}
      </div>
    </div>
  )
};

export default Form;
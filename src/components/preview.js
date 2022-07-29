import React from 'react';
import MUIDataTable from 'mui-datatables';
import { useSelector } from 'react-redux';


const Preview = () => {

  const {excelColumns, previewRecords, sheetNames, selectedSheetNumber} = useSelector((state)=> state.excelBag);

  let columnsNames = [];

  excelColumns.map((item) => {
    return columnsNames.push(item)
  });

  const options = {
    download: false,
    fixedHeader: true,
    print: true,
    rowsPerPage: 5,
    filter: true,
    selectableRows: 'none',
    rowsPerPageOptions:[5,8,10],
    display: false
  }

  return (
    <div style={{ maxWidth: '100%', marginTop: '50px' }}>
      <MUIDataTable
        columns = {columnsNames}
        data={previewRecords}
        title={`Preview for first 25 records from ${excelColumns.length>0 ? sheetNames[selectedSheetNumber]: 'selected'} sheet`}
        options={options}
        checkbox= {false}
      />
    </div>
  )
  }


export default Preview;
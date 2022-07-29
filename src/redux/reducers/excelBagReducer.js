import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    searchInputs : [],
    excelColumns : [],
    searchKeys : [],
    sheetNames: [],
    searchString: 'CUTR',
    VINColumnName: 'Nothing',
    selectedSheetNumber: -1,
    headerPresent: false,
    noVinColumn: [],
    workbookSheets:{},
    columnsToInclude:[],
    previewRecords: [],
    isNHTSA: false,
    isVindicator: false,
    includedColumnsArray:[],
    excelGeneratorData: {}
}

export const excelSlice = createSlice({
  name: 'excelBag',
  initialState,
  reducers: {

    setexcelDetails: (state, action) => {
      const inputs = action.payload;
      let keyColumn = Object.keys(inputs[0]);
      let previewRecords = inputs.slice(1,27);
      return {
        ...state,
        excelColumns: keyColumn,
        previewRecords
      } 
    },

    setSheetnames: (state, action) => {
        const sheetNames = action.payload;
        return {
          ...state,
          sheetNames,
        } 
    },

    setVINColumnNumber: (state, action) => {
      let VINColumnName = action.payload;
       return {
         ...state,
         VINColumnName
       }
    },

    setDropdownSelectedSheetNumber: (state, action) => {
      let selectedSheetNumber = action.payload;
      return {
        ...state,
        selectedSheetNumber,
        columnsToInclude:[],
        includedColumnsArray:[],
        VINColumnName: 'Nothing'
      }
    },

    setHeaderPresentValue: (state, action) => {
      let headerPresent = action.payload;
      return {
        ...state,
        headerPresent
      }
    },

    setWorkbookDetails: (state, action) => {
      let workbookSheets = action.payload;
      return {
        ...state,
        workbookSheets
      }
    },

    setExcelGeneratorData: (state, action) => {
      let excelGeneratorData = action.payload;
      return {
        ...state,
        excelGeneratorData
      }
    },

    setColumnsToInclude: (state, action) => {
      let columnsToInclude = action.payload;
      let includedColumnsArray = [];
      columnsToInclude.map((item) => {
        return includedColumnsArray.push(item.label);
      })
      return {
        ...state,
        columnsToInclude,
        includedColumnsArray
      }
    },

    setSources: (state, action) => {
      let source = action.payload;
      let NHTSA = state.isNHTSA;
      let Vindicator = state.isVindicator;
      if(source==="NHTSA") {
        if(NHTSA) {
          return {
            ...state,
            isNHTSA: false
          }
        } else {
          return {
            ...state,
            isNHTSA: true
          }
        }
      } else {
        if(Vindicator) {
          return {
            ...state,
            isVindicator: false
          }
        } else {
          return {
            ...state,
            isVindicator: true
          }
        }
      }
    }

  },



})

// Action creators are generated for each case reducer function
export const { setexcelDetails, setSheetnames, setVINColumnNumber, setDropdownSelectedSheetNumber, setHeaderPresentValue, setWorkbookDetails, setColumnsToInclude, setSources, setExcelGeneratorData} = excelSlice.actions

export default excelSlice.reducer
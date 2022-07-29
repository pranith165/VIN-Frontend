import React, { useEffect, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import { useSelector, useDispatch } from "react-redux";
import styled from 'styled-components';
import { setColumnsToInclude  } from "../redux/reducers/excelBagReducer";


const HeadersDropdown = styled.div`
  display: ${props => props.displayHeaders ? 'block' : 'None'};
`

const MultiSelectDropdown = ({displayHeaders}) => {

    const {excelColumns, columnsToInclude} = useSelector((state)=> state.excelBag);
    const [selected, setSelected] = useState([]);
    const dispatch = useDispatch();
    let options = [];

    useEffect(() => {
        setSelected([]);
    }, [excelColumns]);

    for(let i=0; i<excelColumns.length; i++) {
        options.push({label:excelColumns[i], value: excelColumns[i]});
    };

    const handleMultiColumnSelect = () => {
        // console.log(selected + 'fuc');
        dispatch(setColumnsToInclude(selected));
    }

    return (
        <HeadersDropdown displayHeaders={displayHeaders}>
            <MultiSelect
                options={options}
                value={selected}
                //onChange={setSelected}
                onChange={setSelected}
                onMenuToggle={handleMultiColumnSelect}
                labelledBy="Select Cloumns to include"
                MultiSelect= 'false'
            />
        </HeadersDropdown>
    );
};

export default MultiSelectDropdown;
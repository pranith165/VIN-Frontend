import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";


const OrderColumn = () => {
    const {excelColumns} = useSelector((state)=> state.excelBag);

    // console.log("OrderColumn");
    // console.log(excelColumns);
    return (
        <div>
            { excelColumns.length>0&&excelColumns.map((x) => {
                // console.log(x);
                return ( <h2>{x}</h2> )
               
            })}
            <p>{excelColumns.length>0 ? excelColumns[0]: "no data" }</p>
        </div>
    );
};

export default OrderColumn;
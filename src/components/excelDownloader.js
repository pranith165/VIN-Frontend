import Button from 'react-bootstrap/Button';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { useSelector } from "react-redux";


const ExcelDownloader = () => {
    const centralData = useSelector((state)=> state.excelBag); 

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';


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

    return (
        <div>
            <Button variant="warning" onClick={(e) => exportToCSV()}>Export</Button>
        </div>
    );
}

export default ExcelDownloader;
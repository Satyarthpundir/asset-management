import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import "./App.css";
import tableData from './components/tableData';

function ReportGenerator() {


 

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);


  

  const copyToClipboard = () => {
    
    const textarea = document.createElement('textarea');
    textarea.value = tableToText();
    document.body.appendChild(textarea);

    
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    alert('Table content copied to clipboard');
  };

  const tableToText = () => {
    const headerRow = 'DIVISION NO.\tDIVISION NAME\tSUBDIVISION\tSUBSTATION COUNT\tDAMAGE COUNT\tDAMAGE PERCENTAGE\n';
    const divider = '------------\t--------------\t------------\t----------------\t------------\t-----------------\n';
  
    const text = filteredData.reduce((result, data) => {
      const divisionNumber = data.divisionNumber.toString().padEnd(13, ' ');
      const divisionName = data.divisionName.padEnd(15, ' ');
      const subdivision = data.subdivision.padEnd(2, ' ');
      const subtractionCount = data.subtractionCount.toString().padStart(15, ' ');
      const damageCount = data.damageCount.toString().padStart(20, ' ');
      const damagePercentage = data.damagePercentage.padStart(16, ' ');
  
      return result +
        `${divisionNumber}\t${divisionName}\t${subdivision}\t${subtractionCount}\t${damageCount}\t${damagePercentage}\n`;
    }, '');
  
    return headerRow + divider + text;
  };
  const downloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Division Number,Division Name,Subdivision,Subtraction Count,Damage Count,Damage Percentage\n" +
      filteredData.map(data => `${data.divisionNumber},${data.divisionName},${data.subdivision},${data.subtractionCount},${data.damageCount},${data.damagePercentage}`).join("\n");

    const encodedURI = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedURI);
    link.setAttribute("download", "report.csv");
    document.body.appendChild(link);
    link.click();
  };

  const downloadExcel = () => {
    const worksheetData = filteredData;
    const columnWidth = 100;
  
    const dataForExcel = [Object.keys(worksheetData[0])];
    for (const item of worksheetData) {
      dataForExcel.push(Object.values(item));
    }
  
    const ws = XLSX.utils.aoa_to_sheet(dataForExcel);
  
    const colWidth = columnWidth / 7;
    ws['!cols'] = Array(dataForExcel[0].length).fill({ wch: colWidth });
  
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report Data');
  
    const excelArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  
    const excelBlob = new Blob([excelArrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(excelBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'report.xlsx';
    a.click();
    URL.revokeObjectURL(url);
  };
  

  const handleSearch = () => {
    const query = searchQuery.trim().toLowerCase();
    if (query === '') {
      setFilteredData([]);
    } else {
      const searchValues = query.split(',').map((value) => value.trim());
      const filtered = tableData.filter((data) => {
        return searchValues.includes(data.divisionNumber.toString());
      });
      setFilteredData(filtered);
    }
  };
  

  const printTable = () => {
    window.print();
  };

  const generateReport = () => {
    
    const filtered = tableData.filter((data) => {
      const dataDate = new Date(data.date); 
      const from = new Date(fromDate);
      const to = new Date(toDate);
      return dataDate >= from && dataDate <= to;
    });

    
    setFilteredData(filtered);

    
    alert(`Generating report from ${fromDate} to ${toDate}`);
  };


  return (
  <>
    <div>
      <div style={{ marginTop:5 ,display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="date"
            className="date-input"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <input
            type="date"
            className="date-input"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
          <button className="report-button" onClick={generateReport}>
            Generate Report
          </button>
        </div>
        </div>
       <div className='btn-div'>

       <div>
          <button className="action-button" onClick={copyToClipboard}>Copy</button>
          <button className="action-button" onClick={downloadCSV}>CSV</button>
          <button className="action-button" onClick={downloadExcel}>Excel</button>
          <button className="action-button" onClick={printTable}>Print</button>
        </div>
      

      
      <div>
        <input
          type="text"
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by DIVISION NO."
        />
        <button className="search-button" onClick={handleSearch}>Search</button>
      </div>


   </div>
        
   
    </div>
    <div>
    <table className="report-table">
  <thead>
    <tr>
      <th>DIVISION NO.</th>
      <th>DIVISION NAME</th>
      <th>SUBDIVISION</th>
      <th >SUBSTATION COUNT</th>
      <th >DAMAGE COUNT</th>
      <th >DAMAGE PERCENTAGE</th>
    </tr>
  </thead>
  <tbody>
    {filteredData.map((data, index) => (
      <tr key={index}>
        <td >{data.divisionNumber}</td>
        <td>{data.divisionName}</td>
        <td>{data.subdivision}</td>
        <td >{data.subtractionCount}</td>
        <td >{data.damageCount}</td>
        <td >{data.damagePercentage}</td>
      </tr>
    ))}
  </tbody>
</table>





  </div>
  </>
  );
}

export default ReportGenerator;

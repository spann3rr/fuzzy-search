import React, { useState, useEffect, useMemo } from 'react';
import { FaSort } from 'react-icons/fa';
import { CurrencyUrl, StudentUrls } from '../../apis/Urls';
import useAxios from '../../hooks/useAxios';
import useCurrency from '../../hooks/useCurrency';
import useConversionStore from '../../stores/useConversionStore';
import useCurrencyStore from '../../stores/useCurrencyStore';

const CourseTable = ({ data, id }) => {
  const [sortOrder, setSortOrder] = useState('asc');
  const { currencyData, error, isLoading } = useCurrency(CurrencyUrl);
  let prevSemester = null;

  const { cur_symbol, currency, setCurrency, setCurrencySymbol } = useCurrencyStore();

  const { fetchData, conversionRate, errorMessage } = useConversionStore();

  useEffect(() => {
    if (errorMessage) {
      alert('Unsupported Code')
      setCurrency('USD')
      setCurrencySymbol('$')
    }
  }, [errorMessage]);

  const sortedData = useMemo(() => {
    const sortData = (data, sortOrder) => {
      const sortedData = {};
      const sortedSemesters = Object.keys(data).sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.localeCompare(b);
        } else {
          return b.localeCompare(a);
        }
      });
      sortedSemesters.forEach((semester) => {
        sortedData[semester] = data[semester].sort((a, b) => {
          if (sortOrder === 'asc') {
            return a.semester_code.localeCompare(b.semester_code);
          } else {
            return b.semester_code.localeCompare(a.semester_code);
          }
        });
      });
      return sortedData;
    };
    return sortData(data, sortOrder);
  }, [data, sortOrder]);

  const handleCurrencyChange = (event) => {
    const selectedValue = event.target.value;
    const selectedCurrencyObject = currencyData.find((item) => item.code === selectedValue);
    setCurrency(selectedCurrencyObject.code);
    fetchData(selectedCurrencyObject.code);
    setCurrencySymbol(selectedCurrencyObject.symbol_native)

  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (Object.keys(sortedData).length === 0) {
    return (
      <table>
        <thead>
          <tr>
            <th onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
              <span>Semester Code {<FaSort />}</span>
            </th>
            <th>Course Name</th>
            <th>Course Selection</th>
            <th>Course Fee</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="4">
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No data available</span>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  return (
    <>
      <div className='currency-container'>
        <select value={currency} onChange={handleCurrencyChange} style={{
            padding: '5px',
            border: '1px solid #ccc',
            borderRadius: '3px'
            }}>
          {currencyData.map(item => <option value={item.code}>{item.code}</option>)}
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th style={{ cursor: 'pointer' }} onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
              <span>Semester Code {<FaSort />}</span>
            </th>
            <th>Course Name</th>
            <th>Course Selection</th>
            <th>Course Fee</th>
          </tr>
        </thead>
        <tbody>
        {Object.keys(sortedData).map((sem) => {
            return (
              sortedData[sem].map((course) => {
                let semDisplay = sem;
                if (sem === prevSemester) {
                  semDisplay = '';
                } else {
                  prevSemester = sem;
                }
                return (
                  <tr key={course.id}>
                    <td>{semDisplay}</td>
                    <td>{course.course_name}</td>
                    <td>{course.course_selection}</td>
                    <td>{cur_symbol} {(course.course_fee * conversionRate).toFixed(2)}</td>
                  </tr>
                );
              })
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default CourseTable;

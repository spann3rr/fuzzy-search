import React, { useState } from 'react';
import useAxios from '../../hooks/useAxios';
import './Table.css';
import { StudentUrls } from '../../apis/Urls';
import Status from '../../enums/StatusEnum';

const Table = () => {
const [filterTerm, setFilterTerm] = useState('');
const [filteredData, setFilteredData] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(7);
const [sortKey, setSortKey] = useState('');
const [sortOrder, setSortOrder] = useState('asc');
const { data, loading, error } = useAxios(StudentUrls);

if (loading) {
  return <p>Loading...</p>;
}

if (error || !data) {
  return <p>Error</p>;
}

const getStatus = (statuses) => {
  const latestStatus = statuses.sort((a, b) => new Date(b.date) - new Date(a.date))[0]?.type;

  return latestStatus === Status.GOOD ? 'GOOD' :
        latestStatus === Status.PROBATION ? 'PROBATION' :
        latestStatus === Status.INACTIVE ? 'INACTIVE' : 'WITHDRAWN';
};

const setFilter = (term) => {
  const filteredData = data.mergedData.filter((item) => {
  const regex = new RegExp(term, 'i');

  return (
    regex.test(item.name) ||
    regex.test(item.phone) ||
    regex.test(item.email) ||
    regex.test(item.major)
    );
  });

  setFilterTerm(term);
  setFilteredData(filteredData);
  setCurrentPage(1);
};

const soundex = (word) => {
  const sdx = [0, 0, 0, 0];
  const m = new Map([
    ['b', 1],
    ['f', 1],
    ['p', 1],
    ['v', 1],
    ['c', 2],
    ['g', 2],
    ['j', 2],
    ['k', 2],
    ['q', 2],
    ['s', 2],
    ['x', 2],
    ['z', 2],
    ['d', 3],
    ['t', 3],
    ['l', 4],
    ['m', 5],
    ['n', 5],
    ['r', 6]
  ]);

  const chars = word.toLowerCase().split('');
  let i = 0;
  let j = 1;
  sdx[i] = chars[0];
  for (let k = 1; k < chars.length && i < 3; k++) {
    const code = m.get(chars[k]);
    if (code && code !== m.get(chars[k - 1])) {
      i++;
      sdx[i] = code;
    }
  }
  while (j < 4) {
    sdx[j] = 0;
    j++;
  }
  return sdx.join('');
};

const filterBySoundex = (arr, term) => {
  const soundexTerm = soundex(term);
    return arr.filter((item) => {
      return (
        soundex(item.name) === soundexTerm ||
        soundex(item.phone) === soundexTerm ||
        soundex(item.email) === soundexTerm ||
        soundex(item.major) === soundexTerm ||
        soundex(getStatus(item.status)) === soundexTerm
      );
    });
  };

const toggleSortOrder = () => {
  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
};

const sortByName = () => {
  setSortKey('name');
  toggleSortOrder();
};

const sortByMajor = () => {
  setSortKey('major');
  toggleSortOrder();
};

const sortByStatus = () => {
  setSortKey('status');
  toggleSortOrder();
};

let dataToRender = filteredData.length > 0 ? filteredData : data.mergedData;

if (filterTerm) {
  dataToRender = filterBySoundex(dataToRender, filterTerm);
}

dataToRender = dataToRender.sort((a, b) => {
  if (sortKey === 'name') {
    return sortOrder === 'asc'
    ? a.name.localeCompare(b.name)
    : b.name.localeCompare(a.name);
  }

  if (sortKey === 'major') {
    return sortOrder === 'asc'
    ? a.major.localeCompare(b.major)
    : b.major.localeCompare(a.major);
  }

  if (sortKey === 'status') {
    return sortOrder === 'asc'
    ? getStatus(a.status).localeCompare(getStatus(b.status))
    : getStatus(b.status).localeCompare(getStatus(a.status));
  }
  return 0;
});

// Define the page numbers array
const pageNumbers = [];
for (let i = 1; i <= Math.ceil(dataToRender.length / itemsPerPage); i++) {
  pageNumbers.push(i);
}

// Define the index of the last item on the current page
const indexOfLastItem = currentPage * itemsPerPage;

// Define the index of the first item on the current page
const indexOfFirstItem = indexOfLastItem - itemsPerPage;

// Define the current page items
const currentItems = dataToRender.slice(indexOfFirstItem, indexOfLastItem);

return (
  <div className="table-container">
    <div className="table-header">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name, email, phone, or major"
          value={filterTerm}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
    </div>
  <table>
    <thead>
      <tr>
        <th onClick={sortByName}>Name</th>
        <th onClick={sortByMajor}>Major</th>
        <th>Email</th>
        <th>Phone</th>
        <th onClick={sortByStatus}>Status</th>
        <th>Total Course</th>
      </tr>
    </thead>
    <tbody>
      {currentItems.map((item, index) => {
        const { name, email, phone, major, status, courseCount } = item;
        return (
          <tr key={index}>
          <td>{name}</td>
          <td>{major}</td>
          <td>{email}</td>
          <td>{phone}</td>
          <td>{getStatus(status)}</td>
          <td>{courseCount}</td>
          </tr>
        );
      })}
    </tbody>
  </table>
  <div className="pagination-container">
    <ul className="pagination">
      {pageNumbers.map((number) => (
      <li key={number}>
        <button
          onClick={() => setCurrentPage(number)}
          className={currentPage === number ? 'active' : ''}
          >
          {number}
        </button>
      </li>
      ))}
    </ul>
  </div>
  </div>
  );
};

export default Table;
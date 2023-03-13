import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAxios from '../../hooks/useAxios';
import { StudentUrls } from '../../apis/Urls';
import { getStatus, filterBySoundex } from '../../utils/studentsUtils';
import { FaSort } from 'react-icons/fa';

import './Table.css';
import Paginated from '../Paginated';

const Table = () => {
  const [filterTerm, setFilterTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const { studentsData, loading, error } = useAxios(StudentUrls);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error || !studentsData) {
    return <p>Error</p>;
  }

  const setFilter = (term) => {
    const filteredData = studentsData.mergedData.filter((item) => {
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

  let dataToRender = filteredData.length > 0 ? filteredData : studentsData.mergedData;

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

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataToRender.slice(indexOfFirstItem, indexOfLastItem);

  console.log(currentItems);

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
              <th>Image</th>
              <th style={{ cursor: 'pointer' }} onClick={sortByName}><span>Name {<FaSort />}</span></th>
              <th style={{ cursor: 'pointer' }} onClick={sortByMajor}><span>Major {<FaSort />}</span></th>
              <th>Email</th>
              <th>Phone</th>
              <th style={{ cursor: 'pointer' }} onClick={sortByStatus}><span>Status {<FaSort />}</span></th>
              <th>Total Course</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => {
              const { name, email, phone, major, status, courseCount, user_id, user_img, nickname } = item;
              return (
                <tr key={index}>
                  <td>
                    <img 
                      src={`/assets/${user_img ? user_img : 'default.jpg'}`}
                      alt="Profile Picture"
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                        borderRadius: "50%",
                        border: "5px solid #fff"
                      }}
                    />
                  </td>
                  <td><Link to={`/profile/${user_id}`}>{name} {nickname ? `(${nickname})` : ''}</Link></td>
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
        <Paginated currentPage={currentPage} data={dataToRender} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} />
      </div>
    );
};

export default Table;
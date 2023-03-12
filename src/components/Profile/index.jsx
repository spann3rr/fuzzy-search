import React, { useState, useEffect, useCallback } from 'react';
import { CoursesUrl, StudentUrls } from '../../apis/Urls';
import useProfile from '../../hooks/useProfile';
import { useParams } from 'react-router-dom';
import CourseTable from './CourseTable';
import useAxios from '../../hooks/useAxios';
import { getStatus } from '../../utils/studentsUtils';

const Profile = () => {
  const { id } = useParams();
  const { data, error, isLoading } = useProfile(CoursesUrl, id);
  const [currentStudent, setCurrentStudent] = useState({});
  const [groupedData, setGroupedData] = useState({});
  const { studentsData, loading } = useAxios(StudentUrls);

  useEffect(() => {
    if (studentsData && !loading) {
      let currentStudentRes = studentsData.mergedData.find((student) => student.user_id === id);
      setCurrentStudent(currentStudentRes);
    }
  }, [studentsData]);

  const groupDataBySemester = useCallback((courses) => {
    const coursesBySemester = courses.reduce((acc, course) => {
      const key = `${course.semester_code}_${course.course_selection}`;
      if (acc[key]) {
        return acc;
      } else if (acc[course.semester_code]) {
        const existingCourseSelections = acc[course.semester_code].map(c => c.course_selection);
        if (existingCourseSelections.includes(course.course_selection)) {
          return acc;
        } else {
          acc[course.semester_code].push(course);
        }
      } else {
        acc[course.semester_code] = [course];
      }
      return acc;
    }, {});
    return coursesBySemester;
  }, []);

  useEffect(() => {
    if (data) {
      const newData = groupDataBySemester(data);
      setGroupedData(newData);
    }
  }, [data, groupDataBySemester]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error</p>;
  }

  return (
    <div className="profile-container">
      <div className="profile-picture">
        <img 
          src={`/src/assets/${currentStudent?.user_img ? currentStudent?.user_img : 'default.jpg'}`}
          alt="Profile Picture"
          style={{
            width: "150px",
            height: "150px",
            objectFit: "cover",
            borderRadius: "50%",
            border: "5px solid #fff"
          }}
        />
        <div className="details">
          <p>Name: {currentStudent?.name}</p>
          <p>Major: {currentStudent?.major}</p>
          <p>Year: {currentStudent?.year}</p>
          <p>Status: {getStatus(currentStudent?.status)}</p>
        </div>
      </div>
      <div className="details-table">
        <CourseTable data={groupedData} id={id} />
      </div>
    </div>
  );
}

export default Profile;

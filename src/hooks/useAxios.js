import { useState, useEffect } from 'react';
import axios from 'axios';

const useAxios = (urls, method = 'GET', body = null) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mergeDataWithCourseCount = (students, profiles, courses) => {
    const courseCountByUserId = countCoursesByUserId(courses);
    return Object.values(students)
      .map((item) => {
        const matchingItem = profiles.find((profile) => {
          const profileId = profile.user_id.split('_')[1];
          return parseInt(profileId) === item.id;
        });
        if (matchingItem) {
          const userId = `user_${item.id}`;
          const courseCount = courseCountByUserId[userId] || 0;
          return { ...item, ...matchingItem, courseCount };
        }
        return null;
      })
      .filter((item) => item !== null);
  };

  const countCoursesByUserId = (courses) => {
    const courseCount = {};
    courses.forEach(course => {
      const { user_id, course_name, course_selection } = course;
      const key = `${user_id}-${course_name}-${course_selection}`;
      if (!courseCount[user_id]) {
        courseCount[user_id] = new Set();
      }
      courseCount[user_id].add(key);
    });
    const uniqueCount = {};
    for (const user_id in courseCount) {
      uniqueCount[user_id] = courseCount[user_id].size;
    }
    return uniqueCount;
  };  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requests = urls.map((url) => axios({ method, url, data: body }));
        const responses = await Promise.all(requests);
        const [students, courses, profiles] = responses.map((response) => response.data);

        const mergedData = mergeDataWithCourseCount(students, profiles, courses);

        setData({ mergedData: mergedData });
      } catch (error) {
        setError(error);
      }
      setLoading(false);
    };
    fetchData();
  }, [urls, method, body]);

  return { data, loading, error };
};

export default useAxios;

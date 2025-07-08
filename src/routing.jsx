import React, { useState, useEffect } from 'react';
import { useUser } from './context/UserContext';
import TablePage from './pages/dashboard pages/TablePages';
import CardView from './pages/dashboard pages/CardView';
import AuthService from './services/auth.service';
import { 
  classColumns, 
  studentColumns, 
  teacherColumns, 
  parentColumns, 
  subjectsColumns, 
  logsColumns, 
  defaultData 
} from './utils/utils';

// Role-based Classes Route
export function ClassesRoute() {
  const { user } = useUser();
  const userRole = user?.role?.toLowerCase();
  const [classesData, setClassesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const response = await AuthService.getClasses();
        console.log('📚 [ClassesRoute] API Response:', response);
        
        if (response.success) {
          setClassesData(response.classes || []);
        } else {
          setError('Failed to fetch classes data');
        }
      } catch (err) {
        console.error('❌ [ClassesRoute] Error fetching classes:', err);
        setError(err.message || 'Failed to fetch classes');
      } finally {
        setLoading(false);
      }
    };

    if (userRole === 'admin') {
      // Admin sees table view, no need to fetch data here
      setLoading(false);
    } else {
      fetchClasses();
    }
  }, [userRole]);

  if (userRole === 'admin') {
    return <TablePage title="Classes" columns={classColumns} data={defaultData} />;
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading classes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return <CardView title="Classes" data={classesData} />;
}

// Role-based Students Route
export function StudentsRoute() {
  const { user } = useUser();
  const userRole = user?.role?.toLowerCase();
  const [studentsData, setStudentsData] = useState([]);
  const [yourStudentsData, setYourStudentsData] = useState([]);
  const [otherStudentsData, setOtherStudentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [yourStudentsLoading, setYourStudentsLoading] = useState(false);
  const [otherStudentsLoading, setOtherStudentsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('your-students'); // Default to "Your Students" for teachers

  // Function to fetch your students (for teachers)
  const fetchYourStudents = async () => {
    try {
      setYourStudentsLoading(true);
      const teacherEmail = user?.email;
      console.log('👨‍🏫 [StudentsRoute] Fetching your students for teacher:', teacherEmail);
      // Send status=true for your students
      const response = await AuthService.getUser(true, 50, 1, 'Student');
      console.log('👨‍🎓 [StudentsRoute] Your Students API Response:', response);
      if (response.success) {
        setYourStudentsData(response.users || response.data || []);
      } else {
        setError('Failed to fetch your students data');
      }
    } catch (err) {
      console.error('❌ [StudentsRoute] Error fetching your students:', err);
      setError(err.message || 'Failed to fetch your students');
    } finally {
      setYourStudentsLoading(false);
    }
  };

  // Function to fetch other students (for teachers)
  const fetchOtherStudents = async () => {
    try {
      setOtherStudentsLoading(true);
      const teacherEmail = user?.email;
      console.log('👨‍🏫 [StudentsRoute] Fetching other students for teacher:', teacherEmail);
      // Send status=false for other students
      const response = await AuthService.getUser(false, 50, 1, 'Student');
      console.log('👨‍🎓 [StudentsRoute] Other Students API Response:', response);
      if (response.success) {
        setOtherStudentsData(response.users || response.data || []);
      } else {
        setError('Failed to fetch other students data');
      }
    } catch (err) {
      console.error('❌ [StudentsRoute] Error fetching other students:', err);
      setError(err.message || 'Failed to fetch other students');
    } finally {
      setOtherStudentsLoading(false);
    }
  };

  // Handle tab change and fetch data if needed
  const handleTabChange = async (tab) => {
    setActiveTab(tab);
    
    if (userRole === 'teacher') {
      if (tab === 'your-students' && yourStudentsData.length === 0 && !yourStudentsLoading) {
        await fetchYourStudents();
      } else if (tab === 'other-students' && otherStudentsData.length === 0 && !otherStudentsLoading) {
        await fetchOtherStudents();
      }
    }
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        if (userRole === 'teacher') {
          // For teachers, fetch the default tab's data immediately
          if (activeTab === 'your-students') {
            await fetchYourStudents();
          } else if (activeTab === 'other-students') {
            await fetchOtherStudents();
          }
        } else {
          // For other roles, fetch all students normally
          const response = await AuthService.getUser('all', 50, 1, 'Student');
          console.log('📚 [StudentsRoute] API Response:', response);
          
          if (response.success) {
            setStudentsData(response.data || []);
          } else {
            setError('Failed to fetch students data');
          }
        }
      } catch (err) {
        console.error('❌ [StudentsRoute] Error fetching students:', err);
        setError(err.message || 'Failed to fetch students');
      } finally {
        setLoading(false);
      }
    };

    if (userRole === 'admin') {
      // Admin sees table view, no need to fetch data here
      setLoading(false);
    } else {
      fetchStudents();
    }
  }, [userRole, user?.email, activeTab]);

  if (userRole === 'admin') {
    return <TablePage title="Students" columns={studentColumns} data={defaultData} />;
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading students...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  // For teachers, show custom CardView with your students and other students
  if (userRole === 'teacher') {
    // Pass both datasets to CardView and let it handle the tab logic
    const allStudentsData = {
      yourStudents: yourStudentsData,
      otherStudents: otherStudentsData
    };

    return <CardView 
      title="Students" 
      data={allStudentsData} 
      userRole="teacher"
      activeTab={activeTab}
      onTabChange={handleTabChange}
    />;
  }

  return <CardView title="Students" data={studentsData} />;
}

// Role-based Teachers Route
export function TeachersRoute() {
  const { user } = useUser();
  const userRole = user?.role?.toLowerCase();
  const [teachersData, setTeachersData] = useState([]);
  const [yourTeachersData, setYourTeachersData] = useState([]);
  const [otherTeachersData, setOtherTeachersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [yourTeachersLoading, setYourTeachersLoading] = useState(false);
  const [otherTeachersLoading, setOtherTeachersLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('your-teachers'); // Default to "Your Teachers"

  // Function to fetch your teachers
  const fetchYourTeachers = async () => {
    try {
      setYourTeachersLoading(true);
      const studentEmail = user?.email;
      console.log('👨‍🎓 [TeachersRoute] Fetching your teachers for student:', studentEmail);
      // Send status=true for your teachers
      const response = await AuthService.getUser(true, 50, 1, 'Teacher');
      console.log('👨‍🏫 [TeachersRoute] Your Teachers API Response:', response);
      if (response.success) {
        setYourTeachersData(response.users || response.data || []);
      } else {
        setError('Failed to fetch your teachers data');
      }
    } catch (err) {
      console.error('❌ [TeachersRoute] Error fetching your teachers:', err);
      setError(err.message || 'Failed to fetch your teachers');
    } finally {
      setYourTeachersLoading(false);
    }
  };

  // Function to fetch other teachers
  const fetchOtherTeachers = async () => {
    try {
      setOtherTeachersLoading(true);
      const studentEmail = user?.email;
      console.log('👨‍🎓 [TeachersRoute] Fetching other teachers for student:', studentEmail);
      // Send status=false for other teachers
      const response = await AuthService.getUser(false, 50, 1, 'Teacher');
      console.log('👨‍🏫 [TeachersRoute] Other Teachers API Response:', response);
      if (response.success) {
        setOtherTeachersData(response.users || response.data || []);
      } else {
        setError('Failed to fetch other teachers data');
      }
    } catch (err) {
      console.error('❌ [TeachersRoute] Error fetching other teachers:', err);
      setError(err.message || 'Failed to fetch other teachers');
    } finally {
      setOtherTeachersLoading(false);
    }
  };

  // Handle tab change and fetch data if needed
  const handleTabChange = async (tab) => {
    setActiveTab(tab);
    
    if (userRole === 'student') {
      if (tab === 'your-teachers' && yourTeachersData.length === 0 && !yourTeachersLoading) {
        await fetchYourTeachers();
      } else if (tab === 'other-teachers' && otherTeachersData.length === 0 && !otherTeachersLoading) {
        await fetchOtherTeachers();
      }
    }
  };

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        if (userRole === 'student') {
          // For students, fetch the default tab's data immediately
          if (activeTab === 'your-teachers') {
            await fetchYourTeachers();
          } else if (activeTab === 'other-teachers') {
            await fetchOtherTeachers();
          }
        } else {
          // For other roles, fetch all teachers normally
          const response = await AuthService.getUser('all', 50, 1, 'Teacher');
          console.log('👨‍🏫 [TeachersRoute] API Response:', response);
          if (response.success) {
            const teachers = response.users || response.data || [];
            setTeachersData(teachers);
          } else {
            setError('Failed to fetch teachers data');
          }
        }
      } catch (err) {
        console.error('❌ [TeachersRoute] Error fetching teachers:', err);
        setError(err.message || 'Failed to fetch teachers');
      } finally {
        setLoading(false);
      }
    };
    if (userRole === 'admin') {
      setLoading(false);
    } else {
      fetchTeachers();
    }
  // eslint-disable-next-line
  }, [userRole, user?.email, activeTab]);

  if (userRole === 'admin') {
    return <TablePage title="Teachers" columns={teacherColumns} data={defaultData} />;
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading teachers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  // For students, show custom CardView with your teachers and other teachers
  if (userRole === 'student') {
    // Pass both datasets to CardView and let it handle the tab logic
    const allTeachersData = {
      yourTeachers: yourTeachersData,
      otherTeachers: otherTeachersData
    };

    return <CardView 
      title="Teachers" 
      data={allTeachersData} 
      userRole="student"
      activeTab={activeTab}
      onTabChange={handleTabChange}
    />;
  }

  // For other roles (teacher, parent), show normal card view
  return <CardView title="Teachers" data={teachersData} />;
}

// Role-based Parents Route
export function ParentsRoute() {
  const { user } = useUser();
  const userRole = user?.role?.toLowerCase();

  if (userRole === 'admin') {
    return <TablePage title="Parents" columns={parentColumns} data={defaultData} />;
  }

  return <CardView title="Parents" />;
}

// Role-based Subjects Route
export function SubjectsRoute() {
  const { user } = useUser();
  const userRole = user?.role?.toLowerCase();

  if (userRole === 'admin') {
    return <TablePage title="Subjects" columns={subjectsColumns} data={defaultData} />;
  }

  return <CardView title="Subjects" />;
}

// Role-based Assignments Route
export function AssignmentsRoute() {
  const { user } = useUser();
  const userRole = user?.role?.toLowerCase();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        let response;
        
        if (userRole === 'teacher' || userRole === 'admin') {
          response = await AuthService.getTeacherAssignments();
        } else if (userRole === 'student') {
          response = await AuthService.getStudentAssignments(user?.email);
        } else {
          // For other roles, show empty state
          setAssignments([]);
          setLoading(false);
          return;
        }
        
        if (response.success) {
          
          setAssignments(response.assignments || response.data || []);
        } else {
          setError(response.message || 'Failed to fetch assignments');
        }
      } catch (err) {
        console.error('Error fetching assignments:', err);
        setError(err.message || 'Failed to fetch assignments');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [userRole, user?.email]);

  if (userRole === 'admin') {
    return <TablePage title="Assignments" columns={logsColumns} data={defaultData} />;
  }

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Loading assignments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }
  console.log('👨‍🎓 [AssignmentsRoute] Assignments API Response:moved', assignments);
  return <CardView title="Assignments" data={assignments} />;
}

// Role-based Quizzes Route
export function QuizzesRoute() {
  const { user } = useUser();
  const userRole = user?.role?.toLowerCase();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        let response;
        
        if (userRole === 'teacher' || userRole === 'admin') {
          response = await AuthService.getTeacherQuizzes();
        } else if (userRole === 'student') {
          response = await AuthService.getStudentQuizzes(user?.email);
        } else {
          // For other roles, show empty state
          setQuizzes([]);
          setLoading(false);
          return;
        }
        
        if (response.success) {
          setQuizzes(response.quizzes || response.data || []);
        } else {
          setError(response.message || 'Failed to fetch quizzes');
        }
      } catch (err) {
        console.error('Error fetching quizzes:', err);
        setError(err.message || 'Failed to fetch quizzes');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [userRole, user?.email]);

  if (userRole === 'admin') {
    return <TablePage title="Quizzes" columns={logsColumns} data={defaultData} />;
  }

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Loading quizzes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return <CardView title="Quizzes" data={quizzes} />;
}

// Role-based System Logs Route
export function SystemLogsRoute() {
  const { user } = useUser();
  const userRole = user?.role?.toLowerCase();

  if (userRole === 'admin') {
    return <TablePage title="System Logs" columns={logsColumns} data={defaultData} />;
  }

  return <CardView title="System Logs" />;
}

// Role-based Earnings Route
export function EarningsRoute() {
  const { user } = useUser();
  const userRole = user?.role?.toLowerCase();

  if (userRole === 'admin') {
    return <TablePage title="Earnings" columns={logsColumns} data={defaultData} />;
  }

  return <CardView title="Earnings" />;
}

// Role-based Support Tickets Route
export function SupportTicketsRoute() {
  const { user } = useUser();
  const userRole = user?.role?.toLowerCase();

  if (userRole === 'admin') {
    return <TablePage title="Support Tickets" columns={logsColumns} data={defaultData} />;
  }

  return <CardView title="Support Tickets" />;
} 
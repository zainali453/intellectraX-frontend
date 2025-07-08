import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, BookOpen, FileText, Upload } from 'lucide-react';
import AuthService from '../services/auth.service';
import { useUser } from '../context/UserContext';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// For demo: static list of students
// const studentOptions = [
//   { email: 'student1@gmail.com', name: 'John Doe' },
//   { email: 'student2@gmail.com', name: 'Jane Smith' },
//   { email: 'student3@gmail.com', name: 'Alice Johnson' },
// ];

export default function EditDialog({ open, onClose, mode = "create-class" }) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  console.log('🎯 [EditDialog] Mode received:', mode, 'Open:', open);
  
  // Class creation state
  const [subject, setSubject] = useState('');
  const [timeslot, setTimeslot] = useState({ day: '', startTime: '', endTime: '' });
  const [selectedStudent, setSelectedStudent] = useState('');
  const [description, setDescription] = useState('');
  const [perSessionPrice, setPerSessionPrice] = useState('');
  const [students, setStudents] = useState([]);

  // Assignment creation state
  const [assignmentHeading, setAssignmentHeading] = useState('');
  const [assignmentDescription, setAssignmentDescription] = useState('');
  const [assignmentStudentEmail, setAssignmentStudentEmail] = useState('');
  const [assignmentStartDate, setAssignmentStartDate] = useState('');
  const [assignmentDueDate, setAssignmentDueDate] = useState('');
  const [assignmentFile, setAssignmentFile] = useState(null);
  const [assignmentFileUrl, setAssignmentFileUrl] = useState('');

  // Quiz creation state
  const [quizHeading, setQuizHeading] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [quizStudentEmail, setQuizStudentEmail] = useState('');
  const [quizStartDate, setQuizStartDate] = useState('');
  const [quizDueDate, setQuizDueDate] = useState('');
  const [quizDuration, setQuizDuration] = useState('');
  const [quizManualPdf, setQuizManualPdf] = useState('');
  const [quizFile, setQuizFile] = useState(null);
  const [quizFileUrl, setQuizFileUrl] = useState('');

  useEffect(() => {
    if (open && (mode === 'create-class' || mode === 'create-assignment' || mode === 'create-quiz')) {
      fetchStudents();
    }
  }, [open, mode]);

  const fetchStudents = async () => {
    try {
      const response = await AuthService.getUser(true, 50, 1, 'Student');
      if (response.success) {
        setStudents(response.users || response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };

  // File upload function
  const uploadFile = async (file, type) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      
      const token = user?.token;
      if (!token) throw new Error('No authentication token found. Please log in again.');
      
      const response = await fetch('http://localhost:3000/api/user/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const data = await response.json();
      if (data.success) {
        return { success: true, fileUrl: data.fileUrl, fileKey: data.fileKey };
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const handleFileChange = (e, setFile, setFileUrl) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      // Create a temporary URL for preview
      const tempUrl = URL.createObjectURL(file);
      setFileUrl(tempUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    // Role check: only allow teacher or admin
    const role = user?.role?.toLowerCase();
    if (role !== 'teacher' && role !== 'admin') {
      setError('Only teachers or admins can create content.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'create-class') {
        if (!subject) return setError('Subject is required');
        if (!timeslot.day || !timeslot.startTime || !timeslot.endTime) {
          return setError('All timeslot fields are required');
        }
        if (!selectedStudent) {
          return setError('Please select a student');
        }
        if (!perSessionPrice || isNaN(perSessionPrice) || perSessionPrice <= 0) {
          return setError('Please enter a valid session price');
        }
        
        await AuthService.createClass({
          subject,
          timeslot,
          studentEmail: selectedStudent,
          description,
          perSessionPrice: Number(perSessionPrice)
        });
      } else if (mode === 'create-assignment') {
        if (!assignmentHeading) return setError('Assignment heading is required');
        if (!assignmentDescription) return setError('Assignment description is required');
        if (!assignmentStudentEmail) return setError('Please select a student');
        if (!assignmentStartDate) return setError('Start date is required');
        if (!assignmentDueDate) return setError('Due date is required');
        
        // Validate that start date is before due date
        if (new Date(assignmentStartDate) >= new Date(assignmentDueDate)) {
          return setError('Start date must be before due date');
        }
        
        let fileUrl = assignmentFileUrl;
        
        // Upload file if selected
        if (assignmentFile) {
          console.log('📤 [EditDialog] Uploading assignment file...');
          const uploadResult = await uploadFile(assignmentFile, 'assignment');
          fileUrl = uploadResult.fileUrl;
        }
        
        await AuthService.createAssignment({
          heading: assignmentHeading,
          description: assignmentDescription,
          studentEmail: assignmentStudentEmail,
          startDate: assignmentStartDate,
          dueDate: assignmentDueDate,
          fileUrl: fileUrl
        });
      } else if (mode === 'create-quiz') {
        if (!quizHeading) return setError('Quiz heading is required');
        if (!quizDescription) return setError('Quiz description is required');
        if (!quizStudentEmail) return setError('Please select a student');
        if (!quizStartDate) return setError('Start date is required');
        if (!quizDueDate) return setError('Due date is required');
        if (!quizDuration || isNaN(quizDuration) || quizDuration <= 0) {
          return setError('Please enter a valid duration');
        }
        
        // Validate that start date is before due date
        if (new Date(quizStartDate) >= new Date(quizDueDate)) {
          return setError('Start date must be before due date');
        }
        
        let fileUrl = quizFileUrl || quizManualPdf;
        
        // Upload file if selected
        if (quizFile) {
          console.log('📤 [EditDialog] Uploading quiz file...');
          const uploadResult = await uploadFile(quizFile, 'quiz');
          fileUrl = uploadResult.fileUrl;
        }
        
        await AuthService.createQuiz({
          heading: quizHeading,
          description: quizDescription,
          studentEmail: quizStudentEmail,
          startDate: quizStartDate,
          dueDate: quizDueDate,
          duration: Number(quizDuration),
          manualPdf: fileUrl
        });
      }
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        // Reset form
        if (mode === 'create-class') {
          setSubject('');
          setTimeslot({ day: '', startTime: '', endTime: '' });
          setSelectedStudent('');
          setDescription('');
          setPerSessionPrice('');
        } else if (mode === 'create-assignment') {
          setAssignmentHeading('');
          setAssignmentDescription('');
          setAssignmentStudentEmail('');
          setAssignmentStartDate('');
          setAssignmentDueDate('');
          setAssignmentFile(null);
          setAssignmentFileUrl('');
        } else if (mode === 'create-quiz') {
          setQuizHeading('');
          setQuizDescription('');
          setQuizStudentEmail('');
          setQuizStartDate('');
          setQuizDueDate('');
          setQuizDuration('');
          setQuizManualPdf('');
          setQuizFile(null);
          setQuizFileUrl('');
        }
      }, 1200);
    } catch (err) {
      setError(err.message || `Failed to create ${mode.replace('create-', '')}`);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'create-class':
        return 'Create Class';
      case 'create-assignment':
        return 'Create Assignment';
      case 'create-quiz':
        return 'Create Quiz';
      default:
        return 'Create';
    }
  };

  const renderClassForm = () => (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Enter subject"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Timeslot</label>
        <div className="grid grid-cols-3 gap-2">
          <select
            value={timeslot.day}
            onChange={(e) => setTimeslot(prev => ({ ...prev, day: e.target.value }))}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Day</option>
            {daysOfWeek.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
          <input
            type="time"
            value={timeslot.startTime}
            onChange={(e) => setTimeslot(prev => ({ ...prev, startTime: e.target.value }))}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <input
            type="time"
            value={timeslot.endTime}
            onChange={(e) => setTimeslot(prev => ({ ...prev, endTime: e.target.value }))}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="">Select a student</option>
          {students.map((student) => (
            <option key={student.email} value={student.email}>
              {student.name || student.email}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Enter class description"
          rows="3"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Price per Session ($)</label>
        <input
          type="number"
          value={perSessionPrice}
          onChange={(e) => setPerSessionPrice(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Enter price"
          min="0"
          step="0.01"
        />
      </div>
    </>
  );

  const renderAssignmentForm = () => (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Assignment Heading</label>
        <input
          type="text"
          value={assignmentHeading}
          onChange={(e) => setAssignmentHeading(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Enter assignment heading"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={assignmentDescription}
          onChange={(e) => setAssignmentDescription(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Enter assignment description"
          rows="3"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
        <select
          value={assignmentStudentEmail}
          onChange={(e) => setAssignmentStudentEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="">Select a student</option>
          {students.map((student) => (
            <option key={student.email} value={student.email}>
              {student.name || student.email}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
        <input
          type="datetime-local"
          value={assignmentStartDate}
          onChange={(e) => setAssignmentStartDate(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
        <input
          type="datetime-local"
          value={assignmentDueDate}
          onChange={(e) => setAssignmentDueDate(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Assignment File (optional)</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-teal-500 transition-colors">
          <input
            type="file"
            onChange={(e) => handleFileChange(e, setAssignmentFile, setAssignmentFileUrl)}
            className="hidden"
            id="assignment-file"
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
          />
          <label htmlFor="assignment-file" className="cursor-pointer">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              {assignmentFile ? assignmentFile.name : 'Click to upload file'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PDF, DOC, DOCX, TXT, JPG, PNG (Max 10MB)
            </p>
          </label>
        </div>
        {assignmentFile && (
          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
            <p className="text-sm text-green-700">✓ File selected: {assignmentFile.name}</p>
          </div>
        )}
      </div>
    </>
  );

  const renderQuizForm = () => (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Heading</label>
        <input
          type="text"
          value={quizHeading}
          onChange={(e) => setQuizHeading(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Enter quiz heading"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={quizDescription}
          onChange={(e) => setQuizDescription(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Enter quiz description"
          rows="3"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
        <select
          value={quizStudentEmail}
          onChange={(e) => setQuizStudentEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="">Select a student</option>
          {students.map((student) => (
            <option key={student.email} value={student.email}>
              {student.name || student.email}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
        <input
          type="datetime-local"
          value={quizStartDate}
          onChange={(e) => setQuizStartDate(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
        <input
          type="datetime-local"
          value={quizDueDate}
          onChange={(e) => setQuizDueDate(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
        <input
          type="number"
          value={quizDuration}
          onChange={(e) => setQuizDuration(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Enter duration in minutes"
          min="1"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Quiz File (optional)</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-teal-500 transition-colors">
          <input
            type="file"
            onChange={(e) => handleFileChange(e, setQuizFile, setQuizFileUrl)}
            className="hidden"
            id="quiz-file"
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
          />
          <label htmlFor="quiz-file" className="cursor-pointer">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              {quizFile ? quizFile.name : 'Click to upload file'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PDF, DOC, DOCX, TXT, JPG, PNG (Max 10MB)
            </p>
          </label>
        </div>
        {quizFile && (
          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
            <p className="text-sm text-green-700">✓ File selected: {quizFile.name}</p>
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Manual PDF URL (optional)</label>
        <input
          type="url"
          value={quizManualPdf}
          onChange={(e) => setQuizManualPdf(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Enter PDF URL (alternative to file upload)"
        />
        <p className="text-xs text-gray-500 mt-1">
          You can either upload a file above or provide a URL here
        </p>
      </div>
    </>
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{getTitle()}</h2>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'create-class' && renderClassForm()}
          {mode === 'create-assignment' && renderAssignmentForm()}
          {mode === 'create-quiz' && renderQuizForm()}

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {mode.replace('create-', '').charAt(0).toUpperCase() + mode.replace('create-', '').slice(1)} created successfully!
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create'}
          </button>
        </form>
      </div>
    </div>
  );
}
import React, { useState, useEffect, use } from "react";
import { X, Calendar, Plus } from "lucide-react";
import CustomDropdown from "./CustomDropdown";
import TimeSelector from "./TimeSelector";
import DatePicker from "./DatePicker";
import LoadingSpinner from "./LoadingSpinner";
import {
  ClassData,
  StudentForClass,
  teacherService,
  TimeSlot,
} from "@/services/teacher.service";
import SkeletonDropdown from "./SkeletonDropdown";

interface EditClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (classData: ClassData) => void;
  initialData?: ClassData;
  mode: "create" | "edit";
  loading: boolean;
}

const formatDisplayTime = (value: string, format24: boolean = false) => {
  if (!value) return "";
  const [hour, minute] = value.split(":").map(Number);

  if (format24) {
    return `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  } else {
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const period = hour >= 12 ? "PM" : "AM";
    return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
  }
};

const EditClassModal: React.FC<EditClassModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode = "create",
  loading,
}) => {
  const [formData, setFormData] = useState<ClassData>({
    subject: "",
    student: "",
    days: [
      {
        date: null,
        timeSlots: [{ startTime: "", endTime: "" }],
        recursive: true,
      },
    ],
    description: "",
  });

  const [students, setStudents] = useState<StudentForClass[]>([]);
  const [commonSubjects, setCommonSubjects] = useState<string[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoadingStudents(true);
        // Replace with your actual API call
        const response = await teacherService.getStudentsForClass();
        if (response && response.data) {
          setStudents(response.data);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchCommonSubjects = async () => {
      if (!formData.student) {
        setCommonSubjects([]);
        return;
      }
      try {
        setLoadingSubjects(true);
        const response = await teacherService.getStudentCommonSubjects(
          formData.student
        );
        if (response && response.data) {
          setCommonSubjects(response.data);
        } else {
          setCommonSubjects([]);
        }
      } catch (error) {
        console.error("Error fetching common subjects:", error);
        setCommonSubjects([]);
      } finally {
        setLoadingSubjects(false);
      }
    };
    fetchCommonSubjects();
  }, [formData.student]);

  // Initialize form data when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData({
          subject: "",
          student: "",
          days: [
            {
              date: null,
              timeSlots: [{ startTime: "", endTime: "" }],
              recursive: true,
            },
          ],
          description: "",
        });
      }
    }
  }, [isOpen, initialData]);

  const handleInputChange = (field: keyof ClassData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDayChange = (dayIndex: number, date: Date | null) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.map((day, i) =>
        i === dayIndex ? { ...day, date } : day
      ),
    }));
  };

  const handleRecursiveChange = (dayIndex: number, recursive: boolean) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.map((day, i) =>
        i === dayIndex ? { ...day, recursive } : day
      ),
    }));
  };

  const handleTimeSlotChange = (
    dayIndex: number,
    slotIndex: number,
    field: keyof TimeSlot,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.map((day, i) =>
        i === dayIndex
          ? {
              ...day,
              timeSlots: day.timeSlots.map((slot, j) =>
                j === slotIndex ? { ...slot, [field]: value } : slot
              ),
            }
          : day
      ),
    }));
  };

  // Check for time conflicts across all days (global conflicts)
  const hasTimeConflict = (dayIndex: number, slotIndex: number) => {
    const currentDay = formData.days[dayIndex];
    if (!currentDay.date) return false;

    const currentSlot = currentDay.timeSlots[slotIndex];
    if (!currentSlot.startTime || !currentSlot.endTime) return false;

    const currentStart = timeToMinutes(currentSlot.startTime);
    const currentEnd = timeToMinutes(currentSlot.endTime);

    // Check if end time is before start time
    if (currentEnd <= currentStart) return true;

    // Check against ALL slots in ALL days, not just the current day
    for (let i = 0; i < formData.days.length; i++) {
      const otherDay = formData.days[i];
      if (typeof otherDay.date === "string")
        otherDay.date = new Date(otherDay.date);
      if (!otherDay.date) continue;

      // Only check conflicts with the same date
      if (otherDay.date?.toDateString() === currentDay.date?.toDateString()) {
        for (let j = 0; j < otherDay.timeSlots.length; j++) {
          // Skip the current slot we're checking
          if (i === dayIndex && j === slotIndex) continue;

          const otherSlot = otherDay.timeSlots[j];
          if (!otherSlot.startTime || !otherSlot.endTime) continue;

          const otherStart = timeToMinutes(otherSlot.startTime);
          const otherEnd = timeToMinutes(otherSlot.endTime);

          // Check for overlap
          if (currentStart < otherEnd && currentEnd > otherStart) {
            return true;
          }
        }
      }
    }

    return false;
  };

  // Check for all time slot issues (conflicts + duration)
  const hasTimeSlotIssue = (dayIndex: number, slotIndex: number) => {
    return (
      hasTimeConflict(dayIndex, slotIndex) ||
      hasExcessiveDuration(dayIndex, slotIndex)
    );
  };

  // Get list of already selected dates to exclude from DatePicker
  const getExcludedDates = (currentDayIndex: number) => {
    const excludedDates: Date[] = [];

    formData.days.forEach((day, index) => {
      // Don't exclude the current day being edited
      if (index !== currentDayIndex && day.date) {
        excludedDates.push(day.date);
      }
    });

    return excludedDates;
  };

  const timeToMinutes = (timeStr: string) => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // Check if time slot duration exceeds 1 hour (60 minutes)
  const hasExcessiveDuration = (dayIndex: number, slotIndex: number) => {
    const currentDay = formData.days[dayIndex];
    if (!currentDay.date) return false;

    const currentSlot = currentDay.timeSlots[slotIndex];
    if (!currentSlot.startTime || !currentSlot.endTime) return false;

    const startMinutes = timeToMinutes(currentSlot.startTime);
    const endMinutes = timeToMinutes(currentSlot.endTime);

    // Check if end time is before or equal to start time
    if (endMinutes <= startMinutes) return false;

    // Calculate duration in minutes
    const durationMinutes = endMinutes - startMinutes;

    // Check if duration exceeds 60 minutes (1 hour)
    return durationMinutes > 60;
  };

  const addTimeSlot = (dayIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.map((day, i) =>
        i === dayIndex
          ? {
              ...day,
              timeSlots: [...day.timeSlots, { startTime: "", endTime: "" }],
            }
          : day
      ),
    }));
  };

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.map((day, i) =>
        i === dayIndex
          ? {
              ...day,
              timeSlots: day.timeSlots.filter((_, j) => j !== slotIndex),
            }
          : day
      ),
    }));
  };

  const addDay = () => {
    setFormData((prev) => ({
      ...prev,
      days: [
        ...prev.days,
        {
          date: null,
          timeSlots: [{ startTime: "", endTime: "" }],
          recursive: true,
        },
      ],
    }));
  };

  const removeDay = (dayIndex: number) => {
    if (formData.days.length > 1) {
      setFormData((prev) => ({
        ...prev,
        days: prev.days.filter((_, i) => i !== dayIndex),
      }));
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking on the backdrop itself, not on modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSave = () => {
    // Check for conflicts before saving
    let hasConflicts = false;
    let totalClasses = 0;

    let hasDurationIssues = false;

    formData.days.forEach((day, dayIndex) => {
      if (day.date) {
        day.timeSlots.forEach((slot, slotIndex) => {
          if (slot.startTime && slot.endTime) {
            totalClasses++;
            if (hasTimeConflict(dayIndex, slotIndex)) {
              hasConflicts = true;
            }
            if (hasExcessiveDuration(dayIndex, slotIndex)) {
              hasDurationIssues = true;
            }
          }
        });
      }
    });

    if (hasConflicts) {
      alert("Please resolve all time conflicts before saving.");
      return;
    }

    if (hasDurationIssues) {
      alert(
        "Please fix time slots with duration exceeding 1 hour before saving."
      );
      return;
    }

    if (totalClasses === 0) {
      alert("Please add at least one complete time slot.");
      return;
    }

    if (!formData.student) {
      alert("Please select a student before saving.");
      return;
    }
    if (!formData.subject) {
      alert("Please select a subject before saving.");
      return;
    }

    onSave(formData);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";

    if (typeof date === "string") date = new Date(date);
    return date?.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div
        className='fixed inset-0 bg-[#0000002e] transition-opacity'
        onClick={handleBackdropClick}
      />

      <div className='relative w-full max-w-2xl max-h-[83vh] overflow-y-auto bg-white rounded-lg shadow-xl'>
        {/* Loading Overlay */}
        {loading && (
          <div className='absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-lg'>
            <LoadingSpinner size='lg' color='primary' text='Loading...' />
          </div>
        )}

        {/* Modal Content */}
        <div className='p-6'>
          {/* Header */}
          <div className='flex items-center justify-between mb-8 top-0 bg-white z-10 pb-4 border-b-2 border-gray-100'>
            <h2 className='text-2xl font-semibold text-textprimary'>
              {mode === "create" ? "Create Class" : "Edit Class"}
            </h2>
            <button
              onClick={onClose}
              className='p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors'
            >
              <X className='w-6 h-6' />
            </button>
          </div>

          <div className='space-y-6'>
            {/* Student */}
            <div>
              {loadingStudents ? (
                <SkeletonDropdown label='Student' required />
              ) : (
                <CustomDropdown
                  label='Student'
                  placeholder='Select a student'
                  value={formData.student}
                  onChange={(value) => handleInputChange("student", value)}
                  options={students.map((student) => ({
                    value: student.studentId,
                    label: student.fullName,
                  }))}
                  required
                  disabled={mode === "edit"}
                />
              )}
            </div>
            {/* Subject */}
            <div>
              {loadingSubjects ? (
                <SkeletonDropdown label='Subject' required />
              ) : (
                <CustomDropdown
                  label='Subject'
                  placeholder='Select a subject'
                  value={formData.subject}
                  onChange={(value) => handleInputChange("subject", value)}
                  options={commonSubjects.map((subject) => ({
                    value: subject,
                    label: subject.replace(/^\w/, (c) => c.toUpperCase()),
                  }))}
                  required
                  disabled={
                    mode === "edit" ||
                    loadingStudents ||
                    students.length === 0 ||
                    !formData.student
                  }
                />
              )}
            </div>

            {/* Dates & Times */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-4'>
                Dates & Times
              </label>

              <div className='space-y-6'>
                {formData.days.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className='bg-gray-50 rounded-xl p-6 border border-gray-200'
                  >
                    {/* Day Header */}
                    <div className='flex items-center justify-between mb-4'>
                      <h3 className='text-lg font-semibold text-gray-800'>
                        Day {dayIndex + 1}
                      </h3>
                      {formData.days.length > 1 && (
                        <button
                          type='button'
                          onClick={() => removeDay(dayIndex)}
                          className='text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 rounded'
                        >
                          Remove Day
                        </button>
                      )}
                    </div>

                    {/* Recursive Toggle */}
                    <div className='flex items-center justify-between mb-4 p-3 bg-white rounded-lg border border-gray-200'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-medium text-gray-700'>
                          Recurring Class
                        </span>
                        <span className='text-xs text-gray-500'>
                          (Repeat this class weekly)
                        </span>
                      </div>
                      <label className='relative inline-flex items-center cursor-pointer'>
                        <input
                          type='checkbox'
                          checked={day.recursive}
                          onChange={(e) =>
                            handleRecursiveChange(dayIndex, e.target.checked)
                          }
                          className='sr-only peer'
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bgprimary"></div>
                      </label>
                    </div>

                    {/* Date Selection */}
                    <div className='mb-6'>
                      <div className='flex items-center gap-3 mb-2'>
                        <Calendar className='w-4 h-4 text-gray-500' />
                        <span className='text-sm font-medium text-gray-700'>
                          {day.date ? formatDate(day.date) : "Select Date"}
                        </span>
                      </div>
                      <DatePicker
                        name={`day-date-${dayIndex}`}
                        value={day.date}
                        minDate={new Date()}
                        excludeDates={getExcludedDates(dayIndex)}
                        showMonthDropdown={false}
                        showYearDropdown={false}
                        onChange={(value) => handleDayChange(dayIndex, value)}
                        placeholder='Select date'
                      />
                    </div>

                    {/* Time Slots */}
                    <div className='space-y-4'>
                      <h4 className='text-base font-medium text-gray-700'>
                        Time Slots
                      </h4>

                      {day.timeSlots.map((timeSlot, slotIndex) => (
                        <div
                          key={slotIndex}
                          className={`bg-white rounded-lg p-4 border-2 ${
                            hasTimeSlotIssue(dayIndex, slotIndex)
                              ? "border-red-300 bg-red-50"
                              : "border-gray-200"
                          }`}
                        >
                          <div className='flex items-center justify-between mb-3'>
                            <span className='text-sm font-medium text-gray-600'>
                              Time Slot {slotIndex + 1}
                            </span>
                            {hasTimeSlotIssue(dayIndex, slotIndex) && (
                              <span className='text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full'>
                                {hasExcessiveDuration(dayIndex, slotIndex)
                                  ? "Max 1 Hour"
                                  : "Time Conflict"}
                              </span>
                            )}
                          </div>

                          <div className='grid grid-cols-2 gap-4'>
                            <div>
                              <div className='flex items-center justify-center mb-2'>
                                <span
                                  className={`text-white text-xs px-3 py-1 rounded-full ${
                                    hasTimeSlotIssue(dayIndex, slotIndex)
                                      ? "bg-red-500"
                                      : "bg-bgprimary"
                                  }`}
                                >
                                  {formatDisplayTime(timeSlot.startTime) ||
                                    "No time selected"}
                                </span>
                              </div>
                              <TimeSelector
                                value={timeSlot.startTime}
                                onChange={(value) =>
                                  handleTimeSlotChange(
                                    dayIndex,
                                    slotIndex,
                                    "startTime",
                                    value
                                  )
                                }
                                placeholder='10:00 AM'
                                format24={false}
                              />
                            </div>
                            <div>
                              <div className='flex items-center justify-center mb-2'>
                                <span
                                  className={`text-white text-xs px-3 py-1 rounded-full ${
                                    hasTimeSlotIssue(dayIndex, slotIndex)
                                      ? "bg-red-500"
                                      : "bg-bgprimary"
                                  }`}
                                >
                                  {formatDisplayTime(timeSlot.endTime) ||
                                    "No time selected"}
                                </span>
                              </div>
                              <TimeSelector
                                value={timeSlot.endTime}
                                onChange={(value) =>
                                  handleTimeSlotChange(
                                    dayIndex,
                                    slotIndex,
                                    "endTime",
                                    value
                                  )
                                }
                                placeholder='11:00 AM'
                                format24={false}
                              />
                            </div>
                          </div>

                          {/* Time Slot Actions */}
                          <div className='flex justify-between items-center mt-4'>
                            <button
                              type='button'
                              onClick={() => addTimeSlot(dayIndex)}
                              className='flex items-center gap-2 text-bgprimary hover:text-teal-600 text-sm font-medium'
                            >
                              <Plus className='w-4 h-4' />
                              Add Time Slot
                            </button>

                            {day.timeSlots.length > 1 && (
                              <button
                                type='button'
                                onClick={() =>
                                  removeTimeSlot(dayIndex, slotIndex)
                                }
                                className='text-red-500 hover:text-red-700 text-sm font-medium'
                              >
                                Remove
                              </button>
                            )}
                          </div>

                          {/* Time Slot Issues Warning */}
                          {hasTimeSlotIssue(dayIndex, slotIndex) && (
                            <div className='mt-3 p-3 bg-red-100 border border-red-300 rounded-lg'>
                              <p className='text-sm text-red-700 flex items-center'>
                                <svg
                                  className='w-4 h-4 mr-2 flex-shrink-0'
                                  fill='currentColor'
                                  viewBox='0 0 20 20'
                                >
                                  <path
                                    fillRule='evenodd'
                                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                                    clipRule='evenodd'
                                  />
                                </svg>
                                {hasExcessiveDuration(dayIndex, slotIndex)
                                  ? "Class duration cannot exceed 1 hour (60 minutes)"
                                  : "Time conflict detected or end time is before start time"}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Day Button */}
              <button
                type='button'
                onClick={addDay}
                className='w-full mt-4 p-4 border-2 border-dashed border-bgprimary rounded-xl text-bgprimary hover:text-teal-600 hover:border-teal-600 hover:bg-teal-50 transition-all duration-200 flex items-center justify-center gap-2'
              >
                <Plus className='w-5 h-5' />
                Add New Day
              </button>
            </div>

            {/* Description */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder='Add any notes or details about the class...'
                rows={6}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bgprimary focus:border-transparent resize-none text-sm leading-relaxed'
              />
            </div>
          </div>

          <div className='flex flex-col gap-3 mt-2 bg-white pt-4 border-t border-gray-100'>
            <button
              onClick={handleSave}
              disabled={loading}
              className='w-full bg-bgprimary text-white py-4 px-6 rounded-full font-medium text-base hover:bg-teal-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Save Changes
            </button>
            <button
              onClick={onClose}
              className='w-full bg-white text-gray-700 py-4 px-6 rounded-full font-medium text-base border border-gray-300 hover:bg-gray-50 transition-colors duration-200'
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditClassModal;

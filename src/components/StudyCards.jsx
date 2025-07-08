import React, { useEffect, useState } from "react";
import { Edit, Trash2, Eye, FileText } from "lucide-react";

// Helper function to format dates
const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        return dateString;
    }
};

const StudyCard = (props) => {
    const { image, onEdit, onDelete, onViewSubmission, status, activeTab, userRole } = props;

    // Map API data to display format
    const mapApiDataToDisplay = (props) => {
        const mapped = { ...props };
        // Map heading to title for assignments/quizzes
        if (mapped.heading && !mapped.title) {
            mapped.title = mapped.heading;
        }
        // Format dates
        if (mapped.assignedDate) {
            mapped.assignedDate = formatDate(mapped.assignedDate);
        }
        if (mapped.dueDate) {
            mapped.dueDate = formatDate(mapped.dueDate);
        }
        // Map status values
        if (mapped.status === 'incomplete') {
            mapped.status = 'pending';
        }
        return mapped;
    };

    // Apply data mapping (moved up)
    const displayProps = mapApiDataToDisplay(props);

    // Keys to exclude from generic info display
    const excludeKeys = new Set([
        "image",
        "id",
        "onEdit",
        "onDelete",
        "onJoinClass",
        "onViewSubmission",
        "status",
        "profilePicture", // Exclude profilePicture from generic display
        "activeTab", // Exclude activeTab from generic display
        "subjects", // Exclude subjects from generic display - we'll handle it separately
        // Class-specific fields to exclude
        "_id",
        "__v",
        "createdAt",
        "updatedAt",
        "timeslot", // Handle timeslot separately
        "onCardClick",
        "onConnect"
    ]);

    // Additional keys to exclude when teacher is viewing students
    const teacherViewingStudents = (userRole === 'teacher' && (activeTab === 'your-students' || activeTab === 'other-students'));
    console.log('StudyCard - activeTab:', activeTab, 'userRole:', userRole, 'teacherViewingStudents:', teacherViewingStudents);
    
    if (teacherViewingStudents) {
        excludeKeys.add("email");
        excludeKeys.add("grade");
        console.log('StudyCard - Excluding email and grade for teacher viewing students');
    }

    const [hasJoinedClass, setHasJoinedClass] = useState(true);

    useEffect(() => {
        if (status) {
            setHasJoinedClass(false);
        }
    }, [status]);

    // Helper: convert camelCase to Title Case (e.g. assignedDate => Assigned Date)
    const formatKey = (key) =>
        key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase());

    const cardStatus = displayProps.status ? displayProps.status.toLowerCase() : null;
    const statusColors = {
        pending: "bg-yellow-100 text-yellow-600",
        approved: "bg-green-100 text-green-600",
        rejected: "bg-red-100 text-red-600",
        completed: "bg-blue-100 text-blue-600"
    };

    // Use profilePicture as image, fallback to image prop, then to a default image
    const displayImage = props.profilePicture || image || "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&h=200&fit=crop&crop=center";

    // Determine button text based on active tab
    const getButtonText = () => {
        if (activeTab === 'your-teachers') {
            return 'Message';
        } else if (activeTab === 'other-teachers') {
            return 'Connect';
        }
        return 'View Details'; // Default fallback
    };

    // Helper function to render subjects as tags
    const renderSubjects = (subjects) => {
        if (!subjects) return null;
        
        // Handle both array and string formats
        const subjectsArray = Array.isArray(subjects) ? subjects : [subjects];
        
        return (
            <div className="flex flex-wrap gap-1 mt-1">
                {subjectsArray.map((subject, index) => (
                    <span 
                        key={index}
                        className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded-full font-medium"
                    >
                        {subject}
                    </span>
                ))}
            </div>
        );
    };

    // Helper function to safely convert values to strings
    const safeToString = (value) => {
        if (value === null || value === undefined) {
            return '';
        }
        if (typeof value === 'object') {
            return JSON.stringify(value);
        }
        return String(value);
    };

    // Helper function to format timeslot for display
    const formatTimeslot = (timeslot) => {
        if (!timeslot || typeof timeslot !== 'object') return null;
        return `${timeslot.day} ${timeslot.startTime} - ${timeslot.endTime}`;
    };

    // Helper function to format price
    const formatPrice = (price) => {
        if (!price) return null;
        return `$${price}`;
    };

    // Check if this is an assignment card
    const isAssignment = displayProps.heading || displayProps.assignedDate || displayProps.dueDate;

    // Render assignment-specific card
    const renderAssignmentCard = () => {
        // If props.data exists and has heading/description, use that
        const cardData = props.data && typeof props.data === 'object' && (props.data.heading || props.data.description)
            ? props.data
            : displayProps;
        // Default assignment image
        const assignmentImage = props.image || "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80";
        return (
            <div
                className="bg-white border border-gray-300 rounded-2xl p-6 w-full max-w-sm shadow-md transition-transform transform hover:scale-105"
            >
                {/* Assignment Image */}
                <img
                    src={assignmentImage}
                    alt={cardData.heading || "Assignment"}
                    className="w-full object-cover rounded-lg mb-4 h-40"
                    onError={e => { e.target.src = "https://via.placeholder.com/400x200?text=Assignment"; }}
                />
                {/* Assignment Header */}
                <div className="flex flex-col mb-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                        {cardData.heading}
                    </h3>
                    <p className="text-sm text-gray-600">
                        {cardData.description}
                    </p>
                    {cardData.assignedDate && (
                        <p className="text-xs text-gray-500 mt-2">
                            <span className="font-semibold">Assigned:</span> {cardData.assignedDate}
                        </p>
                    )}
                    {cardData.dueDate && (
                        <p className="text-xs text-gray-500 mt-1">
                            <span className="font-semibold">Due:</span> {cardData.dueDate}
                        </p>
                    )}
                </div>
                {/* View Button */}
                <button
                    onClick={e => {
                        e.stopPropagation();
                        if (props.onViewSubmission) props.onViewSubmission();
                    }}
                    className="w-full flex items-center justify-center gap-2 border border-teal-500 text-teal-600 font-medium py-2 rounded-3xl hover:bg-teal-50 transition"
                >
                    <Eye className="w-4 h-4" />
                    View
                </button>
            </div>
        );
    };

    return (
        <>
            {isAssignment ? (
                renderAssignmentCard()
            ) : (
                <div
                    className={
                        getButtonText() === 'View Details'
                            ? "bg-white border border-gray-300 rounded-2xl p-4 w-full max-w-xs shadow-md transition-transform transform hover:scale-105"
                            : "bg-white border border-gray-300 rounded-2xl p-4 w-full max-w-xs shadow-md transition-transform transform hover:scale-105 cursor-pointer"
                    }
                    {...(getButtonText() === 'View Details' ? {} : { onClick: () => props.onCardClick && props.onCardClick(props) })}
                >
                    {/* Profile Image */}
                    <img
                        src={displayImage}
                        alt={displayProps.name || displayProps.title || "Profile"}
                        className="w-full object-cover rounded-lg mb-4 h-40"
                        onError={(e) => {
                            e.target.src = "https://via.placeholder.com/300x200/f0f0f0/999999?text=Profile";
                        }}
                    />
                    <div className="space-y-3">
                        {/* Status Badge */}
                        {cardStatus && (
                            <div className="flex justify-end">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[cardStatus] || "bg-gray-100 text-gray-600"}`}>
                                    {cardStatus.charAt(0).toUpperCase() + cardStatus.slice(1)}
                                </span>
                            </div>
                        )}

                        {/* Special display for teacher viewing students - show only name, grade, and subjects */}
                        {teacherViewingStudents ? (
                            <div className="space-y-3">
                                {/* Name */}
                                {displayProps.name && (
                                    <div className="flex gap-x-2 items-start">
                                        <p className="text-md text-gray-600 font-semibold min-w-fit">
                                            Name:
                                        </p>
                                        <div className="flex-1">
                                            <p className="text-md text-gray-800">{displayProps.name}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Grade (from className) */}
                                {displayProps.className && (
                                    <div className="flex gap-x-2 items-start">
                                        <p className="text-md text-gray-600 font-semibold min-w-fit">
                                            Grade:
                                        </p>
                                        <div className="flex-1">
                                            <p className="text-md text-gray-800">{displayProps.className}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Subjects as tags */}
                                {displayProps.subjects && (
                                    <div>
                                        <p className="text-md text-gray-600 font-semibold mb-1">Subjects:</p>
                                        {renderSubjects(displayProps.subjects)}
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Regular display for other cases */
                            <>
                                {/* Card Content */}
                                {Object.entries(displayProps)
                                    .filter(([key]) => !excludeKeys.has(key))
                                    .map(([key, value], index) => {
                                        // Special handling for class-specific fields
                                        let displayValue = value;
                                        let displayKey = formatKey(key);
                                        
                                        if (key === 'teacherEmail') {
                                            displayKey = 'Teacher';
                                        } else if (key === 'studentEmail') {
                                            displayKey = 'Student';
                                        } else if (key === 'perSessionPrice') {
                                            displayValue = formatPrice(value);
                                            displayKey = 'Price per Session';
                                        } else if (key === 'subject') {
                                            displayKey = 'Subject';
                                        } else if (key === 'description') {
                                            displayKey = 'Description';
                                        } else if (key === 'name') {
                                            displayKey = 'Name';
                                        } else if (key === 'email') {
                                            displayKey = 'Email';
                                        } else if (key === 'grade') {
                                            displayKey = 'Grade';
                                        } else if (key === 'heading') {
                                            displayKey = 'Title';
                                        } else if (key === 'teacherName') {
                                            displayKey = 'Teacher';
                                        }
                                        
                                        // Ensure displayValue is a string
                                        displayValue = safeToString(displayValue);
                                        
                                        return (
                                            <div key={key} className="flex gap-x-2 items-start">
                                                <p className="text-md text-gray-600 font-semibold min-w-fit">
                                                    {displayKey}:
                                                </p>
                                                <div className="flex-1">
                                                    <p className="text-md text-gray-800">{displayValue}</p>
                                                </div>
                                                {index === 0 && (
                                                    <div className="flex gap-2 ml-auto">
                                                        {cardStatus === "pending" && (
                                                            <>
                                                                <button onClick={onEdit} title="Edit">
                                                                    <Edit className="w-4 h-4 text-blue-500 hover:text-blue-700" />
                                                                </button>
                                                                <button onClick={onDelete} title="Delete">
                                                                    <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700" />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}

                                {/* Grade Display (for students) - Only show when NOT teacher viewing students */}
                                {displayProps.grade && !teacherViewingStudents && (
                                    <div className="flex gap-x-2 items-start">
                                        <p className="text-md text-gray-600 font-semibold min-w-fit">
                                            Grade:
                                        </p>
                                        <div className="flex-1">
                                            <p className="text-md text-gray-800">{displayProps.grade}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Subjects as tags (always show if present) - Only show when NOT teacher viewing students */}
                                {displayProps.subjects && !teacherViewingStudents && (
                                    <div>
                                        <p className="text-md text-gray-600 font-semibold mb-1">Subjects:</p>
                                        {renderSubjects(displayProps.subjects)}
                                    </div>
                                )}
                            </>
                        )}

                        {/* Timeslot Display (for classes) */}
                        {displayProps.timeslot && (
                            <div className="flex gap-x-2 items-start">
                                <p className="text-md text-gray-600 font-semibold min-w-fit">
                                    Schedule:
                                </p>
                                <div className="flex-1">
                                    <p className="text-md text-gray-800">{formatTimeslot(displayProps.timeslot)}</p>
                                </div>
                            </div>
                        )}

                        {/* Document Preview */}
                        {displayProps.documentUrl && (
                            <div className="flex items-center gap-2 mt-2 p-2 bg-gray-50 rounded-lg">
                                <FileText className="w-5 h-5 text-gray-500" />
                                <span className="text-sm text-gray-600 truncate">{displayProps.documentUrl}</span>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex gap-4">
                        <button
                            onClick={e => {
                                e.stopPropagation();
                                (getButtonText() === 'Connect' && props.onConnect ? props.onConnect : onViewSubmission)();
                            }}
                            className="w-full flex items-center justify-center gap-2 border border-teal-500 text-teal-600 font-medium py-2 rounded-3xl hover:bg-teal-50 transition"
                        >
                            <Eye className="w-4 h-4" />
                            {getButtonText()}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default StudyCard;

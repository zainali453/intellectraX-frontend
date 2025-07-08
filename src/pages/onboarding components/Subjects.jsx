import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Check } from 'lucide-react';

const Subjects = forwardRef(({ selectedSubjects: initialSubjects = [], onChange }, ref) => {
    // Normalize initialSubjects to always be an array of subject names (strings)
    const normalizeSubjects = (subjects) => {
        if (!Array.isArray(subjects)) return [];
        return subjects.map(sub =>
            typeof sub === 'string' ? sub : sub.subject
        );
    };

    const [selectedSubjects, setSelectedSubjects] = useState(normalizeSubjects(initialSubjects));
    
    const allSubjects = [
        'Mathematics',
        'Physics',
        'Chemistry',
        'Biology',
        'History',
        'Geography',
        'English Literature',
        'English Language',
        'Computer Science',
        'Economics',
    ];

    // Expose methods to parent component through ref
    useImperativeHandle(ref, () => ({
        getData: async () => {
            return selectedSubjects;
        }
    }));

    const handleSubjectToggle = (subject) => {
        const newSubjects = selectedSubjects.includes(subject)
            ? selectedSubjects.filter(s => s !== subject)
            : [...selectedSubjects, subject];
        
        setSelectedSubjects(newSubjects);
        onChange?.(newSubjects);
    };

    return (
        <div className="min-h-[500px]">
            <div className="space-y-2">
                {allSubjects.map((subject) => (
                    <div
                        key={subject}
                        onClick={() => handleSubjectToggle(subject)}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                        <span className="text-gray-700">{subject}</span>
                        <div 
                            className={`w-5 h-5 border rounded flex items-center justify-center transition-colors ${
                                selectedSubjects.includes(subject)
                                    ? 'bg-teal-500 border-teal-500'
                                    : 'border-gray-300'
                            }`}
                        >
                            {selectedSubjects.includes(subject) && (
                                <Check className="w-4 h-4 text-white" />
                            )}
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-6 text-sm text-gray-500 mb-6">
                Selected subjects: {selectedSubjects.length}
            </div>
        </div>
    );
});

export default Subjects;
import React, { useState, forwardRef, useImperativeHandle } from 'react';

const LearningGoals = forwardRef(({ learningGoals = '', onChange }, ref) => {
    const [goals, setGoals] = useState(learningGoals);

    // Expose methods to parent component through ref
    useImperativeHandle(ref, () => ({
        getData: async () => {
            return goals;
        }
    }));

    const handleGoalsChange = (e) => {
        const newGoals = e.target.value;
        setGoals(newGoals);
        onChange?.(newGoals);
    };

    return (
        <div className="min-h-[500px]">
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Please tell us about your learning goals
                </label>
                <textarea
                    value={goals}
                    onChange={handleGoalsChange}
                    placeholder="Describe your learning goals, what you want to achieve, and any specific areas you'd like to focus on..."
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                    rows={12}
                    style={{ minHeight: '300px' }}
                />
            </div>
        </div>
    );
});

export default LearningGoals; 
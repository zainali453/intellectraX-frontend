import React, { forwardRef, useImperativeHandle } from 'react';
import { Plus, X } from 'lucide-react';
import { useUser } from '../../context/UserContext';

const AvailabilitySchedule = forwardRef((props, ref) => {
    const { user } = useUser();
    const email = props.email || user?.email;
    const role = props.role || user?.role;
    const days = [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday',
        'Friday', 'Saturday', 'Sunday'
    ];

    // Destructure slots and onChange from props, default slots to []
    const { slots = [], onChange } = props;

    // Expose methods to parent component through ref
    useImperativeHandle(ref, () => ({
        getData: () => {
            return slots;
        }
    }));

    const handleAddAvailabilitySlot = () => {
        if (slots.length < 7) {
            onChange([
                ...slots,
                {
                    day: 'Monday',
                    startTime: '09:00',
                    endTime: '17:00',
                    _id: undefined // New slots have no _id until saved
                }
            ]);
        }
    };

    const handleRemoveAvailabilitySlot = (index) => {
        onChange(slots.filter((_, i) => i !== index));
    };

    const handleAvailabilityChange = (index, field, value) => {
        onChange(
            slots.map((slot, i) =>
                i === index ? { ...slot, [field]: value } : slot
            )
        );
    };

    return (
        <div>
            <h3 className="text-lg font-medium text-gray-900">Availability Schedule</h3>
            <div className="space-y-4 mt-4">
                {slots.map((slot, index) => (
                    <div
                        key={slot._id || `slot-${index}`}
                        className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg"
                    >
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                            <select
                                value={slot.day}
                                onChange={(e) => handleAvailabilityChange(index, 'day', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            >
                                {days.map((day) => (
                                    <option key={`day-${day}-${index}`} value={day}>{day}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                            <input
                                type="time"
                                value={slot.startTime}
                                onChange={(e) => handleAvailabilityChange(index, 'startTime', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                            <input
                                type="time"
                                value={slot.endTime}
                                onChange={(e) => handleAvailabilityChange(index, 'endTime', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            onClick={() => handleRemoveAvailabilitySlot(index)}
                            className="mt-6 p-2 text-gray-400 hover:text-red-500"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                ))}
                {slots.length < 7 && (
                    <button
                        onClick={handleAddAvailabilitySlot}
                        className="flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-teal-600 hover:border-teal-500 transition-colors"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Time Slot
                    </button>
                )}
            </div>
        </div>
    );
});

export default AvailabilitySchedule; 
import React, { forwardRef, useImperativeHandle } from "react";
import { Plus, X } from "lucide-react";
import { useUser } from "../../context/UserContext";
import CustomDropdown from "../CustomDropdown";
import TimeSelector from "../TimeSelector";

interface AvailabilitySlot {
  _id?: string;
  day: string;
  startTime: string;
  endTime: string;
}

interface AvailabilityScheduleProps {
  email?: string;
  role?: string;
  slots?: AvailabilitySlot[];
  onChange?: (slots: AvailabilitySlot[]) => void;
}

interface AvailabilityScheduleRef {
  getData: () => AvailabilitySlot[];
}

const AvailabilitySchedule = forwardRef<
  AvailabilityScheduleRef,
  AvailabilityScheduleProps
>((props, ref) => {
  const { user } = useUser();
  const email = props.email || user?.email;
  const role = props.role || user?.role;
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Destructure slots and onChange from props, default slots to []
  const { slots = [], onChange } = props;

  // Expose methods to parent component through ref
  useImperativeHandle(ref, () => ({
    getData: () => {
      return slots;
    },
  }));

  const handleAddAvailabilitySlot = () => {
    if (slots.length < 7 && onChange) {
      onChange([
        ...slots,
        {
          day: "Monday",
          startTime: "09:00",
          endTime: "17:00",
          _id: undefined, // New slots have no _id until saved
        },
      ]);
    }
  };

  const handleRemoveAvailabilitySlot = (index: number) => {
    if (onChange) {
      onChange(slots.filter((_, i) => i !== index));
    }
  };

  const handleAvailabilityChange = (
    index: number,
    field: keyof AvailabilitySlot,
    value: string
  ) => {
    if (onChange) {
      onChange(
        slots.map((slot, i) =>
          i === index ? { ...slot, [field]: value } : slot
        )
      );
    }
  };

  return (
    <div className="bg-white">
      <div className="space-y-6 mt-6">
        {slots.map((slot, index) => (
          <div
            key={slot._id || `slot-${index}`}
            className="bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl p-6"
          >
            {/* Day Header */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#374151] mb-4">Day</h3>
              <CustomDropdown
                value={slot.day}
                onChange={(value) =>
                  handleAvailabilityChange(index, "day", value)
                }
                options={days.map((day) => ({ value: day, label: day }))}
                placeholder="Select a day"
                className="w-full"
              />
            </div>

            {/* Time Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-base font-medium text-[#6B7280] mb-3">
                  Start Time
                </h4>
                <TimeSelector
                  value={slot.startTime}
                  onChange={(value) =>
                    handleAvailabilityChange(index, "startTime", value)
                  }
                  placeholder="8:00 AM"
                  format24={false}
                />
              </div>
              <div>
                <h4 className="text-base font-medium text-[#6B7280] mb-3">
                  End Time
                </h4>
                <TimeSelector
                  value={slot.endTime}
                  onChange={(value) =>
                    handleAvailabilityChange(index, "endTime", value)
                  }
                  placeholder="12:00 PM"
                  format24={false}
                />
              </div>
            </div>

            {/* Remove Button */}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => handleRemoveAvailabilitySlot(index)}
                className="flex items-center gap-2 px-4 py-2 text-[#EF4444] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg transition-all duration-200"
              >
                <X className="w-4 h-4" />
                <span className="text-sm font-medium">Remove Slot</span>
              </button>
            </div>
          </div>
        ))}

        {/* Add New Slot Button */}
        {slots.length < 7 && (
          <button
            onClick={handleAddAvailabilitySlot}
            className="flex items-center justify-center w-full p-6 border-2 border-dashed border-[#14B8A6] rounded-xl text-[#14B8A6] hover:text-[#0F766E] hover:border-[#0F766E] hover:bg-[#F0FDFA] transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#14B8A6] group-hover:bg-[#0F766E] flex items-center justify-center transition-colors duration-200">
                <Plus className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-medium">Add Slot</span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
});

export default AvailabilitySchedule;

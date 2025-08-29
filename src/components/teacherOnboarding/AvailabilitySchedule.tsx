import React, { forwardRef, useImperativeHandle } from "react";
import { Plus, X } from "lucide-react";
import CustomDropdown from "../CustomDropdown";
import TimeSelector from "../TimeSelector";

interface AvailabilitySlot {
  day: string;
  times: { startTime: string; endTime: string }[];
}

interface AvailabilityScheduleProps {
  slots: AvailabilitySlot[];
  onChange: (slots: AvailabilitySlot[]) => void;
}

const AvailabilitySchedule = ({
  slots,
  onChange,
}: AvailabilityScheduleProps) => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleAddAvailabilitySlot = () => {
    if (slots.length < 7 && onChange) {
      onChange([
        ...slots,
        {
          day: "Monday",
          times: [{ startTime: "09:00", endTime: "17:00" }],
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

  const handleTimeChange = (
    slotIndex: number,
    timeIndex: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    if (onChange) {
      onChange(
        slots.map((slot, i) =>
          i === slotIndex
            ? {
                ...slot,
                times: slot.times.map((time, j) =>
                  j === timeIndex ? { ...time, [field]: value } : time
                ),
              }
            : slot
        )
      );
    }
  };

  const handleAddTimeSlot = (slotIndex: number) => {
    if (onChange) {
      onChange(
        slots.map((slot, i) =>
          i === slotIndex
            ? {
                ...slot,
                times: [
                  ...slot.times,
                  { startTime: "09:00", endTime: "17:00" },
                ],
              }
            : slot
        )
      );
    }
  };

  const handleRemoveTimeSlot = (slotIndex: number, timeIndex: number) => {
    if (onChange) {
      onChange(
        slots.map((slot, i) =>
          i === slotIndex
            ? {
                ...slot,
                times: slot.times.filter((_, j) => j !== timeIndex),
              }
            : slot
        )
      );
    }
  };

  return (
    <div className="bg-white">
      <div className="space-y-6 mt-6">
        {slots.map((slot, index) => (
          <div
            key={`slot-${index}`}
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

            {/* Time Slots Section */}
            <div className="space-y-4">
              <h4 className="text-base font-medium text-[#374151] mb-3">
                Time Slots
              </h4>

              {slot.times.map((time, timeIndex) => (
                <div
                  key={`time-${timeIndex}`}
                  className="bg-white border border-[#E5E7EB] rounded-lg p-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-[#6B7280] mb-2">
                        Start Time
                      </h5>
                      <TimeSelector
                        value={time.startTime}
                        onChange={(value) =>
                          handleTimeChange(index, timeIndex, "startTime", value)
                        }
                        placeholder="8:00 AM"
                        format24={false}
                      />
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-[#6B7280] mb-2">
                        End Time
                      </h5>
                      <TimeSelector
                        value={time.endTime}
                        onChange={(value) =>
                          handleTimeChange(index, timeIndex, "endTime", value)
                        }
                        placeholder="12:00 PM"
                        format24={false}
                      />
                    </div>
                  </div>

                  {/* Remove Time Slot Button */}
                  {slot.times.length > 1 && (
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => handleRemoveTimeSlot(index, timeIndex)}
                        className="cursor-pointer flex items-center gap-2 px-3 py-1 text-[#EF4444] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg transition-all duration-200"
                      >
                        <X className="w-4 h-4" />
                        <span className="text-[14px] font-medium">
                          Remove Time
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {/* Add Time Slot Button */}
              <button
                onClick={() => handleAddTimeSlot(index)}
                className="cursor-pointer flex items-center justify-center w-full p-4 border-2 border-dashed border-[#10B981] rounded-lg text-[#10B981] hover:text-[#059669] hover:border-[#059669] hover:bg-[#ECFDF5] transition-all duration-200 group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#10B981] group-hover:bg-[#059669] flex items-center justify-center transition-colors duration-200">
                    <Plus className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-medium">Add Time Slot</span>
                </div>
              </button>
            </div>

            {/* Remove Day Slot Button */}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => handleRemoveAvailabilitySlot(index)}
                className="cursor-pointer flex items-center gap-2 px-4 py-2 text-[#EF4444] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg transition-all duration-200"
              >
                <X className="w-4 h-4" />
                <span className="text-sm font-medium">Remove Day</span>
              </button>
            </div>
          </div>
        ))}

        {/* Add New Day Button */}
        {slots.length < 7 && (
          <button
            onClick={handleAddAvailabilitySlot}
            className="cursor-pointer flex items-center justify-center w-full p-6 border-2 border-dashed border-[#14B8A6] rounded-xl text-[#14B8A6] hover:text-[#0F766E] hover:border-[#0F766E] hover:bg-[#F0FDFA] transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#14B8A6] group-hover:bg-[#0F766E] flex items-center justify-center transition-colors duration-200">
                <Plus className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-medium">Add Day</span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default AvailabilitySchedule;

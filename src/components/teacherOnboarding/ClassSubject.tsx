import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Check, Plus, X } from "lucide-react";
import CustomDropdown from "../CustomDropdown";

interface Subject {
  subject: string;
  price: number;
}

interface TeacherClasses {
  level: string;
  subjects: Subject[];
}

type ClassSubjectProps = {
  initialData: TeacherClasses[];
  onChange: (data: TeacherClasses[]) => void;
};

const ClassSubject = ({ initialData = [], onChange }: ClassSubjectProps) => {
  const [studyLevels, setStudyLevels] = useState<TeacherClasses[]>(
    initialData.length > 0 ? initialData : [{ level: "", subjects: [] }]
  );

  const [customSubjects, setCustomSubjects] = useState<{
    [key: number]: string;
  }>({});

  // UK Education Levels
  const ukEducationLevels = [
    { value: "11-plus", label: "11 Plus" },
    { value: "ks3", label: "Key Stage 3" },
    { value: "gcse", label: "GCSE" },
    { value: "a-level", label: "A-Level" },
  ];

  // Common UK subjects
  const ukSubjects = [
    "English",
    "Mathematics",
    "Biology",
    "Physics",
    "Chemistry",
  ];

  const handleLevelChange = (index: number, level: string) => {
    const newLevels = [...studyLevels];
    newLevels[index] = { ...newLevels[index], level };
    setStudyLevels(newLevels);
    onChange?.(newLevels);
  };

  const handleSubjectToggle = (levelIndex: number, subject: string) => {
    const newLevels = [...studyLevels];
    const currentSubjects = newLevels[levelIndex].subjects;

    const existingSubjectIndex = currentSubjects.findIndex(
      (s) => s.subject === subject
    );

    if (existingSubjectIndex >= 0) {
      // Remove subject
      newLevels[levelIndex].subjects = currentSubjects.filter(
        (_, i) => i !== existingSubjectIndex
      );
    } else {
      // Add subject with default price
      newLevels[levelIndex].subjects = [
        ...currentSubjects,
        { subject, price: 30.0 },
      ];
    }

    setStudyLevels(newLevels);
    onChange?.(newLevels);
  };

  const handlePriceChange = (
    levelIndex: number,
    subjectIndex: number,
    price: number
  ) => {
    const newLevels = [...studyLevels];
    newLevels[levelIndex].subjects[subjectIndex].price = price;
    setStudyLevels(newLevels);
    onChange(newLevels);
  };

  const addCustomSubject = (levelIndex: number) => {
    const customSubject = customSubjects[levelIndex];
    if (customSubject && customSubject.trim()) {
      handleSubjectToggle(levelIndex, customSubject.trim());
      setCustomSubjects((prev) => ({ ...prev, [levelIndex]: "" }));
    }
  };

  const addStudyLevel = () => {
    if (
      studyLevels.filter(
        (level) => level.level === "" || level.subjects.length === 0
      ).length === 0
    ) {
      setStudyLevels([...studyLevels, { level: "", subjects: [] }]);
    }
  };

  const removeStudyLevel = (index: number) => {
    if (studyLevels.length > 1) {
      const newLevels = studyLevels.filter((_, i) => i !== index);
      setStudyLevels(newLevels);

      // Clear custom subject for this level
      setCustomSubjects((prev) => {
        const newCustomSubjects = { ...prev };
        delete newCustomSubjects[index];
        // Reindex remaining custom subjects
        const reindexed: { [key: number]: string } = {};
        Object.keys(newCustomSubjects).forEach((key) => {
          const numKey = parseInt(key);
          if (numKey > index) {
            reindexed[numKey - 1] = newCustomSubjects[numKey];
          } else {
            reindexed[numKey] = newCustomSubjects[numKey];
          }
        });
        return reindexed;
      });

      onChange?.(newLevels);
    }
  };

  const isSubjectSelected = (levelIndex: number, subject: string) => {
    return studyLevels[levelIndex].subjects.some((s) => s.subject === subject);
  };

  return (
    <div className="space-y-8">
      {studyLevels.map((levelData, levelIndex) => (
        <div key={levelIndex}>
          {/* Level Selection */}
          <div className="mb-6 p-1">
            <CustomDropdown
              // label="Select level of study"
              placeholder="Select level of study"
              value={levelData.level}
              onChange={(value) => handleLevelChange(levelIndex, value)}
              options={ukEducationLevels}
              required
            />
          </div>

          {/* Subjects Section */}
          {levelData.level && (
            <div className="bg-[#F9FAFB] border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  {
                    ukEducationLevels.find((l) => l.value === levelData.level)
                      ?.label
                  }
                </h4>
                {studyLevels.length > 0 && (
                  <button
                    onClick={() => removeStudyLevel(levelIndex)}
                    className="text-red-500 cursor-pointer hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Headers */}
              <div className="flex items-center justify-between mb-4 px-4">
                <span className="text-sm font-medium text-gray-600">
                  Subject
                </span>
                <span className="text-sm font-medium text-gray-600">
                  Price per hour ($)
                </span>
              </div>

              {/* Subject Grid */}
              <div className="grid gap-3">
                {/* Predefined Subjects */}
                {ukSubjects.map((subject) => {
                  const isSelected = isSubjectSelected(levelIndex, subject);
                  const selectedSubject = levelData.subjects.find(
                    (s) => s.subject === subject
                  );

                  return (
                    <div
                      key={subject}
                      className={`flex items-center justify-between p-4 border rounded-lg transition-all cursor-pointer ${
                        isSelected
                          ? "border-bgprimary bg-bgprimary/3"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                      onClick={() => handleSubjectToggle(levelIndex, subject)}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-5 h-5 border rounded transition-colors flex items-center justify-center ${
                            isSelected
                              ? "bg-bgprimary border-bgprimary"
                              : "border-gray-300"
                          }`}
                        >
                          {isSelected && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className="text-gray-700 font-medium">
                          {subject}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={selectedSubject?.price}
                          onChange={(e) => {
                            e.stopPropagation();
                            if (isSelected) {
                              const subjectIndex = levelData.subjects.findIndex(
                                (s) => s.subject === subject
                              );
                              if (subjectIndex >= 0) {
                                handlePriceChange(
                                  levelIndex,
                                  subjectIndex,
                                  parseFloat(e.target.value) || 0
                                );
                              }
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                          disabled={!isSelected}
                          className={`w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-bgprimary focus:border-transparent ${
                            !isSelected
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : ""
                          }`}
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  );
                })}

                {/* Custom Subjects */}
                {levelData.subjects
                  .filter((subject) => !ukSubjects.includes(subject.subject))
                  .map((customSub) => (
                    <div
                      key={customSub.subject}
                      className="flex items-center justify-between p-4 border border-bgprimary bg-bgprimary/3 rounded-lg transition-all cursor-pointer"
                      onClick={() =>
                        handleSubjectToggle(levelIndex, customSub.subject)
                      }
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 border rounded transition-colors flex items-center justify-center bg-bgprimary border-bgprimary">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-gray-700 font-medium">
                          {customSub.subject}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={customSub.price}
                          onChange={(e) => {
                            e.stopPropagation();
                            const subjectIndex = levelData.subjects.findIndex(
                              (s) => s.subject === customSub.subject
                            );
                            if (subjectIndex >= 0) {
                              handlePriceChange(
                                levelIndex,
                                subjectIndex,
                                parseFloat(e.target.value) || 0
                              );
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-bgprimary focus:border-transparent"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  ))}

                {/* Custom Subject Input */}
                <div className="flex items-center justify-between p-4 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="flex items-center space-x-3 flex-1">
                    <Plus className="w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Type your custom subject here"
                      value={customSubjects[levelIndex] || ""}
                      onChange={(e) =>
                        setCustomSubjects((prev) => ({
                          ...prev,
                          [levelIndex]: e.target.value,
                        }))
                      }
                      onKeyPress={(e) => {
                        if (
                          e.key === "Enter" &&
                          (customSubjects[levelIndex] || "").trim()
                        ) {
                          addCustomSubject(levelIndex);
                        }
                      }}
                      className="flex-1 border-none outline-none text-gray-700 placeholder-gray-400 bg-transparent"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    {(customSubjects[levelIndex] || "").trim() ? (
                      <button
                        onClick={() => addCustomSubject(levelIndex)}
                        className="cursor-pointer px-3 py-1 bg-bgprimary text-white text-sm rounded hover:bg-bgprimary/90 transition-colors"
                      >
                        Add
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm">0.00</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add Another Level Button */}
      <button
        onClick={addStudyLevel}
        disabled={
          studyLevels.filter(
            (level) => level.level === "" || level.subjects.length === 0
          ).length > 0
        }
        className="w-full disabled:opacity-50 p-4 cursor-pointer border-2 border-dashed border-bgprimary text-bgprimary rounded-lg disabled:hover:opacity-50  hover:bg-bgprimary/5 transition-colors flex items-center justify-center space-x-2"
      >
        <Plus className="w-5 h-5" />
        <span>Add another level of study</span>
      </button>
    </div>
  );
};

ClassSubject.displayName = "ClassSubject";

export default ClassSubject;

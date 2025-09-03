import React, { useState, useEffect } from "react";

interface ClassSubjectsProps {
  initialData: {
    subjects: string[];
  };
  onChange: (data: any) => void;
}

const ClassSubjects: React.FC<ClassSubjectsProps> = ({
  initialData,
  onChange,
}) => {
  const predefinedSubjects = [
    "English",
    "Mathematics",
    "Biology",
    "Physics",
    "Chemistry",
    "History",
    "Geography",
    "Economics",
    "Accounting",
    "Business Studies",
  ];

  // Initialize selected subjects from initialData
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    initialData?.subjects || ["English"]
  );

  const [customSubject, setCustomSubject] = useState("");

  // Extract custom subjects from initial data that aren't in predefined subjects
  const initialCustomSubjects =
    initialData?.subjects?.filter(
      (subject) => !predefinedSubjects.includes(subject)
    ) || [];

  const [customSubjects, setCustomSubjects] = useState<string[]>(
    initialCustomSubjects
  );

  // Combine all available subjects
  const allSubjects = [...predefinedSubjects, ...customSubjects];

  // Notify parent component when subjects change
  useEffect(() => {
    onChange({ ...initialData, subjects: selectedSubjects });
  }, [selectedSubjects, onChange]);

  const handleSubjectToggle = (subject: string) => {
    setSelectedSubjects((prev) => {
      const newSelected = prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject];

      // If unselecting a custom subject, remove it from customSubjects as well
      if (prev.includes(subject) && customSubjects.includes(subject)) {
        setCustomSubjects((prevCustom) =>
          prevCustom.filter((s) => s !== subject)
        );
      }

      return newSelected;
    });
  };

  const handleAddCustomSubject = () => {
    const trimmedSubject = customSubject.trim();

    if (!trimmedSubject) return;

    // Check if subject already exists (case-insensitive)
    const subjectExists = allSubjects.some(
      (subject) => subject.toLowerCase() === trimmedSubject.toLowerCase()
    );

    if (!subjectExists) {
      setCustomSubjects((prev) => [...prev, trimmedSubject]);
      setSelectedSubjects((prev) => [...prev, trimmedSubject]);
      setCustomSubject("");
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-medium text-[#8E97A4] mb-5">Subjects</h2>

      <div className="space-y-4">
        {allSubjects
          .sort((s) => (selectedSubjects.includes(s) ? -1 : 1))
          .map((subject) => (
            <div
              key={subject}
              className={
                "flex items-center border py-2 px-5 rounded-lg border-[#EAEAEA]" +
                (selectedSubjects.includes(subject) ? " border-bgprimary" : "")
              }
            >
              <label className="flex items-center cursor-pointer w-full">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedSubjects.includes(subject)}
                    onChange={() => handleSubjectToggle(subject)}
                    className="sr-only"
                  />
                  <div
                    className={`w-6 h-6 border-2 rounded-md flex items-center justify-center transition-all duration-200 ${
                      selectedSubjects.includes(subject)
                        ? "bg-bgprimary border-bgprimary"
                        : "border-gray-300 bg-white hover:border-gray-400"
                    }`}
                  >
                    {selectedSubjects.includes(subject) && (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="ml-4 text-gray-700 text-lg font-medium">
                  {subject}
                </span>
              </label>
            </div>
          ))}
      </div>

      <div className="mt-8">
        <p className="text-gray-600 mb-4">Don't see your subject?</p>
        <div className="relative p-2">
          <input
            type="text"
            value={customSubject}
            onChange={(e) => setCustomSubject(e.target.value)}
            placeholder="Type your custom subject here"
            className="w-full px-7 bg-[#F9FAFB] py-2 border border-dashed border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-bgprimary focus:border-transparent text-gray-700 placeholder-gray-400"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleAddCustomSubject();
              }
            }}
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          {customSubject.trim() && (
            <button
              onClick={handleAddCustomSubject}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-bgprimary text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-opacity-90 transition-all duration-200"
            >
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassSubjects;

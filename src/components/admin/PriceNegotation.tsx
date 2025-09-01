import { useEffect, useState } from "react";
import { Check, X, AlertCircle } from "lucide-react";
import { PriceNegotiationData, adminService } from "@/services/admin.service";
import PriceNegotiationSkeleton from "./PriceNegotiationSkeleton";

type PriceNegotiationProps = {
  teacherId: string;
};

interface ValidationError {
  classIndex: number;
  subjectIndex: number;
  message: string;
}

const PriceNegotiation = ({ teacherId }: PriceNegotiationProps) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [negotiationData, setNegotiationData] = useState<
    PriceNegotiationData[]
  >([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const fetchTeacherPrices = async () => {
      try {
        setLoading(true);
        const response = await adminService.getTeacherPrices(teacherId);
        if (response.data) {
          setNegotiationData(response.data.classes);
        }
      } catch (error) {
        console.error("Error fetching teacher prices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherPrices();
  }, [teacherId]);

  const validateData = (): ValidationError[] => {
    const validationErrors: ValidationError[] = [];

    negotiationData.forEach((classData, classIndex) => {
      classData.subjects.forEach((subject, subjectIndex) => {
        // Check if acceptedBy is null
        if (!subject.acceptedBy) {
          validationErrors.push({
            classIndex,
            subjectIndex,
            message: "Please accept or reject this subject",
          });
        }

        // If rejecting, must have adminPrice
        if (subject.acceptedBy === "admin" && !subject.adminPrice) {
          validationErrors.push({
            classIndex,
            subjectIndex,
            message: "Admin price is required when rejecting teacher's price",
          });
        }
      });
    });

    return validationErrors;
  };

  const handleResponseChange = (
    classIndex: number,
    subjectIndex: number,
    acceptedBy: "admin" | "teacher" | null
  ) => {
    const updatedData = [...negotiationData];
    const subject = updatedData[classIndex].subjects[subjectIndex];

    // Clear any existing errors for this field
    setErrors((prev) =>
      prev.filter(
        (error) =>
          !(
            error.classIndex === classIndex &&
            error.subjectIndex === subjectIndex
          )
      )
    );

    if (acceptedBy === "teacher") {
      // Accept teacher's price
      subject.acceptedBy = "teacher";
      subject.accepted = true;
      subject.adminPrice = subject.price; // Set admin price to teacher's price
    } else if (acceptedBy === "admin") {
      // Reject teacher's price - admin will set their own price
      subject.acceptedBy = "admin";
      subject.accepted = false;
      // Don't set adminPrice here, let admin input it
    } else {
      // Reset
      subject.acceptedBy = null;
      subject.accepted = false;
      subject.adminPrice = undefined;
    }

    setNegotiationData(updatedData);
    setHasUnsavedChanges(true);
  };

  const handlePriceChange = (
    classIndex: number,
    subjectIndex: number,
    newPrice: number
  ) => {
    const updatedData = [...negotiationData];
    const subject = updatedData[classIndex].subjects[subjectIndex];

    // Only allow admin price change if admin is rejecting teacher's price
    if (subject.acceptedBy === "admin" || !subject.acceptedBy) {
      subject.adminPrice = newPrice;

      // Clear validation error for this field
      setErrors((prev) =>
        prev.filter(
          (error) =>
            !(
              error.classIndex === classIndex &&
              error.subjectIndex === subjectIndex
            )
        )
      );
    }

    setNegotiationData(updatedData);
    setHasUnsavedChanges(true);
  };

  const handleSubmit = async () => {
    // Validate before submitting
    const validationErrors = validateData();

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSubmitting(true);
      await adminService.submitPriceNegotiation(teacherId, negotiationData);
      setHasUnsavedChanges(false);
      setErrors([]);
      // You might want to show a success message or redirect
      console.log("Price negotiation submitted successfully");
    } catch (error) {
      console.error("Error submitting negotiation:", error);
      // Handle error (show error message, etc.)
    } finally {
      setSubmitting(false);
    }
  };

  const getFieldError = (
    classIndex: number,
    subjectIndex: number
  ): string | null => {
    const error = errors.find(
      (e) => e.classIndex === classIndex && e.subjectIndex === subjectIndex
    );
    return error ? error.message : null;
  };

  const isFieldLocked = (classIndex: number, subjectIndex: number): boolean => {
    const subject = negotiationData[classIndex]?.subjects[subjectIndex];
    return subject?.acceptedBy === "teacher";
  };

  // Show loading skeleton while fetching data
  if (loading) {
    return <PriceNegotiationSkeleton />;
  }

  return (
    <div className="bg-white rounded-xl p-8 w-full max-w-[68%] my-10">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold text-textprimary mb-2">
          Price Negotiation
        </h2>
        <p className="text-black text-sm">
          Review and negotiate pricing for each subject. Accept teacher's price
          or set your own.
        </p>
      </div>

      {/* Error Summary */}
      {errors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center mb-2">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <h4 className="text-red-800 font-medium">
              Please fix the following errors:
            </h4>
          </div>
          <ul className="text-red-700 text-sm space-y-1">
            {errors.map((error, index) => (
              <li key={index}>
                {negotiationData[error.classIndex]?.level} -{" "}
                {
                  negotiationData[error.classIndex]?.subjects[
                    error.subjectIndex
                  ]?.subject
                }
                : {error.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Content Cards */}
      {negotiationData.map((classData, classIndex) => (
        <div
          key={classIndex}
          className="bg-[#F9FAFB] rounded-lg overflow-hidden p-5 border-1 border-[#EAEAEA] mb-6"
        >
          {/* Level Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {classData.level}
            </h3>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="pb-3 pl-2 text-left text-sm font-medium text-gray-500">
                    Subject
                  </th>
                  <th className="pb-3 text-right text-sm font-medium text-gray-500">
                    Your Price ($)
                  </th>
                  <th className="pb-3 text-center text-sm font-medium text-gray-500">
                    Teacher Offer ($)
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-500">
                    Response
                  </th>
                </tr>
              </thead>
              <tbody>
                {classData.subjects.map((item, subjectIndex) => {
                  const fieldError = getFieldError(classIndex, subjectIndex);
                  const isLocked = isFieldLocked(classIndex, subjectIndex);

                  return (
                    <tr
                      key={subjectIndex}
                      className={` border-1 ${
                        fieldError ? "border-red-300" : "border-[#EAEAEA]"
                      } ${
                        item.acceptedBy === "teacher"
                          ? "bg-green-50"
                          : item.acceptedBy === "admin"
                          ? "bg-red-50"
                          : "bg-white"
                      }`}
                    >
                      <td className="py-4 text-base font-medium text-gray-900 pl-4">
                        {item.subject}
                        {fieldError && (
                          <div className="text-red-500 text-xs mt-1">
                            {fieldError}
                          </div>
                        )}
                      </td>
                      <td className="py-4 text-center p-2">
                        <div className="flex justify-end">
                          <input
                            type="text"
                            value={
                              item.adminPrice === undefined
                                ? item.price
                                : item.adminPrice
                            }
                            onChange={(e) =>
                              handlePriceChange(
                                classIndex,
                                subjectIndex,
                                parseFloat(e.target.value) || 0
                              )
                            }
                            disabled={isLocked || submitting}
                            className={`w-25 px-1 py-2 text-base text-right border rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-bgprimary focus:border-transparent ${
                              isLocked
                                ? "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed"
                                : fieldError
                                ? "border-red-300 bg-red-50 text-gray-700"
                                : "border-gray-300 bg-white text-gray-700"
                            }`}
                          />
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <div className="flex justify-center">
                          <div className="w-25 px-3 py-2 text-base text-right border-2 border-teal-400 rounded-md bg-white text-teal-600 font-medium">
                            {item.price.toFixed(2)}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <div className="flex items-center justify-start space-x-3">
                          <button
                            onClick={() =>
                              handleResponseChange(
                                classIndex,
                                subjectIndex,
                                item.acceptedBy === "teacher" ? null : "teacher"
                              )
                            }
                            disabled={submitting}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                              item.acceptedBy === "teacher"
                                ? "bg-green-500 text-white"
                                : "bg-gray-200 text-gray-400 hover:bg-green-100 hover:text-green-600"
                            } ${
                              submitting ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            title="Accept teacher's price"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleResponseChange(
                                classIndex,
                                subjectIndex,
                                item.acceptedBy === "admin" ? null : "admin"
                              )
                            }
                            disabled={submitting}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                              item.acceptedBy === "admin"
                                ? "bg-red-500 text-white"
                                : "bg-gray-200 text-gray-400 hover:bg-red-100 hover:text-red-600"
                            } ${
                              submitting ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            title="Reject teacher's price and set your own"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <button
          onClick={handleSubmit}
          disabled={submitting || !hasUnsavedChanges}
          className="flex-1 px-6 py-2 bg-bgprimary text-white rounded-full hover:bg-bgprimary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Submitting...
            </>
          ) : (
            "Submit Negotiation"
          )}
        </button>
      </div>
    </div>
  );
};

PriceNegotiation.displayName = "PriceNegotiation";

export default PriceNegotiation;

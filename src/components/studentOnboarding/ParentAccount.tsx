import React from "react";
import InputField from "../InputField";

const ParentAccount = ({ initialData, onChange }) => {
  const [parentEmail, setParentEmail] = React.useState(
    initialData.parentEmail || ""
  );
  const [parentContact, setParentContact] = React.useState(
    initialData.parentContactNumber || ""
  );

  React.useEffect(() => {
    onChange((prev) => ({
      ...prev,
      parentEmail,
      parentContactNumber: parentContact,
    }));
  }, [parentEmail, parentContact]);

  return (
    <div className="p-1 mt-4 flex flex-col gap-4">
      <InputField
        label="Parent Email"
        value={parentEmail}
        onChange={(e) => setParentEmail(e.target.value)}
        name="parentEmail"
        placeholder="Enter parent's email"
      />
      <InputField
        label="Parent Contact Number"
        value={parentContact}
        onChange={(e) => setParentContact(e.target.value)}
        name="parentContact"
        placeholder="Enter parent's contact number"
      />
    </div>
  );
};

export default ParentAccount;

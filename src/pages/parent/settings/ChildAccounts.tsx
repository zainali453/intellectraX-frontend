import CustomIcon from "@/components/CustomIcon";
import InputField from "@/components/InputField";
import ConfirmRemoveChildModal from "@/components/parentOnboarding/ConfirmRemoveChildModal";
import { useUser } from "@/context/UserContext";
import React, { use, useState } from "react";

const ParentAccount = () => {
  const [childs, setChilds] = React.useState<
    { email: string; fullName: string }[]
  >([
    {
      email: "example@example.com",
      fullName: "Jane Doe",
    },
  ]);
  const [isLoading, setIsLoading] = React.useState(false);

  const [error, setError] = useState("");
  const [removeModal, setRemoveModal] = useState<{
    isOpen: boolean;
    childEmail: string;
    childName: string;
  }>({
    isOpen: false,
    childEmail: "",
    childName: "",
  });

  // Handle remove child
  const handleRemoveChild = (email: string, name: string) => {
    setRemoveModal({
      isOpen: true,
      childEmail: email,
      childName: name,
    });
  };

  const confirmRemoveChild = () => {
    // Logic to remove child
    const updatedChilds = childs.filter(
      (child) => child.email !== removeModal.childEmail
    );
    setChilds(updatedChilds);
    setRemoveModal({
      isOpen: false,
      childEmail: "",
      childName: "",
    });
  };
  const cancelRemoveChild = () => {
    setRemoveModal({
      isOpen: false,
      childEmail: "",
      childName: "",
    });
  };

  return (
    <div className=''>
      <>
        {/* Children List Section */}
        {childs && childs.length > 0 ? (
          <div className='mb-6'>
            <label className='block text-sm font-medium text-[#8E97A4] mb-3'>
              Your Children
            </label>
            <div className='space-y-3'>
              {childs.map((child, index) => (
                <div
                  key={child.email}
                  className='flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow'
                >
                  <div className='flex items-center gap-3'>
                    {/* Profile Picture Placeholder */}
                    <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0'>
                      <CustomIcon
                        name='user'
                        className='w-8 h-8 text-gray-400'
                      />
                    </div>

                    {/* Child Info */}
                    <div className='flex flex-col'>
                      <h3 className='text-base font-semibold text-gray-900'>
                        {child.fullName || "Child Name"}
                      </h3>
                      <p className='text-sm text-gray-500'>{child.email}</p>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() =>
                      handleRemoveChild(child.email, child.fullName || "Child")
                    }
                    className='p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors'
                    title='Remove child'
                  >
                    <svg
                      className='w-5 h-5'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M6 18L18 6M6 6l12 12'
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Info Message */}
            <div className='mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
              <p className='text-xs text-blue-800'>
                💡 <strong>Note:</strong> Removing a child from your account is
                permanent. They will need to re-add your email to reconnect.
              </p>
            </div>
          </div>
        ) : (
          <div className='mb-2 flex flex-col items-center justify-center h-80'>
            <p className='text-3xl mb-2 text-gray-600 '>
              No children added yet.
            </p>
            <p className='text-md text-gray-500'>
              Please add your email address to your child's account to connect
              them.
            </p>
          </div>
        )}
      </>

      {/* Confirmation Modal */}
      <ConfirmRemoveChildModal
        isOpen={removeModal.isOpen}
        childName={removeModal.childName}
        childEmail={removeModal.childEmail}
        onConfirm={confirmRemoveChild}
        onCancel={cancelRemoveChild}
      />
    </div>
  );
};

export default ParentAccount;

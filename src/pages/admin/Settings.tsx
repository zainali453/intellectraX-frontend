import CustomIcon, { IconName } from "@/components/CustomIcon";
import TeacherCustomHeader from "@/components/TeacherCustomHeader";
import { useUser } from "@/context/UserContext";
import { useState } from "react";
import Account from "./settings/Account";
import logo from "@/assets/logo.png";

interface FileUploadAreaProps {
  fileType: string;
  label?: string;
  file: File | string | null;
  fileUrl: string;
  fileName?: string;
  onFileUpload: (
    fileType: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onFileDrop: (fileType: string, event: React.DragEvent) => void;
  uploading: boolean;
}

const profileLinks: {
  name: string;
  icon: IconName;
  path: string;
  size?: string;
}[] = [
  {
    name: "Account",
    icon: "account",
    path: "account",
    size: "w-[19px] h-5",
  },
];

const Settings = () => {
  const { user } = useUser();

  return (
    <div className='px-8 py-6'>
      <TeacherCustomHeader title='Settings' />
      <div className='flex flex-row justify-between gap-8'>
        <div className='bg-white rounded-2xl min-w-1/4'>
          <div className='flex-1 overflow-y-auto scroll-optimized'>
            <div className='my-2 px-6 pt-6'>
              <div className='mb-6'>
                <div className='flex items-center justify-center'>
                  <div className='relative cursor-pointer'>
                    <div className='w-26 h-30 bg-[#EFF2F7] rounded-full flex items-center justify-center overflow-hidden'>
                      <img
                        src={logo}
                        alt='Profile'
                        className='w-full h-full object-fit'
                      />
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-12 h-15 rounded-full flex items-center justify-center transition-colors ${""}`}
                    ></div>
                  </div>
                </div>
              </div>
              <p className='text-center text-xl font-semibold text-textprimary pb-3'>
                {user?.fullName}
              </p>
            </div>
            <div className='border-1 border-[#EAEAEA]'></div>
            <nav className='space-y-6 p-6'>
              {profileLinks.map((link) => {
                return (
                  <div
                    key={link.name}
                    className={`group flex items-center gap-4 px-2 rounded-lg cursor-pointer transition-colors duration-150 ease-out ${
                      true
                        ? "text-bgprimary font-medium"
                        : "text-[#ADB4D2] hover:text-bgprimary font-normal"
                    }`}
                  >
                    <CustomIcon
                      name={
                        true ? ((link.icon + "Active") as IconName) : link.icon
                      }
                      className={`${link.size || "w-5 h-5"} ${
                        !true ? "group-hover:hidden" : ""
                      }`}
                    />
                    {!true && (
                      <CustomIcon
                        name={(link.icon + "Active") as any}
                        className={`${
                          link.size || "w-5 h-5"
                        } hidden group-hover:block`}
                      />
                    )}
                    <span>{link.name}</span>
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
        <div className='bg-white p-6 rounded-2xl flex-1'>{<Account />}</div>
      </div>
    </div>
  );
};

export default Settings;

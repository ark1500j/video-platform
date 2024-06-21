"use client";

import { CircleX } from "lucide-react";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
  } from "@/components/ui/input-otp";
import { useReset } from "@/utils/state";

interface Props {
  isModalOpen?: boolean;
  handleCloseModal: () => void;
}
const ResetModal = ({ isModalOpen, handleCloseModal }: Props) => {
 const [reset,setReset]= useReset();
  return (
    <div className="flex items-center justify-center">
      <div
        className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-35 transform ${
          isModalOpen ? "scale-100" : "scale-0"
        } transition-transform duration-300`}
      >
        {/* Modal content */}

        <div className="bg-white rounded-sm w-1/2 h-96 relative">
          <div
            onClick={handleCloseModal}
            className="cursor-pointer absolute top-3 left-6"
          >
            <CircleX />
          </div>
          <div className="flex items-center justify-center h-full">
          <InputOTP maxLength={6} 
              value={reset.otp}
                name="otp"
                onChange={(value) =>
                  setReset((prev) => {
                    return { ...prev, otp: value };
                  })
                }>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default ResetModal;

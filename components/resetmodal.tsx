"use client";
import { CircleX } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useReset } from "@/utils/state";
import { resetOtpVerify } from "@/app/actions";
import toast from "react-hot-toast";
import { useEffect } from "react";

interface Props {
  isModalOpen?: boolean;
  role:string
  handleCloseModal: () => void;
  handleReset: () => void;
}
const ResetModal = ({ isModalOpen, handleCloseModal, handleReset,role }: Props) => {
  const [reset, setReset] = useReset();

  async function handleSubmit() {
    const res = await resetOtpVerify(reset.email, reset.otp, role);
    if (res?.message === "valid") {
      handleReset();
      setTimeout(() => {
        handleCloseModal();
      }, 2000);
    } else if (res?.message === "invalid") {
      toast.error("the otp entered is invalid");
      setTimeout(() => {
        setReset((prev) => {
          return { ...prev, otp: "" };
        });
      }, 2000);
    }
  }
  useEffect(() => {
    if (reset.otp.length === 6) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset.otp.length]);
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
            <InputOTP
              maxLength={6}
              value={reset.otp}
              name="otp"
              onChange={(value) =>
                setReset((prev) => {
                  return { ...prev, otp: value };
                })
              }
            >
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

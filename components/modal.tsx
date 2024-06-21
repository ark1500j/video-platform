"use client";

import { CircleX } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAauth, useAuth, useLauth } from "@/utils/state";
import { useEffect } from "react";
import { OtpAdmin,  otpVerifyAction } from "@/app/actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Props {
  isModalOpen?: boolean;
  handleCloseModal: () => void;
}
const SignUpModal = ({ isModalOpen, handleCloseModal }: Props) => {
  const [auth, setAuth] = useAuth();
  const router = useRouter();

  async function handleOtpVerify() {
    const res = await otpVerifyAction(auth.otp, auth.email);
    if (res.message === "invalid") {
      toast.error("the otp entered is invalid");
      setTimeout(() => {
        setAuth((prev) => {
          return { ...prev, otp: "" };
        });
      }, 1000);
    } else if (res.message === "valid") {
      router.push("/video");
      setAuth((prev) => {
        return { ...prev, otp: "", password: "", email: "", username: "" };
      });
    }
  }

  useEffect(() => {
    if (auth.otp.length === 6) {
      handleOtpVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.otp.length, setAuth]);
  return (
    <div className="flex items-center justify-center relative z-50">
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
            <div
              className={`space-y-2 flex items-center justify-center flex-col ${
                false ? "hidden -translate-y-36 duration-2000" : ""
              }`}
            >
              <InputOTP
                maxLength={6}
                value={auth.otp}
                name="otp"
                onChange={(value) =>
                  setAuth((prev) => {
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
              <div className="text-center text-sm">
                {auth.otp === "" ? (
                  <>Enter your one-time password.</>
                ) : (
                  <>You entered: {auth.otp}</>
                )}
              </div>
            </div>
          </div>
          <div className="">
            a verifyication code has been sent to your email
          </div>
        </div>
      </div>
    </div>
  );
};

const SignInModal = ({ isModalOpen, handleCloseModal }: Props) => {
  const [auth, setAuth] = useLauth();

  const router = useRouter();

  async function handleOtpVerify() {
    const res = await otpVerifyAction(auth.otp, auth.email);
    if (res.message === "invalid") {
      toast.error("the otp entered is invalid");
      setTimeout(() => {
        setAuth((prev) => {
          return { ...prev, otp: "" };
        });
      }, 1000);
    } else if (res.message === "valid") {
      router.push("/video");
      setTimeout(() => {
        setAuth((prev) => {
          return { ...prev, otp: "", password: "", email: "" };
        });
      }, 2000);
    }
  }

  useEffect(() => {
    if (auth.otp.length === 6) {
      handleOtpVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.otp]);
  return (
    <div className="flex items-center justify-center relative z-50">
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
          <div className="flex items-center justify-center h-full flex-col">
            <div
              className={`space-y-2 flex items-center justify-center flex-col ${
                false ? "hidden -translate-y-36 duration-2000" : ""
              }`}
            >
              <InputOTP
                maxLength={6}
                value={auth.otp}
                name="otp"
                onChange={(value) =>
                  setAuth((prev) => {
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
              <div className="text-center text-sm">
                {auth.otp === "" ? (
                  <>Enter your one-time password.</>
                ) : (
                  <>You entered: {auth.otp}</>
                )}
              </div>
            </div>
            <div className="pt-6 text-sm text-neutral-400">
              a verifyication code has been sent to this email
            </div>
            {/* <div className="pt-2 text-sm text-neutral-400">
              Did not recieve email <span className="cursor-pointer">resend</span>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

function AdminSignModal({ isModalOpen, handleCloseModal }: Props) {
  
  const [aauth,setAauth]= useAauth()
  const router= useRouter()

  async function handleOtpVerify() {
    const res = await OtpAdmin(aauth.otp, aauth.email);
    if (res.message === "invalid") {
      toast.error("the otp entered is invalid");
      setTimeout(() => {
        setAauth((prev) => {
          return { ...prev, otp: "" };
        });
      }, 1000);
    } else if (res.message === "valid") {
      router.push("/admin/dashboard");
      setAauth((prev) => {
        return { ...prev, otp: "", password: "", email: "" };
      });
    }
  }

  useEffect(()=>{
    if(aauth.otp.length===6){
      handleOtpVerify();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[aauth.otp.length])
  return (
    <div className="flex items-center justify-center relative z-50">
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
            <div
              className={`space-y-2 flex items-center justify-center flex-col ${
                false ? "hidden -translate-y-36 duration-2000" : ""
              }`}
            >
              <InputOTP maxLength={6} 
              value={aauth.otp}
                name="otp"
                onChange={(value) =>
                  setAauth((prev) => {
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
              <div className="text-center text-sm">
                {aauth.otp === "" ? (
                  <>Enter your one-time password.</>
                ) : (
                  <>You entered:{aauth.otp} </>
                )}
              </div>
              <div className="text-neutral-400">
                a verifyication code has been sent to your email
              </div>
              {/* <div className="pt-2 text-sm text-neutral-400">
              Did not recieve email <span className="cursor-pointer">resend</span>
            </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { SignUpModal, SignInModal, AdminSignModal };

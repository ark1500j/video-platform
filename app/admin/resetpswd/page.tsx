"use client";
import { useReset } from "@/utils/state";
import { verifyAction } from "@/app/actions";
import ResetModal from "@/components/resetmodal";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import ResetFormCard from "@/components/restcard";

export default function Page() {
  const [close, setClose] = useState(false);
  const [resetkey, setResetKey] = useState(false);
  const [loading,setLoading]= useState(false)
  const [reset, setReset] = useReset();
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    setLoading(true)
    event.preventDefault();
    const response = await verifyAction(reset.email, "admin");
    if (response?.message === "valid") {
      setClose(true);
    } else if (response?.message === "invalid") {
      toast.error("email doesn't exist");
    }
    setLoading(false)
  }
  return (
    <>
      {resetkey ? (
        <ResetFormCard role="admin" />
      ) : (
        <div className="flex items-center justify-center h-screen">
          <div className="mx-auto max-w-lg">
            <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
              Please enter email for verifyication
            </p>

            <form
              className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
              onSubmit={handleSubmit}
            >
              <p className="text-center text-lg font-medium">Reset password</p>
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>

                <div className="relative">
                  <input
                    required
                    type="email"
                    name="email"
                    value={reset.email}
                    onChange={(e) => {
                      setReset((prev) => {
                        return { ...prev, email: e.target.value };
                      });
                    }}
                    className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                    placeholder="Enter email"
                  />

                  <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
              >
                {loading ? (
                  <div className="flex items-center justify-center w-full">
                    <div className="loader"></div>
                  </div>
                ) : (
                  "Verify"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
      <ResetModal
        isModalOpen={close}
        role="admin"
        handleCloseModal={() => {
          setClose(false);
        }}
        handleReset={() => {
          setResetKey(true);
        }}
      />
      <Toaster />
    </>
  );
}

"use client";
import { changePasswordAction } from "@/app/actions";
import { useReset } from "@/utils/state";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { useFormStatus } from "react-dom";

interface Props {
  role: string;
}
function Submit() {
  const status = useFormStatus();
  return (
    <button
      type="submit"
      className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
      disabled={status.pending}
    >
      {status.pending ? (
        <div className="flex items-center justify-center w-full">
          <div className="loader"></div>
        </div>
      ) : (
        "Reset Password"
      )}
    </button>
  );
}

export default function ResetFormCard({ role }: Props) {
  const [reset, setReset] = useReset();
  const router = useRouter();
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      event.currentTarget.password.value ===
      event.currentTarget.confirmpassword.value
    ) {
      const res = await changePasswordAction(
        reset.email,
        event.currentTarget.password.value,
        reset.otp,
        role
      );
      if (res?.message === "valid") {
        toast.success("password changed sucessfully");
        setTimeout(() => {
          setReset({ email: "", otp: "" });
          if (role === "user") {
            router.push("/");
          } else {
            router.push("/admin");
          }
        }, 1000);
      } else if (res?.message === "invalid") {
        toast.error("error changing password");
      }
    } else {
      toast.error("password doesn't match");
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="mx-auto max-w-lg">
        <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl"></h1>

        <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Obcaecati
          sunt dolores deleniti inventore quaerat mollitia?
        </p>

        <form
          onSubmit={handleSubmit}
          className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
        >
          <p className="text-center text-lg font-medium">rest password</p>

          <div>
            <label htmlFor="email" className="sr-only">
              password
            </label>

            <div className="relative">
              <input
                required
                type="password"
                name="password"
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                placeholder="Enter password"
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Confirm Password
            </label>

            <div className="relative">
              <input
                required
                type="password"
                name="confirmpassword"
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                placeholder="Confirm password"
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </span>
            </div>
          </div>
          <Submit />
        </form>
      </div>
    </div>
  );
}

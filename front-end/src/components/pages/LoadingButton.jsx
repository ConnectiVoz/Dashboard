import React from "react";
import { FaSpinner } from "react-icons/fa";

export default function LoadingButton({
  onClick,
  loading,
  disabled,
  children,
  className = "",
  ...props
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-medium transition
                  disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <FaSpinner className="animate-spin" />
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
}

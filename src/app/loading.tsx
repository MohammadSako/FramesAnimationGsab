import React from "react";
import { CircularProgress } from "@nextui-org/react";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center w-full">
      <CircularProgress color="primary" aria-label="Loading..." />
    </div>
  );
}

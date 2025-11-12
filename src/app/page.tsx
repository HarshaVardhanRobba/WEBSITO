// Page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const Page = () => {
  const trpc = useTRPC(); // get the trpc hooks from context
  const invoke = useMutation(trpc.invoke.mutationOptions({
    onSuccess: () => {
      toast.success("Invocation success")
    }
  }));

  return (
    <div className="text-3xl font-bold underline">
      <Button onClick={() => invoke.mutate({ text: "john" })}>Background</Button>
    </div>
  );
};

export default Page;

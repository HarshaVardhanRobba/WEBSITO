// Page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const Page = () => {
  const trpc = useTRPC(); // get the trpc hooks from context
  const [value, setValue] = useState("");
  const invoke = useMutation(trpc.invoke.mutationOptions({
    onSuccess: () => {
      toast.success("Invocation success")
    }
  }));

  return (
    <div className="text-3xl font-bold underline">
      <Input 
        value={value}
        onChange={(e) => setValue(e.target.value)} 
      />
      <Button onClick={() => invoke.mutate({ value: value })}>Background</Button>
    </div>
  );
};

export default Page;

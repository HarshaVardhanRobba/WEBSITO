// Page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const Page = () => {
  const trpc = useTRPC(); // get the trpc hooks from context
  const {data : messages } = useQuery(trpc.messages.getMany.queryOptions());
  const [value, setValue] = useState("");
  const createMessage = useMutation(trpc.messages.create.mutationOptions({
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
      <Button onClick={() => createMessage.mutate({ value: value })}>Background</Button>
      {JSON.stringify(messages, null, 2)}
    </div>
  );
};

export default Page;

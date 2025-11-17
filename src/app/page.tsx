// Page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

/**
 * Page component for creating a new project.
 *
 * This component uses the trpc client to create a new project when the submit button is clicked.
 * It also uses the useRouter hook to navigate to the newly created project page after successful creation.
 *
 * The component renders an input field for the project name and a submit button.
 * When the submit button is clicked, the createproject mutation is triggered with the current value of the input field.
 * If the mutation is successful, the component navigates to the newly created project page.
 * If the mutation fails, an error message is displayed using the toast library.
 */
const Page = () => {
  const router = useRouter();
  const trpc = useTRPC(); // get the trpc hooks from context

  const [value, setValue] = useState("");
  const createproject = useMutation(trpc.projects.create.mutationOptions({
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      router.push(`/projects/${data.id}`);
    },
  }));

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="max-w-7xl mx-auto flex items-center flex-col gap-y-4 justify-center">
      <Input 
        value={value}
        onChange={(e) => setValue(e.target.value)} 
      />
      <Button className="cursor-pointer" onClick={() => createproject.mutate({ value: value })}>
        Submit
      </Button>
    </div>
    </div>
  );
};

export default Page;

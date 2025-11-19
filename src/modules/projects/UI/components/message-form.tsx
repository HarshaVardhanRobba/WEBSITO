"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { FormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Props {
  projectId: string;
}

const formSchema = z.object({
  value: z
    .string()
    .min(1, "Message cannot be empty")
    .max(10000, "Message cannot be longer than 10,000 characters"),
});

function getErrorMessage(err: unknown): string {
  if (!err) return "Error";
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err && "message" in err) {
    try {
      return String((err as { message: unknown }).message);
    } catch {
      return "Error";
    }
  }
  return String(err);
}

export const MessageForm = ({ projectId }: Props) => {
  const trpc = useTRPC();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { value: "" },
    mode: "onChange",
  });

  const queryClient = useQueryClient();
  const createMessage = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: () => {
        form.reset();
        queryClient.invalidateQueries(
          trpc.messages.getMany.queryOptions({ projectId })
        );
      },
      // accept unknown (safer) and normalize message before using toast
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error));
        console.error(error);
      },
    })
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createMessage.mutateAsync({
      value: values.value,
      projectId,
    });
  };

  const [isFocused, setIsFocused] = useState(false);
  const showUsage = false;
  const isPending = createMessage.isPending;
  const isButtonDisabled = isPending || !form.formState.isValid;

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all",
          isFocused && "shadow-xs",
          showUsage && "rounded-t-none"
        )}
      >
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <TextareaAutosize
              {...field}
              disabled={isPending}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              minRows={2}
              maxRows={8}
              className="pt-4 resize-none bg-transparent outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="what you wanna build bro?"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  form.handleSubmit(onSubmit)();
                }
              }}
            />
          )}
        />
        <div className="flex gap-x-2 items-end justify-between pt-2">
          <div className="text-[10px] text-muted-foreground font-mono">
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 text-muted-foreground">
              <span>⌘</span> + <span>Enter</span>
            </kbd>
            &nbsp;to send
          </div>
          <Button
            disabled={isButtonDisabled}
            variant="ghost"
            className={cn(
              "h-8 w-8 rounded-full",
              isButtonDisabled && "bg-muted-foreground border"
            )}
            type="submit"
          >
            {isPending ? (
              <Loader2Icon className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowUpIcon className="cursor-pointer h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

import { Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { FormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import TextareaAutosize from 'react-textarea-autosize';
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
    value: z.string().min(1, "Message cannot be empty").max(10000, "Message cannot be longer than 10,000 characters"),
});

export const MessageForm = ({ projectId }: Props) => {
    
    const trpc = useTRPC();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            value: "",
        },
    });

    const queryclient = useQueryClient();
    const createMessage = useMutation(trpc.messages.create.mutationOptions(
        {
            onSuccess: () => {
                form.reset();
                queryclient.invalidateQueries(
                    trpc.messages.getMany.queryOptions({ projectId })
                );
            },
            onError: (error) => {
                toast.error(error.message);
                console.log(error);
            }
        }
    ));

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        await createMessage.mutateAsync({
            value: values.value,
            projectId: projectId
        });
    }
    
    const [isFocused, setisFocused] = useState(false);
    const showUsage = false;
    const isPending = createMessage.isPending;
    const isButtonDisabled = isPending || form.formState.isValid;
    

    return (
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn("relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all",
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
                            onFocus={() => setisFocused(true)}
                            onBlur={() => setisFocused(false)}
                            minRows={2}
                            maxRows={8}
                            className="pt-4 resize-none bg-transparent outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                            placeholder="what you wanna build bro?"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                                    e.preventDefault();
                                    form.handleSubmit(onSubmit)(e);
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
                        className={cn("size-8 rounded-full",
                            isButtonDisabled && "bg-muted-foreground border",
                        )} 
                        type="submit" 
                        >
                            {isPending ? (
                                <Loader2Icon className="size-4 animate-spin"/>
                            ) : (
                                <ArrowUpIcon className="cursur-pointer"/>
                            )}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
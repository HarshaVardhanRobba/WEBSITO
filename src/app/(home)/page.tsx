import { Hero } from "@/modules/home/ui/components/hero";
import { PromptComposer } from "@/modules/home/ui/components/prompt-composer";
import { UserProjects } from "@/modules/home/ui/components/user-projects";
import { HowItWorks } from "@/modules/home/ui/components/how-it-works";

export default function Page() {
  return (
    <>
      <Hero />
      <PromptComposer />
      <UserProjects />
      <HowItWorks />
    </>
  );
}

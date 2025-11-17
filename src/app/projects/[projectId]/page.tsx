import React from "react";

interface Props {
  params: {
    projectId: string;
  };
}

const Page = async ({ params }: Props) => {
  const { projectId } = params;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Project</h1>
      <p className="mt-2">project Id: {projectId}</p>
    </div>
  );
};

export default Page;

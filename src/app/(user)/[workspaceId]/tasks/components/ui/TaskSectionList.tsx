"use client";

import React from "react";
import { TaskSection, Task } from "@/features/task/types";
import { TaskSectionItem } from "./TaskSectionItem";
import { motion } from "framer-motion";

interface TaskSectionListProps {
  sections: TaskSection[];
  tasks: Task[];
  workspaceId: string;
  userId: string;
}

export function TaskSectionList({ sections, tasks, workspaceId, userId }: TaskSectionListProps) {
  const sortedSections = [...sections].sort((a, b) => a.sort_order - b.sort_order);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6 w-full"
    >
      {sortedSections.map((section) => (
        <motion.div key={section.id} variants={itemVariants} layout="position">
          <TaskSectionItem
            section={section}
            tasks={tasks.filter(t => t.section_id === section.id || (section.id === "uncategorized" && !t.section_id))}
            workspaceId={workspaceId}
            userId={userId}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
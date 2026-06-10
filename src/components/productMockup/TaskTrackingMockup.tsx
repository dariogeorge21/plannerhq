import { useState } from "react";
import { motion } from "framer-motion";
import { User, Clock } from "lucide-react";

type Task = {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  status: "todo" | "in-progress" | "done";
};

const initialTasks: Task[] = [
  { id: "1", title: "Design system update", assignee: "Emma", dueDate: "Mar 20", status: "todo" },
  { id: "2", title: "API integration", assignee: "Alex", dueDate: "Mar 22", status: "in-progress" },
  { id: "3", title: "User testing", assignee: "Sarah", dueDate: "Mar 18", status: "done" },
  { id: "4", title: "Write documentation", assignee: "John", dueDate: "Mar 25", status: "todo" },
  { id: "5", title: "Bug fixes", assignee: "Alex", dueDate: "Mar 19", status: "in-progress" },
];

export function TaskTrackingMockup() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const updateTaskStatus = (taskId: string, newStatus: Task["status"]) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const columns = {
    todo: { title: "To Do", color: "#EAEAEA", tasks: tasks.filter((t) => t.status === "todo") },
    "in-progress": { title: "In Progress", color: "#4F46E5", tasks: tasks.filter((t) => t.status === "in-progress") },
    done: { title: "Done", color: "#10B981", tasks: tasks.filter((t) => t.status === "done") },
  };

  return (
    <div className="rounded-2xl border border-[#EAEAEA] shadow-lg overflow-hidden bg-white p-3 h-[420px]">
      <div className="flex gap-3 h-full overflow-auto">
        {Object.entries(columns).map(([key, col]) => (
          <div key={key} className="flex-1 min-w-[140px] bg-[#FAFAFA] rounded-xl p-2 flex flex-col">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#111111]/60">
                {col.title}
              </span>
              <span className="text-xs bg-white px-1.5 py-0.5 rounded-full border border-[#EAEAEA]">
                {col.tasks.length}
              </span>
            </div>
            <div className="flex-1 space-y-2">
              {col.tasks.map((task) => (
                <motion.div
                  key={task.id}
                  whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                  className="bg-white rounded-lg border border-[#EAEAEA] p-2 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-medium text-[#111111]">{task.title}</h4>
                    <select
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task.id, e.target.value as Task["status"])}
                      className="text-[10px] border-none bg-transparent focus:outline-none cursor-pointer"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-[#111111]/50">
                    <User className="w-3 h-3" />
                    <span>{task.assignee}</span>
                    <Clock className="w-3 h-3 ml-1" />
                    <span>{task.dueDate}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

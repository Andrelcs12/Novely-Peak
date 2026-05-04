"use client";

import { useEffect, useState } from "react";
import { X, Loader2, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Goal, GoalFormState } from "@/app/types/goal";
import { api } from "@/lib/api";

import GoalFormFields from "./GoalFormFields";
import GoalTasksEditor from "./GoaltasksEditor";
import GoalsHelpModal from "./GoalsHelpModal";

export type { GoalFormState };

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  goal: Goal | null;
};

const EMPTY_FORM: GoalFormState = {
  title: "",
  description: "",
  priority: "MEDIUM",
  status: "ACTIVE",
  progress: 0,
  tasks: [],
};

export default function GoalModal({
  open,
  onClose,
  onSaved,
  goal,
}: Props) {
  const isEdit = !!goal;

  const [form, setForm] = useState<GoalFormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (goal) {
      setForm({
        title: goal.title,
        description: goal.description ?? "",
        priority: goal.priority,
        status: goal.status,
        progress: goal.progress,
        tasks: (goal.tasks ?? []).map((t) => ({
          id: t.id,
          title: t.title,
          description: t.description ?? "",
          status: t.status,
          priority: t.priority ?? "MEDIUM",
          dueDate: t.dueDate ?? "",
        })),
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [goal, open]);

  const handleChange = <K extends keyof GoalFormState>(
    field: K,
    value: GoalFormState[K]
  ) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleTaskChange = (tasks: GoalFormState["tasks"]) =>
    setForm((prev) => ({ ...prev, tasks }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (isEdit) {
        await api.patch(`/goals/${goal!.id}`, form);
      } else {
        await api.post("/goals", form);
      }

      onSaved();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">

          {/* BACKDROP */}
          <motion.div
            className="absolute inset-0 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* PANEL */}
          <motion.div
            initial={{ x: 500, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 500, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 30,
            }}
            className="
              relative
              w-full sm:w-[520px]
              h-full
              bg-zinc-950
              border-l border-zinc-800
              flex flex-col
              overflow-hidden
            "
          >

            {/* HEADER FIXO */}
            <div className="flex items-center justify-between p-5 border-b border-zinc-800 shrink-0">
              <div className="flex items-center gap-2">
                <div>
                  <h2 className="text-base font-semibold text-white">
                    {isEdit ? "Editar Meta" : "Nova Meta"}
                  </h2>
                  <p className="text-[11px] text-zinc-500">
                    Estruture sua meta com precisão
                  </p>
                </div>

                <button
                  onClick={() => setHelpOpen(true)}
                  className="p-1.5 rounded-full hover:bg-zinc-800"
                >
                  <HelpCircle size={16} className="text-zinc-400" />
                </button>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* BODY SCROLL */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">

              <GoalFormFields
                form={form}
                onChange={handleChange}
              />

              <div className="border-t border-zinc-800 pt-4">
                <GoalTasksEditor
                  tasks={form.tasks}
                  onChange={handleTaskChange}
                />
              </div>

            </div>

            {/* FOOTER FIXO */}
            <div className="p-5 border-t border-zinc-800 flex gap-3 justify-end shrink-0">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-zinc-400 hover:text-white"
              >
                Cancelar
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading || !form.title.trim()}
                className="px-5 py-2 text-sm bg-purple-600 hover:bg-purple-500 rounded-lg disabled:opacity-50"
              >
                {loading
                  ? "Salvando..."
                  : isEdit
                  ? "Salvar"
                  : "Criar"}
              </button>
            </div>
          </motion.div>

          {/* HELP */}
          <GoalsHelpModal
            open={helpOpen}
            onClose={() => setHelpOpen(false)}
          />
        </div>
      )}
    </AnimatePresence>
  );
}
"use client";

import { useEffect, useState } from "react";
import { X, Loader2, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Goal, GoalFormState } from "@/app/types/goal";
import { api } from "@/lib/api";

import GoalFormFields  from "./GoalFormFields";
import GoalTasksEditor from "./GoaltasksEditor";
import GoalsHelpModal from "./GoalsHelpModal";

// ─── Re-exporta GoalFormState do types para compatibilidade ──────────────────
// O tipo agora vem de @/app/types/goal — não duplicamos aqui.
export type { GoalFormState };

type Props = {
  open:    boolean;
  onClose: () => void;
  onSaved: () => void;
  goal:    Goal | null;
};

const EMPTY_FORM: GoalFormState = {
  title:       "",
  description: "",
  priority:    "MEDIUM",
  status:      "ACTIVE",
  progress:    0,
  tasks:       [],
};

export default function GoalModal({ open, onClose, onSaved, goal }: Props) {
  const isEdit = !!goal;
  const [form,    setForm]    = useState<GoalFormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (goal) {
      setForm({
        title:       goal.title,
        description: goal.description ?? "",
        priority:    goal.priority,
        status:      goal.status,
        progress:    goal.progress,
        // ─── CORREÇÃO: mapeia todos os campos obrigatórios ───────────────────
        tasks: (goal.tasks ?? []).map((t) => ({
          id:          t.id,
          title:       t.title,
          description: t.description ?? "",
          status:      t.status,
          priority:    t.priority    ?? "MEDIUM",   // campo obrigatório
          dueDate:     t.dueDate     ?? "",
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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          >
            <div className="w-full max-w-2xl max-h-[90vh] flex flex-col
                            bg-zinc-900 border border-zinc-800 rounded-2xl
                            shadow-[0_0_60px_rgba(139,92,246,0.1)] overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold text-white">
                      {isEdit ? "Editar Meta" : "Nova Meta"}
                    </h2>

                    {/* HELP BUTTON */}
                    <button
                      onClick={() => setHelpOpen(true)}
                      title="Como funcionam metas"
                      className="p-1.5 rounded-full hover:bg-zinc-800 transition cursor-pointer"
                    >
                      <HelpCircle size={16} className="text-zinc-400 hover:text-white" />
                    </button>
                  
                  </div>

                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    {isEdit
                      ? "Atualize os dados da sua meta"
                      : "Defina o que você quer alcançar"}
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                <GoalFormFields form={form} onChange={handleChange} />

                <div className="border-t border-zinc-800/60 pt-4">
                  <GoalTasksEditor
                    tasks={form.tasks}
                    onChange={handleTaskChange}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-800 shrink-0">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={loading || !form.title.trim()}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-medium
                             bg-purple-600 hover:bg-purple-500 text-white rounded-lg
                             transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading && <Loader2 size={14} className="animate-spin" />}
                  {loading
                    ? "Salvando..."
                    : isEdit
                    ? "Salvar alterações"
                    : "Criar meta"}
                </button>
              </div>
            </div>
          </motion.div>

            {/* HELP MODAL */}
          <GoalsHelpModal
            open={helpOpen}
            onClose={() => setHelpOpen(false)}
          />
        </>
      )}
    </AnimatePresence>
  );
}
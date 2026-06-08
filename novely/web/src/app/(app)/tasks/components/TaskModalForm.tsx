"use client";

import { useState } from "react";
import {
  X,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
  Flag,
  Brain,
  Trash2,
  HelpCircle,
  AlignLeft,
  Type,
  ListChecks,
  Link2,
  Circle,
  Plus,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TaskStatus, TaskPriority, ChecklistItem, TaskLinkItem } from "@/types/task";

type Props = {
  title: string;
  setTitle: (v: string) => void;

  description: string;
  setDescription: (v: string) => void;

  dueDate: string;
  setDueDate: (v: string) => void;

  estimatedTime: number | "";
  setEstimatedTime: (v: number | "") => void;

  priority: TaskPriority;
  setPriority: (v: TaskPriority) => void;

  status: TaskStatus;
  toggleStatus: () => void;

  checklist: ChecklistItem[];
  setChecklist: (v: ChecklistItem[]) => void;

  links: TaskLinkItem[];
  setLinks: (v: TaskLinkItem[]) => void;

  isEdit: boolean;
  handleSubmit: () => void;
  handleDelete: () => void;

  loading: boolean;
  error: string | null;

  isGeneric: boolean;
  isOverdue: boolean;
  qualityLabel: string;

  onOpenHelp: () => void;
  onClose: () => void;
};

// ─── Constants ───────────────────────────────────────────────────────────────

const PRIORITY_CONFIG = [
  {
    key: "LOW" as TaskPriority,
    label: "Baixa",
    active: "bg-blue-500/15 border-blue-500/40 text-blue-400",
    idle: "bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-400",
  },
  {
    key: "MEDIUM" as TaskPriority,
    label: "Média",
    active: "bg-yellow-500/15 border-yellow-500/40 text-yellow-400",
    idle: "bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-400",
  },
  {
    key: "HIGH" as TaskPriority,
    label: "Alta",
    active: "bg-red-500/15 border-red-500/40 text-red-400",
    idle: "bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-400",
  },
] as const;

const STATUS_ICON_COLOR: Record<TaskStatus, string> = {
  TODO: "text-zinc-600",
  IN_PROGRESS: "text-yellow-400",
  DONE: "text-green-400",
};

const STATUS_NEXT_LABEL: Record<TaskStatus, string> = {
  TODO: "Mudar para: Em Progresso",
  IN_PROGRESS: "Mudar para: Concluída",
  DONE: "Reabrir tarefa (voltar para To-Do)",
};

const QUALITY_COLOR: Record<string, string> = {
  Ótima: "text-green-400",
  Boa: "text-yellow-400",
  Ok: "text-orange-400",
  Fraca: "text-red-400",
};

const INPUT_CLS =
  "w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm outline-none " +
  "focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 " +
  "hover:border-zinc-700 transition placeholder:text-zinc-600 text-zinc-200";

// ─── Main component ───────────────────────────────────────────────────────────

export default function TaskModalForm({
  title = "",
  setTitle,
  description = "",
  setDescription,
  dueDate,
  setDueDate,
  estimatedTime,
  setEstimatedTime,
  priority,
  setPriority,
  status,
  toggleStatus,
  checklist,
  setChecklist,
  links,
  setLinks,
  isEdit,
  handleSubmit,
  handleDelete,
  loading,
  error,
  isGeneric,
  isOverdue,
  onOpenHelp,
  qualityLabel,
  onClose,
}: Props) {
  // ── Checklist local state ──
  const [newCheckItem, setNewCheckItem] = useState("");

  // ── Links local state ──
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [showLinkForm, setShowLinkForm] = useState(false);

  // ── Checklist handlers ──
  const handleToggleCheck = (id: string) => {
    setChecklist(checklist.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  };

  const handleAddCheckItem = () => {
    const trimmed = newCheckItem.trim();
    if (!trimmed) return;
    setChecklist([...checklist, { id: crypto.randomUUID(), title: trimmed, done: false }]);
    setNewCheckItem("");
  };

  const handleDeleteCheckItem = (id: string) => {
    setChecklist(checklist.filter((i) => i.id !== id));
  };

  // ── Links handlers ──
  const handleAddLink = () => {
    const t = newLinkTitle.trim();
    const u = newLinkUrl.trim();
    if (!t || !u) return;
    setLinks([...links, { title: t, url: u }]);
    setNewLinkTitle("");
    setNewLinkUrl("");
    setShowLinkForm(false);
  };

  const handleDeleteLink = (idx: number) => {
    setLinks(links.filter((_, i) => i !== idx));
  };

  const checklistDone = checklist.filter((i) => i.done).length;
  const checklistProgress = checklist.length > 0 ? (checklistDone / checklist.length) * 100 : 0;

  return (
    <div className="bg-zinc-900 rounded-2xl md:rounded-none border border-zinc-800 md:border-0 p-6 space-y-5 w-full max-h-[90vh] overflow-y-auto select-none">

      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-zinc-100">
              {isEdit ? "Editar tarefa" : "Nova tarefa"}
            </h2>
            <button
              type="button"
              onClick={onOpenHelp}
              title="Como criar boas tarefas"
              className="p-1.5 cursor-pointer rounded-full hover:bg-zinc-800 transition"
            >
              <HelpCircle size={16} className="text-zinc-500 hover:text-white transition" />
            </button>
          </div>
          <p className="text-xs text-zinc-600 mt-0.5">Clareza aumenta execução</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 cursor-pointer rounded-full hover:bg-zinc-800 transition text-zinc-400 hover:text-zinc-200"
        >
          <X size={16} />
        </button>
      </div>

      {/* ALERTS */}
      {error && (
        <Alert color="red" icon={<AlertCircle size={13} />}>{error}</Alert>
      )}
      {isGeneric && (
        <Alert color="yellow" icon={<AlertCircle size={13} />}>
          Tarefa genérica. Especifique melhor para evitar a procrastinação.
        </Alert>
      )}
      {isOverdue && (
        <Alert color="red" icon={<AlertCircle size={13} />}>
          Essa tarefa está atrasada. Redefina o prazo se necessário.
        </Alert>
      )}

      {/* QUALITY SCORE */}
      {title?.trim() && (
        <div className="flex items-center justify-between text-xs bg-zinc-950 border border-zinc-800 px-3 py-2.5 rounded-xl">
          <span className="flex items-center gap-1.5 text-zinc-500">
            <Brain size={12} />
            Qualidade da tarefa
          </span>
          <span className={`font-semibold ${QUALITY_COLOR[qualityLabel] ?? "text-zinc-400"}`}>
            {qualityLabel}
          </span>
        </div>
      )}

      {/* TITLE */}
      <Field
        label="O que exatamente você vai fazer?"
        icon={<Type size={12} />}
        hint="Ação clara + tempo definido = maior taxa de conclusão."
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Ex: Refatorar webhooks de split do Asaas"
          className={INPUT_CLS}
        />
      </Field>

      {/* DESCRIPTION */}
      <Field label="Por que isso importa? (Contexto)" icon={<AlignLeft size={12} />}>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex: Evitar falhas no recebimento de notificações de pagamento"
          rows={3}
          className={`${INPUT_CLS} resize-none`}
        />
      </Field>

      {/* DATE & TIME */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Prazo" icon={<Calendar size={12} />}>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={`${INPUT_CLS} [color-scheme:dark]`}
          />
        </Field>
        <Field label="Tempo estimado (min)" icon={<Clock size={12} />}>
          <input
            type="number"
            placeholder="Ex: 45"
            min={1}
            max={600}
            value={estimatedTime}
            onChange={(e) => setEstimatedTime(e.target.value ? Number(e.target.value) : "")}
            className={INPUT_CLS}
          />
        </Field>
      </div>

      {/* PRIORITY */}
      <Field label="Prioridade" icon={<Flag size={12} />}>
        <div className="flex gap-2">
          {PRIORITY_CONFIG.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setPriority(p.key)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium border transition cursor-pointer ${
                priority === p.key ? p.active : p.idle
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </Field>

      {/* CHECKLIST */}
      <section className="space-y-3 pt-1 border-t border-zinc-800/60">
        <div className="flex items-center gap-2">
          <ListChecks size={13} className="text-purple-400" />
          <h3 className="text-xs font-semibold text-zinc-400">
            Subtarefas
          </h3>
          {checklist.length > 0 && (
            <span className="text-xs text-zinc-600 ml-auto">
              {checklistDone}/{checklist.length} concluídas
            </span>
          )}
        </div>

        {/* Progress bar */}
        {checklist.length > 0 && (
          <div className="h-1 rounded-full bg-zinc-800 overflow-hidden">
            <motion.div
              className="h-full bg-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${checklistProgress}%` }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
          </div>
        )}

        {/* Items list */}
        <div className="space-y-0.5">
          <AnimatePresence initial={false}>
            {checklist.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="flex items-center gap-2 group px-2 py-1.5 rounded-lg hover:bg-zinc-800/50 transition"
              >
                <button
                  type="button"
                  onClick={() => handleToggleCheck(item.id)}
                  className="shrink-0 text-zinc-500 hover:text-purple-400 transition"
                >
                  {item.done
                    ? <CheckCircle2 size={15} className="text-green-400" />
                    : <Circle size={15} />
                  }
                </button>
                <span className={`flex-1 text-sm ${item.done ? "line-through text-zinc-600" : "text-zinc-300"}`}>
                  {item.title}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteCheckItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 transition text-zinc-600 hover:text-red-400 cursor-pointer"
                >
                  <Trash2 size={12} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Add item input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newCheckItem}
            onChange={(e) => setNewCheckItem(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); handleAddCheckItem(); }
            }}
            placeholder="Adicionar subtarefa..."
            className={`${INPUT_CLS} text-xs py-1.5`}
          />
          <button
            type="button"
            onClick={handleAddCheckItem}
            disabled={!newCheckItem.trim()}
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 rounded-xl transition cursor-pointer"
          >
            <Plus size={14} className="text-white" />
          </button>
        </div>
      </section>

      {/* LINKS */}
      <section className="space-y-3 pt-1 border-t border-zinc-800/60">
        <div className="flex items-center gap-2">
          <Link2 size={13} className="text-blue-400" />
          <h3 className="text-xs font-semibold text-zinc-400">Links</h3>
          {links.length > 0 && (
            <span className="text-xs text-zinc-600">{links.length}</span>
          )}
          <button
            type="button"
            onClick={() => setShowLinkForm((v) => !v)}
            className="ml-auto text-xs text-zinc-500 hover:text-white flex items-center gap-1 transition cursor-pointer"
          >
            <Plus size={12} />
            Adicionar
          </button>
        </div>

        {/* Link list */}
        <div className="space-y-1.5">
          <AnimatePresence initial={false}>
            {links.map((link, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 group px-3 py-2 rounded-xl bg-zinc-800/40 border border-zinc-800 hover:border-zinc-700 transition"
              >
                <Link2 size={12} className="text-blue-400 shrink-0" />
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-xs text-zinc-300 hover:text-white truncate flex items-center gap-1 transition"
                >
                  {link.title}
                  <ExternalLink size={10} className="text-zinc-600 shrink-0" />
                </a>
                <button
                  type="button"
                  onClick={() => handleDeleteLink(idx)}
                  className="opacity-0 group-hover:opacity-100 transition text-zinc-600 hover:text-red-400 shrink-0 cursor-pointer"
                >
                  <Trash2 size={12} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {links.length === 0 && !showLinkForm && (
            <p className="text-[11px] text-zinc-700 italic px-1">Nenhum link adicionado.</p>
          )}
        </div>

        {/* Add link form */}
        <AnimatePresence>
          {showLinkForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 overflow-hidden"
            >
              <input
                type="text"
                value={newLinkTitle}
                onChange={(e) => setNewLinkTitle(e.target.value)}
                placeholder="Título do link"
                className={`${INPUT_CLS} text-xs py-1.5`}
              />
              <input
                type="url"
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); handleAddLink(); }
                }}
                placeholder="https://..."
                className={`${INPUT_CLS} text-xs py-1.5`}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAddLink}
                  disabled={!newLinkTitle.trim() || !newLinkUrl.trim()}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 rounded-xl text-xs font-medium text-white transition cursor-pointer"
                >
                  Salvar link
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLinkForm(false);
                    setNewLinkTitle("");
                    setNewLinkUrl("");
                  }}
                  className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs text-zinc-400 transition cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* STATUS TOGGLE (edit only) */}
      {isEdit && (
        <div className="pt-1 border-t border-zinc-800/60">
          <button
            type="button"
            onClick={toggleStatus}
            className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition cursor-pointer"
          >
            <CheckCircle2 size={15} className={STATUS_ICON_COLOR[status]} />
            {STATUS_NEXT_LABEL[status]}
          </button>
        </div>
      )}

      {/* ACTIONS */}
      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!title?.trim() || loading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed
          transition py-2.5 rounded-xl text-sm font-semibold text-white active:scale-[0.99] cursor-pointer
          shadow-lg shadow-purple-900/20"
        >
          {loading ? "Salvando..." : isEdit ? "Salvar alterações" : "Criar tarefa"}
        </button>

        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 text-red-400 border border-red-500/10 rounded-xl py-2.5 text-sm font-medium hover:bg-red-500/10 transition cursor-pointer disabled:opacity-40"
          >
            <Trash2 size={14} />
            Excluir tarefa
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Field({
  label,
  icon,
  hint,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
        {icon && <span className="text-zinc-600">{icon}</span>}
        {label}
      </label>
      {children}
      {hint && <p className="text-[10px] text-zinc-600">{hint}</p>}
    </div>
  );
}

function Alert({
  color,
  icon,
  children,
}: {
  color: "red" | "yellow";
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const styles = {
    red: "text-red-400 bg-red-500/10 border-red-500/20",
    yellow: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  };
  return (
    <div className={`flex items-center gap-2 text-xs border px-3 py-2 rounded-lg ${styles[color]}`}>
      {icon}
      {children}
    </div>
  );
}
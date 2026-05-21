"use client";

import { useState } from "react";
import { Task, ChecklistItem, TaskLinkItem } from "@/app/types/task";
import {
  X,
  CheckCircle2,
  Circle,
  Calendar,
  Timer,
  Tag,
  Link2,
  Plus,
  Trash2,
  ExternalLink,
  ListChecks,
  Clock,
  Flag,
  AlignLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  task: Task | null;
  onClose: () => void;
  onUpdateChecklist: (taskId: string, checklist: ChecklistItem[]) => Promise<void>;
  onUpdateLinks: (taskId: string, links: TaskLinkItem[]) => Promise<void>;
};

const PRIORITY_STYLE: Record<string, string> = {
  HIGH: "text-red-400 bg-red-500/10 border-red-500/20",
  MEDIUM: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  LOW: "text-blue-400 bg-blue-500/10 border-blue-500/20",
};

const PRIORITY_LABEL: Record<string, string> = {
  HIGH: "Alta",
  MEDIUM: "Média",
  LOW: "Baixa",
};

const STATUS_LABEL: Record<string, string> = {
  TODO: "A fazer",
  IN_PROGRESS: "Em progresso",
  DONE: "Concluída",
};

const STATUS_STYLE: Record<string, string> = {
  TODO: "text-zinc-400 bg-zinc-800/60 border-zinc-700",
  IN_PROGRESS: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  DONE: "text-green-400 bg-green-500/10 border-green-500/20",
};

export default function TaskExpandedPanel({
  task,
  onClose,
  onUpdateChecklist,
  onUpdateLinks,
}: Props) {
  // --- Checklist state ---
  const [newCheckItem, setNewCheckItem] = useState("");
  const [savingChecklist, setSavingChecklist] = useState(false);

  // --- Links state ---
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [savingLinks, setSavingLinks] = useState(false);
  const [showLinkForm, setShowLinkForm] = useState(false);

  if (!task) return null;

  const checklist: ChecklistItem[] = Array.isArray(task.checklist) ? task.checklist : [];
  const links: TaskLinkItem[] = Array.isArray(task.links) ? task.links : [];

  const checklistDone = checklist.filter((i) => i.done).length;
  const checklistProgress = checklist.length > 0 ? (checklistDone / checklist.length) * 100 : 0;

  // CHECKLIST HANDLERS
  const handleToggleCheck = async (itemId: string) => {
    setSavingChecklist(true);
    const updated = checklist.map((i) =>
      i.id === itemId ? { ...i, done: !i.done } : i
    );
    await onUpdateChecklist(task.id, updated);
    setSavingChecklist(false);
  };

  const handleAddCheckItem = async () => {
    const trimmed = newCheckItem.trim();
    if (!trimmed) return;
    setSavingChecklist(true);
    const updated: ChecklistItem[] = [
      ...checklist,
      { id: crypto.randomUUID(), title: trimmed, done: false },
    ];
    await onUpdateChecklist(task.id, updated);
    setNewCheckItem("");
    setSavingChecklist(false);
  };

  const handleDeleteCheckItem = async (itemId: string) => {
    setSavingChecklist(true);
    const updated = checklist.filter((i) => i.id !== itemId);
    await onUpdateChecklist(task.id, updated);
    setSavingChecklist(false);
  };

  // LINKS HANDLERS
  const handleAddLink = async () => {
    const title = newLinkTitle.trim();
    const url = newLinkUrl.trim();
    if (!title || !url) return;
    setSavingLinks(true);
    const updated: TaskLinkItem[] = [...links, { title, url }];
    await onUpdateLinks(task.id, updated);
    setNewLinkTitle("");
    setNewLinkUrl("");
    setShowLinkForm(false);
    setSavingLinks(false);
  };

  const handleDeleteLink = async (index: number) => {
    setSavingLinks(true);
    const updated = links.filter((_, i) => i !== index);
    await onUpdateLinks(task.id, updated);
    setSavingLinks(false);
  };

  return (
    <AnimatePresence>
      {task && (
        <>
          {/* BACKDROP */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* PANEL */}
          <motion.div
            className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-zinc-900 border-l border-zinc-800 flex flex-col"
            initial={{ x: 460, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 460, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
          >
            {/* SCROLLABLE CONTENT */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* HEADER */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500 font-medium tracking-wide uppercase">
                  Detalhes da tarefa
                </span>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-zinc-800 transition text-zinc-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              {/* TITLE & DESCRIPTION */}
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-white leading-snug">
                  {task.title}
                </h2>
                {task.description && (
                  <p className="text-sm text-zinc-400 leading-relaxed flex gap-2">
                    <AlignLeft size={14} className="mt-0.5 shrink-0 text-zinc-600" />
                    {task.description}
                  </p>
                )}
              </div>

              {/* BADGES: STATUS & PRIORITY */}
              <div className="flex flex-wrap gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_STYLE[task.status]}`}
                >
                  <CheckCircle2 size={12} />
                  {STATUS_LABEL[task.status]}
                </span>

                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${PRIORITY_STYLE[task.priority]}`}
                >
                  <Flag size={12} />
                  {PRIORITY_LABEL[task.priority]}
                </span>
              </div>

              {/* META INFO */}
              <div className="grid grid-cols-2 gap-3">
                <MetaCard
                  icon={<Calendar size={13} />}
                  label="Prazo"
                  value={
                    task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString("pt-BR")
                      : "—"
                  }
                />
                <MetaCard
                  icon={<Clock size={13} />}
                  label="Tempo estimado"
                  value={task.estimatedTime ? `${task.estimatedTime} min` : "—"}
                />
                <MetaCard
                  icon={<Timer size={13} />}
                  label="Foco acumulado"
                  value={task.focusTime ? `${task.focusTime} min` : "—"}
                  highlight
                />
                <MetaCard
                  icon={<Calendar size={13} />}
                  label="Concluída em"
                  value={
                    task.completedAt
                      ? new Date(task.completedAt).toLocaleDateString("pt-BR")
                      : "—"
                  }
                />
              </div>

              {/* DURATION */}
              {task.completedAt && task.createdAt && (
                <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-zinc-800/40 border border-zinc-800 text-sm">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <Timer size={13} />
                    Duração total
                  </span>
                  <span className="text-blue-400 font-medium">
                    {Math.floor(
                      (new Date(task.completedAt).getTime() -
                        new Date(task.createdAt).getTime()) /
                        60000
                    )}{" "}
                    min
                  </span>
                </div>
              )}

              {/* ─── CHECKLIST ─── */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                    <ListChecks size={15} className="text-purple-400" />
                    Checklist
                    {checklist.length > 0 && (
                      <span className="text-xs text-zinc-500 font-normal">
                        {checklistDone}/{checklist.length}
                      </span>
                    )}
                  </h3>
                </div>

                {/* Progress bar */}
                {checklist.length > 0 && (
                  <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                    <motion.div
                      className="h-full bg-purple-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${checklistProgress}%` }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  </div>
                )}

                {/* Items */}
                <div className="space-y-1.5">
                  <AnimatePresence initial={false}>
                    {checklist.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        className="flex items-center gap-2.5 group px-2 py-1.5 rounded-lg hover:bg-zinc-800/50 transition"
                      >
                        <button
                          onClick={() => handleToggleCheck(item.id)}
                          disabled={savingChecklist}
                          className="shrink-0 text-zinc-500 hover:text-purple-400 transition disabled:opacity-40"
                        >
                          {item.done ? (
                            <CheckCircle2 size={16} className="text-green-400" />
                          ) : (
                            <Circle size={16} />
                          )}
                        </button>
                        <span
                          className={`flex-1 text-sm ${
                            item.done
                              ? "line-through text-zinc-600"
                              : "text-zinc-300"
                          }`}
                        >
                          {item.title}
                        </span>
                        <button
                          onClick={() => handleDeleteCheckItem(item.id)}
                          disabled={savingChecklist}
                          className="opacity-0 group-hover:opacity-100 transition text-zinc-600 hover:text-red-400 disabled:opacity-40"
                        >
                          <Trash2 size={13} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Add item */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCheckItem}
                    onChange={(e) => setNewCheckItem(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddCheckItem()}
                    placeholder="Adicionar item..."
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 placeholder:text-zinc-600 text-zinc-200 transition"
                  />
                  <button
                    onClick={handleAddCheckItem}
                    disabled={!newCheckItem.trim() || savingChecklist}
                    className="px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 rounded-lg transition"
                  >
                    <Plus size={14} className="text-white" />
                  </button>
                </div>
              </section>

              {/* ─── LINKS ─── */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                    <Link2 size={15} className="text-blue-400" />
                    Links
                    {links.length > 0 && (
                      <span className="text-xs text-zinc-500 font-normal">
                        {links.length}
                      </span>
                    )}
                  </h3>
                  <button
                    onClick={() => setShowLinkForm((v) => !v)}
                    className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition"
                  >
                    <Plus size={13} />
                    Adicionar
                  </button>
                </div>

                {/* Link list */}
                <div className="space-y-2">
                  <AnimatePresence initial={false}>
                    {links.map((link, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-2 group px-3 py-2 rounded-lg bg-zinc-800/40 border border-zinc-800 hover:border-zinc-700 transition"
                      >
                        <Link2 size={13} className="text-blue-400 shrink-0" />
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-sm text-zinc-300 hover:text-white truncate flex items-center gap-1.5 transition"
                        >
                          {link.title}
                          <ExternalLink size={11} className="text-zinc-600 shrink-0" />
                        </a>
                        <button
                          onClick={() => handleDeleteLink(idx)}
                          disabled={savingLinks}
                          className="opacity-0 group-hover:opacity-100 transition text-zinc-600 hover:text-red-400 disabled:opacity-40 shrink-0"
                        >
                          <Trash2 size={13} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {links.length === 0 && !showLinkForm && (
                    <p className="text-xs text-zinc-600 italic px-1">
                      Nenhum link adicionado ainda.
                    </p>
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
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 placeholder:text-zinc-600 text-zinc-200 transition"
                      />
                      <input
                        type="url"
                        value={newLinkUrl}
                        onChange={(e) => setNewLinkUrl(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddLink()}
                        placeholder="https://..."
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 placeholder:text-zinc-600 text-zinc-200 transition"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleAddLink}
                          disabled={!newLinkTitle.trim() || !newLinkUrl.trim() || savingLinks}
                          className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 rounded-lg text-xs font-medium text-white transition"
                        >
                          Salvar link
                        </button>
                        <button
                          onClick={() => {
                            setShowLinkForm(false);
                            setNewLinkTitle("");
                            setNewLinkUrl("");
                          }}
                          className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs text-zinc-400 transition"
                        >
                          Cancelar
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>

              {/* ─── FOOTER META ─── */}
              <div className="pt-2 border-t border-zinc-800 space-y-1.5 text-xs text-zinc-600">
                <div className="flex justify-between">
                  <span>Criada em</span>
                  <span className="text-zinc-500">
                    {new Date(task.createdAt).toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Atualizada em</span>
                  <span className="text-zinc-500">
                    {new Date(task.updatedAt).toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>ID</span>
                  <span className="text-zinc-700 font-mono">{task.id}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── SUB-COMPONENT ───────────────────────────────────────────────────────────
function MetaCard({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="px-3 py-2.5 rounded-xl bg-zinc-800/40 border border-zinc-800 space-y-1">
      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
        {icon}
        {label}
      </div>
      <div
        className={`text-sm font-medium ${highlight ? "text-purple-400" : "text-zinc-200"}`}
      >
        {value}
      </div>
    </div>
  );
}
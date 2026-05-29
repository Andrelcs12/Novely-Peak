"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  X,
  Link2,
  Star,
  Save,
  Globe,
  FileText,
  Video,
  Brain,
  Wrench,
  Folder,
  CheckSquare,
  Loader2,
} from "lucide-react";

import { FaGithub, FaXTwitter } from "react-icons/fa6";

import { api } from "@/lib/api";

type LinkType =
  | "ARTICLE"
  | "VIDEO"
  | "DOCUMENT"
  | "TOOL"
  | "TWITTER"
  | "GITHUB"
  | "OTHER";

type Goal = {
  id: string;
  title: string;
};

type Task = {
  id: string;
  title: string;
};

interface LinkData {
  id: string;

  title?: string;
  description?: string;

  url: string;

  type: LinkType;

  notes?: string;

  isFavorite: boolean;

  goalId?: string | null;
  taskId?: string | null;
}

interface FormState {
  title: string;
  description: string;
  url: string;
  type: LinkType;
  notes: string;
  isFavorite: boolean;
  goalId: string;
  taskId: string;
}

interface Props {
  open: boolean;

  onClose: () => void;
  onSaved: () => void;

  initialData?: LinkData | null;
}

const LINK_TYPES: {
  value: LinkType;
  label: string;
  icon: any;
}[] = [
  {
    value: "ARTICLE",
    label: "Artigo",
    icon: FileText,
  },

  {
    value: "VIDEO",
    label: "Vídeo",
    icon: Video,
  },

  {
    value: "DOCUMENT",
    label: "Documento",
    icon: FileText,
  },

  {
    value: "TOOL",
    label: "Ferramenta",
    icon: Wrench,
  },

  {
    value: "TWITTER",
    label: "Twitter/X",
    icon: FaXTwitter,
  },

  {
    value: "GITHUB",
    label: "Github",
    icon: FaGithub,
  },

  {
    value: "OTHER",
    label: "Outro",
    icon: Link2,
  },
];

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  url: "",
  type: "ARTICLE",
  notes: "",
  isFavorite: false,
  goalId: "",
  taskId: "",
};

export default function LinkCreateModal({
  open,
  onClose,
  onSaved,
  initialData,
}: Props) {
  const isEditing = !!initialData;

  const [form, setForm] =
    useState<FormState>(EMPTY_FORM);

  const [goals, setGoals] =
    useState<Goal[]>([]);

  const [tasks, setTasks] =
    useState<Task[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);


  useEffect(() => {
    if (!open) return;

    if (initialData) {
      setForm({
        title: initialData.title || "",
        description:
          initialData.description || "",

        url: initialData.url || "",

        type:
          initialData.type || "ARTICLE",

        notes: initialData.notes || "",

        isFavorite:
          initialData.isFavorite || false,

        goalId:
          initialData.goalId || "",

        taskId:
          initialData.taskId || "",
      });
    } else {
      setForm(EMPTY_FORM);
    }

    setError(null);
  }, [open, initialData]);

  useEffect(() => {
    if (!open) return;

    (async () => {
      try {
        const [gRes, tRes] =
          await Promise.all([
            api.get("/goals"),
            api.get("/tasks"),
          ]);

        setGoals(gRes.data ?? []);
        setTasks(tRes.data ?? []);
      } catch {}
    })();
  }, [open]);

  useEffect(() => {
    if (isEditing) return;

    const u = form.url.toLowerCase();

    if (u.includes("github")) {
      setForm((p) => ({
        ...p,
        type: "GITHUB",
      }));
    } else if (
      u.includes("youtube") ||
      u.includes("youtu.be") ||
      u.includes("vimeo")
    ) {
      setForm((p) => ({
        ...p,
        type: "VIDEO",
      }));
    } else if (
      u.includes("twitter") ||
      u.includes("x.com")
    ) {
      setForm((p) => ({
        ...p,
        type: "TWITTER",
      }));
    }
  }, [form.url, isEditing]);

  const domain = useMemo(() => {
    try {
      return new URL(form.url).hostname;
    } catch {
      return null;
    }
  }, [form.url]);

  const set =
    (key: keyof FormState) =>
    (val: any) => {
      setForm((p) => ({
        ...p,
        [key]: val,
      }));
    };

  const handleSubmit = async () => {
    if (!form.url.trim()) {
      setError("URL obrigatória");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload = {
        title:
          form.title || undefined,

        description:
          form.description || undefined,

        url: form.url,

        type: form.type,

        notes:
          form.notes || undefined,

        isFavorite:
          form.isFavorite,

        goalId:
          form.goalId || undefined,

        taskId:
          form.taskId || undefined,
      };

      if (isEditing) {
        await api.patch(
          `/links/${initialData.id}`,
          payload
        );
      } else {
        await api.post(
          "/links",
          payload
        );
      }

      onSaved();
      onClose();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Erro ao salvar link."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;

    try {
      setLoading(true);

      await api.delete(
        `/links/${initialData.id}`
      );

      onSaved();
      onClose();
    } catch {
      setError(
        "Erro ao deletar link."
      );
    } finally {
      setLoading(false);
    }
  };

  const Body = (
    <div className="flex h-full flex-col">
      {/* HEADER */}

      <div className="flex items-center justify-between border-b border-zinc-800 px-6">
        <div className="flex items-center gap-3 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 shrink-0">
            <Link2
              size={18}
              className="text-violet-400"
            />
          </div>

          <div>
            <h2 className="text-base font-semibold text-white leading-tight">
              {isEditing
                ? "Editar link"
                : "Novo link"}
            </h2>

            <p className="text-xs text-zinc-500 mt-0.5">
              Salve conteúdos e referências
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
        >
          <X size={16} />
        </button>
      </div>

      {/* BODY */}

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        {/* URL */}

        <div className="space-y-2">
          <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            URL *
          </label>

          <div
            className={`flex items-center gap-3 rounded-2xl border px-4 h-12
            ${
              error &&
              !form.url.trim()
                ? "border-red-500/40 bg-red-500/5"
                : "border-zinc-800 bg-zinc-900 focus-within:border-violet-500/40"
            } transition`}
          >
            <Globe
              size={15}
              className="text-zinc-500 shrink-0"
            />

            <input
              value={form.url}
              onChange={(e) =>
                set("url")(
                  e.target.value
                )
              }
              placeholder="https://..."
              className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
            />
          </div>

          {domain && (
            <a
              href={form.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block truncate pl-1 text-[11px] text-zinc-500 underline underline-offset-4 transition hover:text-white"
            >
              {domain}
            </a>
          )}
        </div>

        {/* TÍTULO */}

        <div className="space-y-2">
          <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            Título
          </label>

          <input
            value={form.title}
            onChange={(e) =>
              set("title")(
                e.target.value
              )
            }
            placeholder="Ex: Guia definitivo de produtividade profunda"
            className="h-12 w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-violet-500/40 transition"
          />
        </div>

        {/* DESCRIÇÃO */}

        <div className="space-y-2">
          <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            Descrição
          </label>

          <textarea
            value={form.description}
            onChange={(e) =>
              set("description")(
                e.target.value
              )
            }
            rows={3}
            placeholder="Resumo rápido do conteúdo"
            className="w-full resize-none rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-violet-500/40 transition"
          />
        </div>

        {/* Tipo */}

<div className="space-y-2">
  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
    Tipo
  </label>

  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
    {LINK_TYPES.map(
      ({
        value,
        label,
        icon: Icon,
      }) => {
        const active =
          form.type === value;

        return (
          <button
            key={value}
            type="button"
            onClick={() =>
              set("type")(value)
            }
            className={`flex items-center gap-2 rounded-xl border p-3 transition text-left
            ${
              active
                ? "border-violet-500/40 bg-violet-500/10 text-violet-300"
                : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-white"
            }`}
          >
            <Icon size={15} />

            <span className="text-xs font-medium">
              {label}
            </span>
          </button>
        );
      }
    )}
  </div>
</div>

{/* META + TASK */}

<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
  <div className="space-y-2">
    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
      Meta
    </label>

    <div className="flex items-center gap-2.5 h-12 rounded-2xl border border-zinc-800 bg-zinc-900 px-4">
      <Folder
        size={14}
        className="text-zinc-500 shrink-0"
      />

      <select
        value={form.goalId}
        onChange={(e) =>
          set("goalId")(
            e.target.value
          )
        }
        className="flex-1 bg-transparent text-sm text-white outline-none cursor-pointer"
      >
        <option
          value=""
          className="bg-zinc-900"
        >
          Nenhuma
        </option>

        {goals.map((goal) => (
          <option
            key={goal.id}
            value={goal.id}
            className="bg-zinc-900"
          >
            {goal.title}
          </option>
        ))}
      </select>
    </div>
  </div>

  <div className="space-y-2">
    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
      Tarefa
    </label>

    <div className="flex items-center gap-2.5 h-12 rounded-2xl border border-zinc-800 bg-zinc-900 px-4">
      <CheckSquare
        size={14}
        className="text-zinc-500 shrink-0"
      />

      <select
        value={form.taskId}
        onChange={(e) =>
          set("taskId")(
            e.target.value
          )
        }
        className="flex-1 bg-transparent text-sm text-white outline-none cursor-pointer"
      >
        <option
          value=""
          className="bg-zinc-900"
        >
          Nenhuma
        </option>

        {tasks.map((task) => (
          <option
            key={task.id}
            value={task.id}
            className="bg-zinc-900"
          >
            {task.title}
          </option>
        ))}
      </select>
    </div>
  </div>
</div>

{/* NOTAS */}

<div className="space-y-2">
  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
    Notas pessoais
  </label>

  <textarea
    value={form.notes}
    onChange={(e) =>
      set("notes")(
        e.target.value
      )
    }
    rows={4}
    placeholder="Insights, ideias, aprendizados, observações..."
    className="w-full resize-none rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-violet-500/40 transition"
  />
</div>

{/* FAVORITAR */}

<button
  type="button"
  onClick={() =>
    set("isFavorite")(
      !form.isFavorite
    )
  }
  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 transition
  ${
    form.isFavorite
      ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
      : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700"
  }`}
>
  <div className="flex items-center gap-3">
    <Star
      size={15}
      className={
        form.isFavorite
          ? "fill-yellow-400 text-yellow-400"
          : ""
      }
    />

    <span className="text-sm font-medium">
      Favoritar link
    </span>
  </div>

  <div
    className={`h-2 w-2 rounded-full
    ${
      form.isFavorite
        ? "bg-yellow-400"
        : "bg-zinc-700"
    }`}
  />
</button>

{/* IA */}

<div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4">
  <div className="flex items-start gap-3">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
      <Brain
        size={16}
        className="text-violet-400"
      />
    </div>

    <div>
      <p className="text-sm font-medium text-white">
        IA integrada
      </p>

      <p className="mt-1 text-xs leading-relaxed text-zinc-400">
        Após salvar, a IA poderá gerar
        resumo, tags inteligentes,
        insights e tempo estimado de
        leitura automaticamente.
      </p>
    </div>
  </div>
</div>

{/* ERRO */}

{error && (
  <motion.p
    initial={{
      opacity: 0,
      y: -4,
    }}
    animate={{
      opacity: 1,
      y: 0,
    }}
    className="text-xs text-center text-red-400"
  >
    {error}
  </motion.p>
)}


      </div>

      {/* FOOTER */}

      <div className="flex items-center gap-3 border-t border-zinc-800 px-6 py-3">
        {isEditing && (
          <button
            onClick={handleDelete}
            className="h-11 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 text-sm font-medium text-red-300 hover:bg-red-500/20 transition"
          >
            Deletar
          </button>
        )}

        <button
          onClick={onClose}
          className="h-11 flex-1 rounded-2xl border border-zinc-800 bg-zinc-900 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition"
        >
          Cancelar
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-violet-600 hover:bg-violet-500 text-sm font-semibold text-white transition disabled:opacity-40"
        >
          {loading ? (
            <Loader2
              size={15}
              className="animate-spin"
            />
          ) : (
            <Save size={15} />
          )}

          {loading
            ? "Salvando..."
            : isEditing
            ? "Salvar alterações"
            : "Salvar link"}
        </button>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={onClose}
          />

          <motion.div
            className="fixed top-0 right-0 z-50 h-full w-full max-w-lg"
            initial={{
              x: "100%",
            }}
            animate={{
              x: 0,
            }}
            exit={{
              x: "100%",
            }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 28,
            }}
          >
            <div className="h-full border-l border-zinc-800 bg-zinc-950 overflow-hidden">
              {Body}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
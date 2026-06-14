import React from "react";

type EmptyAction = {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
  icon?: React.ReactNode;
  disabled?: boolean;
};

type EmptyProps = {
  image: string;
  title: string;
  description: string;
  actions?: EmptyAction[];
};

export default function Empty({
  image,
  title,
  description,
  actions = [],
}: EmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {/* IMAGE */}
      <img
        src={image}
        alt={title}
        className="w-[560px] max-w-full mb-8 select-none pointer-events-none"
      />

      {/* TITLE */}
      <h2 className="text-2xl md:text-3xl font-bold text-white">
        {title}
      </h2>

      {/* DESCRIPTION */}
      <p className="mt-3 text-zinc-400 max-w-md leading-relaxed">
        {description}
      </p>

      {/* ACTIONS */}
      {actions.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              disabled={action.disabled}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 font-medium ${
                action.variant === "secondary"
                  ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                  : "bg-purple-600 hover:bg-purple-500 text-white"
              } ${
                action.disabled
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
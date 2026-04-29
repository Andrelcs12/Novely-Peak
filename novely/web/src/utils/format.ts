import { DisciplineLevel, UserGoal, WorkStyle } from "@/app/types/onboarding";


function formatGoal(goal: UserGoal | null | undefined) {
  switch (goal) {
    case "WORK":
      return "Trabalho";
    case "STUDY":
      return "Estudos";
    case "PROJECTS":
      return "Projetos";
    case "LIFE":
      return "Vida pessoal";
    default:
      return "Não definido";
  }
}

function formatWorkStyle(style: WorkStyle | null | undefined) {
  switch (style) {
    case "MINIMAL":
      return "Minimalista";
    case "BALANCED":
      return "Equilibrado";
    case "STRUCTURED":
      return "Estruturado";
    default:
      return "Não definido";
  }
}

function formatDiscipline(level: DisciplineLevel | null | undefined) {
  switch (level) {
    case "LOW":
      return "Baixa";
    case "MEDIUM":
      return "Média";
    case "HIGH":
      return "Alta";
    default:
      return "Não definido";
  }
}
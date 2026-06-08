"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, CheckSquare, Target, LinkIcon,
  User as UserIcon, UserPlus, Settings, LogOut,
  Crown, User2, MoreHorizontal, Pencil, Trash2,
} from "lucide-react";
import { User } from "@/types/user";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
  SidebarGroupContent, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarMenuAction, SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV_ITEMS = [
  { label: "Painel",  href: "/dashboard", icon: LayoutDashboard },
  { label: "Tarefas", href: "/tasks",     icon: CheckSquare     },
  { label: "Metas",   href: "/goals",     icon: Target          },
  { label: "Links",   href: "/links",     icon: LinkIcon        },
  { label: "Perfil",  href: "/profile",   icon: UserIcon        },
];

const SETTINGS_ITEMS = [
  { label: "Convidar Amigos", href: "/invite",      icon: UserPlus           },
  { label: "Configurações",   href: "/settings",    icon: Settings           },
  { label: "Sair",            href: "/auth/logout", icon: LogOut, alert: true },
];

type Props = { user: User };

export default function AppSidebar({ user }: Props) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-1 py-1">
          <img src="/logo.png" className="w-8 h-8 shrink-0" />
          <span className="text-sm font-bold group-data-[state=collapsed]:hidden">
            Novely Peak
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>

        {/* Nav principal */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.href)}
                      tooltip={item.label}
                    >
                      <Link href={item.href}>
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>

                    {/* Exemplo: menu de ações no hover — só aparece em itens que têm ações */}
                    {item.href === "/tasks" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuAction showOnHover>
                            <MoreHorizontal size={14} />
                          </SidebarMenuAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" align="start" className="w-44">
                          <DropdownMenuItem>
                            <Pencil size={14} className="mr-2" />
                            Nova tarefa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-400 focus:text-red-300 focus:bg-red-500/10">
                            <Trash2 size={14} className="mr-2" />
                            Limpar concluídas
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings — separado com borda e empurrado pro fundo */}
        <SidebarGroup className="mt-auto border-t border-sidebar-border pt-2">
          <SidebarGroupContent>
            <SidebarMenu>
              {SETTINGS_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.label}
                      isActive={!item.alert && isActive(item.href)}
                      className={item.alert
                        ? "text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        : undefined}
                    >
                      <Link href={item.href}>
                        <Icon size={18} className={item.alert ? "text-red-400" : ""} />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      <SidebarFooter>
        <div className="group-data-[state=collapsed]:hidden px-1 mb-2">
          <div className="relative overflow-hidden p-4 rounded-xl border border-purple-500/20 bg-gradient-to-br from-zinc-900 to-zinc-950">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-600/20 blur-2xl rounded-full" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                <Crown size={16} />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Novely Pro</div>
                <div className="text-xs text-zinc-400">Desbloqueie insights avançados</div>
              </div>
            </div>
            <p className="text-xs text-zinc-400 mt-3 relative z-10 leading-relaxed">
              Acompanhe sua performance, receba sugestões inteligentes e evolua.
            </p>
            <button className="mt-4 w-full py-2 rounded-lg text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-all shadow-md shadow-purple-600/20">
              Fazer upgrade
            </button>
          </div>
        </div>

        {/* Usuário com dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 p-2 w-full rounded-xl bg-zinc-900/60 border border-zinc-800 hover:bg-zinc-800/60 transition-colors">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-purple-600 bg-zinc-800 flex items-center justify-center shrink-0">
                {user?.avatar ? (
                  <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : user?.name ? (
                  <span className="text-xs text-purple-400 font-semibold">{user.name[0]}</span>
                ) : (
                  <User2 size={16} className="text-zinc-500" />
                )}
              </div>
              <div className="flex flex-col text-left group-data-[state=collapsed]:hidden">
                <span className="text-sm font-semibold text-white">{user?.name || "Usuário"}</span>
                <span className="text-xs text-purple-400 truncate max-w-[120px]">@{user?.email || "username"}</span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-52 mb-1">
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <UserIcon size={14} className="mr-2" />
                Ver perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings size={14} className="mr-2" />
                Configurações
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/auth/logout" className="text-red-400 focus:text-red-300 focus:bg-red-500/10">
                <LogOut size={14} className="mr-2" />
                Sair
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </SidebarFooter>
    </Sidebar>
  );
}
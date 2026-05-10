"use client";

import { useEffect, useMemo, useState } from "react";

import { api } from "@/lib/api";

import LinksHeader from "./components/LinksHeader";
import LinksStats from "./components/LinksStats";
import LinksInsights from "./components/LinksInsights";
import LinksList from "./components/LinksList";
import LinkCreateModal from "./components/LinkCreateModal";

import { Link, LinkType } from "./types/link";

export default function LinksPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);

  const [openCreate, setOpenCreate] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState<LinkType | "ALL">("ALL");

  const loadLinks = async () => {
    try {
      setLoading(true);

      const res = await api.get("/links");

      setLinks(res.data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLinks();
  }, []);

  const filteredLinks = useMemo(() => {
    return links.filter((link) => {
      const matchesSearch =
        !search ||
        link.title
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        link.domain
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesType =
        filter === "ALL" ||
        link.type === filter;

      return (
        matchesSearch &&
        matchesType &&
        !link.isArchived
      );
    });
  }, [links, search, filter]);

  return (
    <div className="space-y-6 pb-10">
      <LinksHeader
        total={filteredLinks.length}
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        onCreate={() =>
          setOpenCreate(true)
        }
      />

      <LinksStats links={links} />

      <LinksInsights links={links} />

      <LinksList
        links={filteredLinks}
        loading={loading}
        onReload={loadLinks}
      />

      <LinkCreateModal
        open={openCreate}
        onClose={() =>
          setOpenCreate(false)
        }
        onSaved={loadLinks}
      />
    </div>
  );
}
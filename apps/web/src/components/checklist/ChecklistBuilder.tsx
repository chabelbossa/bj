"use client";

import { useMemo, useState } from "react";
import {
  generateProcedureChecklist,
  getChecklistProgress,
  type ChecklistItem,
  type ChecklistProfile,
  type Procedure,
} from "@dossierbj/core";

type ItemStatusMap = Record<string, ChecklistItem["status"]>;

const profileOptions = ["Citoyen", "Entrepreneur", "PME", "Diaspora", "Consultant"];

export function ChecklistBuilder({ procedure }: { procedure: Procedure }) {
  const [profile, setProfile] = useState<ChecklistProfile>({
    userType: procedure.targetUsers[0],
    urgency: "unknown",
    alreadyHasDocuments: false,
    needsOfficialVerification: true,
  });
  const [itemStatuses, setItemStatuses] = useState<ItemStatusMap>({});

  const checklist = useMemo(
    () => generateProcedureChecklist(procedure, profile),
    [procedure, profile],
  );
  const items = checklist.items.map((item) => ({
    ...item,
    status: itemStatuses[item.id] ?? item.status,
  }));
  const progress = getChecklistProgress(items);

  function updateStatus(itemId: string, done: boolean) {
    setItemStatuses((current) => ({
      ...current,
      [itemId]: done ? "done" : "todo",
    }));
  }

  return (
    <section className="rounded-md border border-line bg-surface p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Checklist personnalisée</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Générée localement depuis la fiche et ses sources. Elle sert à préparer les
            vérifications, pas à remplacer la liste officielle.
          </p>
        </div>
        <span className="rounded-sm bg-[#e6f2ec] px-2 py-1 text-xs font-semibold text-brand-strong">
          {progress}% terminé
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        <label className="text-sm font-semibold" htmlFor="checklist-profile">
          Profil
        </label>
        <select
          id="checklist-profile"
          value={profile.userType ?? ""}
          onChange={(event) =>
            setProfile((current) => ({
              ...current,
              userType: event.target.value,
            }))
          }
          className="min-h-11 rounded-md border border-line bg-background px-3"
        >
          {profileOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <label className="text-sm font-semibold" htmlFor="checklist-urgency">
          Urgence
        </label>
        <select
          id="checklist-urgency"
          value={profile.urgency}
          onChange={(event) =>
            setProfile((current) => ({
              ...current,
              urgency: event.target.value as ChecklistProfile["urgency"],
            }))
          }
          className="min-h-11 rounded-md border border-line bg-background px-3"
        >
          <option value="unknown">À préciser</option>
          <option value="normal">Normal</option>
          <option value="soon">Bientôt</option>
        </select>

        <label className="flex items-start gap-3 rounded-md border border-line bg-background p-3 text-sm">
          <input
            type="checkbox"
            checked={Boolean(profile.alreadyHasDocuments)}
            onChange={(event) =>
              setProfile((current) => ({
                ...current,
                alreadyHasDocuments: event.target.checked,
              }))
            }
            className="mt-1"
          />
          <span>J&apos;ai déjà des documents prêts</span>
        </label>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-sm bg-background">
        <div className="h-full bg-brand" style={{ width: `${progress}%` }} />
      </div>

      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item.id} className="rounded-md border border-line bg-background p-3">
            <label className="flex gap-3 text-sm leading-6">
              <input
                type="checkbox"
                checked={item.status === "done"}
                onChange={(event) => updateStatus(item.id, event.target.checked)}
                className="mt-1"
              />
              <span>{item.label}</span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}

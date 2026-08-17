import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/dal";
import InviteUserForm from "@/components/admin/InviteUserForm";
import { toggleUserActive, changeUserRole, deleteUser } from "./actions";

export const metadata: Metadata = { title: "Usuarios" };
export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const me = await requireAdmin();
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="max-w-3xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Usuarios</h1>
        <p className="mt-1 text-sm text-warm-gray">
          Quién puede acceder al panel. El acceso es por enlace mágico (sin contraseñas).
        </p>
      </header>

      <div className="mb-6">
        <InviteUserForm />
      </div>

      <div className="overflow-hidden rounded-2xl border border-cream-deep bg-white">
        <ul className="divide-y divide-cream-deep">
          {users.map((u) => {
            const isSelf = u.id === me.id;
            return (
              <li key={u.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate">
                    {u.name ?? "—"}
                    {isSelf && <span className="ml-2 text-xs font-normal text-warm-gray">(tú)</span>}
                  </p>
                  <p className="truncate text-xs text-warm-gray">{u.email}</p>
                </div>

                {!u.isActive && (
                  <span className="rounded-full bg-cream-deep px-2.5 py-1 text-xs font-semibold text-warm-gray">
                    Inactivo
                  </span>
                )}

                {/* Rol */}
                {isSelf ? (
                  <span className="rounded-full bg-sage-light/50 px-2.5 py-1 text-xs font-semibold text-slate">
                    {u.role === "ADMIN" ? "Admin" : "Editor"}
                  </span>
                ) : (
                  <form action={changeUserRole}>
                    <input type="hidden" name="id" value={u.id} />
                    <select
                      name="role"
                      defaultValue={u.role}
                      className="rounded-lg border border-cream-deep bg-white px-2 py-1 text-xs font-semibold text-slate"
                    >
                      <option value="EDITOR">Editor</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                    <button type="submit" className="ml-1 rounded-lg border border-cream-deep px-2 py-1 text-xs font-semibold text-slate hover:bg-cream-deep/50">
                      Guardar
                    </button>
                  </form>
                )}

                {!isSelf && (
                  <>
                    <form action={toggleUserActive}>
                      <input type="hidden" name="id" value={u.id} />
                      <button type="submit" className="rounded-lg border border-cream-deep px-2.5 py-1 text-xs font-semibold text-slate hover:bg-cream-deep/50">
                        {u.isActive ? "Desactivar" : "Activar"}
                      </button>
                    </form>
                    <form action={deleteUser}>
                      <input type="hidden" name="id" value={u.id} />
                      <button type="submit" className="rounded-lg px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50">
                        Borrar
                      </button>
                    </form>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

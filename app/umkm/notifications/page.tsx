import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Bell, BellOff, FileText, Shield, Sparkles, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const typeIconMap: Record<string, typeof Bell> = {
  NEW_QUOTATION: FileText,
  VERIFICATION_UPDATE: Shield,
  AI_RECOMMENDATION: Sparkles,
  RFQ_UPDATE: FileText,
  PROJECT_UPDATE: CheckCircle,
};

function groupByDate(notifications: { createdAt: Date; [k: string]: unknown }[]) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
  const groups: Record<string, typeof notifications> = { "Hari Ini": [], "Kemarin": [], "Lebih Lama": [] };
  for (const n of notifications) {
    const d = new Date(n.createdAt); d.setHours(0, 0, 0, 0);
    if (d >= today) groups["Hari Ini"].push(n);
    else if (d >= yesterday) groups["Kemarin"].push(n);
    else groups["Lebih Lama"].push(n);
  }
  return groups;
}

export default async function UMKMNotificationsPage() {
  const session = await auth();
  const notifications = session?.user?.id
    ? await db.notification.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 50,
      })
    : [];

  const unread = notifications.filter(n => !n.read).length;
  const groups = groupByDate(notifications);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Notifikasi</h1>
          <p className="text-sm text-slate-500 mt-1">{unread > 0 ? `${unread} belum dibaca` : "Semua sudah dibaca"}</p>
        </div>
        {unread > 0 && (
          <form action={async () => { "use server"; }}>
            <Badge className="bg-emerald-100 text-emerald-700">{unread} baru</Badge>
          </form>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="py-20 text-center">
          <BellOff className="mx-auto h-14 w-14 text-slate-200 mb-4" />
          <h3 className="font-semibold text-slate-700">Tidak ada notifikasi</h3>
          <p className="text-sm text-slate-500 mt-1">Notifikasi akan muncul di sini saat ada update</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groups).map(([group, items]) => {
            if (items.length === 0) return null;
            return (
              <div key={group}>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">{group}</h2>
                <div className="space-y-2">
                  {items.map((n) => {
                    const Icon = typeIconMap[n.type as string] ?? Bell;
                    return (
                      <Card key={n.id as string} className={`border-0 shadow-sm transition-colors ${!n.read ? "bg-emerald-50/50" : ""}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${!n.read ? "bg-emerald-100" : "bg-slate-100"}`}>
                              <Icon className={`h-4 w-4 ${!n.read ? "text-emerald-600" : "text-slate-400"}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className={`text-sm font-medium ${!n.read ? "text-slate-900" : "text-slate-700"}`}>{n.title as string}</p>
                                {!n.read && <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />}
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">{n.body as string}</p>
                              <p className="text-xs text-slate-400 mt-1">{new Date(n.createdAt as Date).toLocaleString("id-ID")}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

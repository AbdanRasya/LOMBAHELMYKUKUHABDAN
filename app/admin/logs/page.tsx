import { db } from "@/lib/db";
import { Activity, ShieldAlert, Terminal, Clock, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const mockLogs = [
  { id: "1", action: "USER_LOGIN", user: { name: "Rasya", role: "ADMIN" }, entity: "User", entityId: "admin-1", ipAddress: "127.0.0.1", createdAt: new Date() },
  { id: "2", action: "CREATE_RFQ", user: { name: "PT. Krakatau Steel", role: "COMPANY" }, entity: "RFQ", entityId: "rfq-983", ipAddress: "182.1.34.8", createdAt: new Date(Date.now() - 3600000) },
  { id: "3", action: "APPROVE_UMKM", user: { name: "Rasya", role: "ADMIN" }, entity: "UmkmProfile", entityId: "umkm-22", ipAddress: "127.0.0.1", createdAt: new Date(Date.now() - 7200000) },
  { id: "4", action: "SUBMIT_QUOTATION", user: { name: "CV. Logam Sejahtera", role: "UMKM" }, entity: "Quotation", entityId: "quot-12", ipAddress: "36.88.192.5", createdAt: new Date(Date.now() - 14400000) },
];

function actionBadge(action: string) {
  const map: Record<string, string> = {
    USER_LOGIN: "bg-purple-100 text-purple-700",
    CREATE_RFQ: "bg-blue-100 text-blue-700",
    APPROVE_UMKM: "bg-emerald-100 text-emerald-700",
    SUBMIT_QUOTATION: "bg-orange-100 text-orange-700",
  };
  return <Badge className={`${map[action] || "bg-slate-100 text-slate-700"} border-0 capitalize font-mono text-[10px]`}>{action.toLowerCase()}</Badge>;
}

export default async function AdminLogsPage() {
  const realLogs = await db.systemLog.findMany({
    include: { user: { select: { name: true, role: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const logs = realLogs.length > 0 ? realLogs : mockLogs;

  return (
    <div className="space-y-6 text-slate-900">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Audit Log Sistem</h1>
        <p className="text-sm text-slate-500">Rekam aktivitas audit keamanan dan tindakan pengguna di platform</p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Terminal className="h-4 w-4 text-blue-600" />
            Aktivitas Terkini
          </CardTitle>
          <CardDescription>Menampilkan 100 aktivitas terakhir</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Waktu</TableHead>
                <TableHead>Aktor (Role)</TableHead>
                <TableHead>Tindakan</TableHead>
                <TableHead>Objek</TableHead>
                <TableHead>ID Objek</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map(log => (
                <TableRow key={log.id}>
                  <TableCell className="text-xs text-slate-400">{new Date(log.createdAt).toLocaleString("id-ID")}</TableCell>
                  <TableCell className="font-semibold">
                    <div>
                      <p>{log.user?.name || "System"}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">{log.user?.role || "SYSTEM"}</p>
                    </div>
                  </TableCell>
                  <TableCell>{actionBadge(log.action)}</TableCell>
                  <TableCell className="font-mono text-xs">{log.entity || "-"}</TableCell>
                  <TableCell className="font-mono text-xs text-slate-400">{log.entityId || "-"}</TableCell>
                  <TableCell className="font-mono text-xs">{log.ipAddress || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import NotificationsView from "@/components/notifications/notifications-view";

export default async function CompanyNotificationsPage() {
  const session = await auth();
  const notifications = session?.user?.id
    ? await db.notification.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 50,
      })
    : [];

  return (
    <NotificationsView
      initialNotifications={notifications}
      themeColor="blue"
    />
  );
}

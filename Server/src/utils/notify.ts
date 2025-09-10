// utils/notify.ts
import { prisma } from "../config/db.js";
import { sendEmail } from "./email.js"; 

export async function notifyUser(userId: string, message: string, email?: boolean) {
  // 1. Save to DB
  await prisma.notification.create({
    data: {
      message,
      userId,
    },
  });

  // 2. Optionally also send email
  if (email) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.email) {
      await sendEmail(user.email, "Notification", message);
    }
  }
}

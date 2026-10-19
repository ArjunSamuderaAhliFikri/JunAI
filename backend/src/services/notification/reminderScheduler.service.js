/** @format */

const cron = require("node-cron");
const { prisma } = require("../../config/database");
const { dispatchNotification } = require("./notificationDispatcher.service");

let scheduledTask = null;

/**
 * Check and trigger due reminders.
 * Runs every minute to find reminders whose timeline_activity is now or in the past 1 minute.
 */
const checkDueReminders = async () => {
  try {
    const now = new Date();
    // Look for reminders due in the last 2 minutes that haven't been notified yet
    const windowStart = new Date(now.getTime() - 2 * 60 * 1000);

    const dueReminders = await prisma.reminder.findMany({
      where: {
        is_deleted: false,
        timeline_activity: {
          gte: windowStart,
          lte: now,
        },
      },
      include: {
        user: true,
      },
    });

    for (const reminder of dueReminders) {
      // Check if notification already dispatched for this reminder
      const existing = await prisma.notification.findFirst({
        where: {
          user_id: reminder.user_id,
          title: `Reminder: ${reminder.title}`,
        },
      });

      if (!existing) {
        console.log(`⏰ [Scheduler] Triggering reminder: "${reminder.title}" for user ${reminder.user_id}`);
        await dispatchNotification({
          title: `Reminder: ${reminder.title}`,
          message: `Pengingat [${reminder.type}]: ${reminder.title} dijadwalkan pada ${reminder.timeline_activity.toLocaleString("id-ID")}`,
          type: "MEETING_REMINDER",
          userId: reminder.user_id,
          sendDiscord: true,
        });
      }
    }
  } catch (error) {
    // If DB is not connected yet, quietly log warning
    console.warn("⚠️ [Scheduler] Check reminders skipped:", error.message);
  }
};

/**
 * Start the reminder cron scheduler.
 * Runs every minute (* * * * *).
 */
const startReminderScheduler = () => {
  if (scheduledTask) {
    console.log("ℹ️ [Scheduler] Reminder scheduler already running.");
    return;
  }

  // Cron schedule: every minute
  scheduledTask = cron.schedule("* * * * *", async () => {
    await checkDueReminders();
  });

  console.log("⏰ [Scheduler] Reminder scheduler started (running every minute).");
};

/**
 * Stop the reminder cron scheduler.
 */
const stopReminderScheduler = () => {
  if (scheduledTask) {
    scheduledTask.stop();
    scheduledTask = null;
    console.log("⏹️ [Scheduler] Reminder scheduler stopped.");
  }
};

module.exports = {
  startReminderScheduler,
  stopReminderScheduler,
  checkDueReminders,
};

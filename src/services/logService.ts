import { writeFile, readFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { stringify } from "csv-stringify/sync";
import type { EmailLog } from "../types";

class LogService {
  private logs: EmailLog[] = [];
  private logFilePath = "./logs/email-logs.json";

  constructor() {
    this.initializeLogsDirectory();
    this.loadLogs();
  }

  private async initializeLogsDirectory() {
    if (!existsSync("./logs")) {
      await mkdir("./logs", { recursive: true });
    }
  }

  private async loadLogs() {
    try {
      if (existsSync(this.logFilePath)) {
        const data = await readFile(this.logFilePath, "utf-8");
        this.logs = JSON.parse(data);
      }
    } catch (error) {
      console.error("Error loading logs:", error);
    }
  }

  private async saveLogs() {
    try {
      await writeFile(this.logFilePath, JSON.stringify(this.logs, null, 2));
    } catch (error) {
      console.error("Error saving logs:", error);
    }
  }

  addLog(log: EmailLog) {
    this.logs.push(log);
    this.saveLogs();
  }

  getLogs(userId: string): EmailLog[] {
    return this.logs.filter((log) => log.userId === userId);
  }

  getLogsAsCSV(userId: string): string {
    const userLogs = this.logs.filter((log) => log.userId === userId);
    return stringify(userLogs, {
      header: true,
      columns: [
        "id",
        "email",
        "status",
        "message",
        "timestamp",
        "messageId",
        "firstName",
        "company",
        "subject",
      ],
    });
  }

  getLogsAsJSON(userId: string): string {
    const userLogs = this.logs.filter((log) => log.userId === userId);
    return JSON.stringify(userLogs, null, 2);
  }

  clearLogs(userId: string) {
    this.logs = this.logs.filter((log) => log.userId !== userId);
    this.saveLogs();
  }

  getStats(userId: string) {
    const userLogs = this.logs.filter((log) => log.userId === userId);
    const total = userLogs.length;
    const sent = userLogs.filter((log) => log.status === "Sent").length;
    const failed = userLogs.filter((log) => log.status === "Failed").length;
    const errors = userLogs.filter((log) => log.status === "Error").length;

    return { total, sent, failed, errors };
  }
}

export const logService = new LogService();

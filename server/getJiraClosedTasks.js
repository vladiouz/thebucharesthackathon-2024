import axios from "axios";
import { GenerateInvoiceDescriptionService } from "./generateInvoiceDescription";
import "dotenv/config";


const minResolvedString = "%22%20AND%20resolved%20%3E%20%22";
const maxResolvedString = "%22%20AND%20resolved%20%3C%20%22";
const endingString = "%22";

const baseJiraUrl =
  "https://ionescupv.atlassian.net/rest/api/2/search?jql=status%20=%20%22Done";
const apiEmail = "ionescupv@gmail.com";

export const DEV_IDS = ["712020:d48c6fe4-f0f7-4569-99d6-1844285b5fde"];
export const DESIGNER_IDS = ["70121:a70cc62c-2816-4b23-99d6-b76894895223"];
export const DEV_RATE_PER_HOUR = 15;
export const DESIGNER_RATE_PER_HOUR = 12;

export class GetJiraClosedTasksService {
  static async getClosedTasks(startDate, endDate) {
    console.log(startDate, endDate);
    const processedJiraUrl =
      baseJiraUrl +
      (startDate ? `${minResolvedString}${startDate}` : "") +
      (endDate ? `${maxResolvedString}${endDate}` : "") +
      endingString;


    const response = (
      await axios
        .get(processedJiraUrl, {
          auth: {
            username: apiEmail,
            password: process.env.JIRA_API_TOKEN2,
          },
          headers: {
            "Content-Type": "application/json",
          },
        })
        .catch((error) => {
          console.log("Error", error);
        })
    )?.data;

    console.log(response);

    const processedTasks = await ProcessClosedTasksService.processTasks(
      response
    );

    return processedTasks;
  }
}

class ProcessClosedTasksService {
  static async processTasks(tasks) {
    const processedTasks = {
      tasks: this.processTasksObjects(tasks?.issues),
    };
    processedTasks.hoursSpent = {
      dev: processedTasks?.tasks?.reduce(
        (prev, currTask) =>
          prev + (currTask?.assignee?.role === "dev" ? currTask?.timeSpent : 0),
        0,
      ),
      design: processedTasks?.tasks?.reduce(
        (prev, currTask) =>
          prev +
          (currTask?.assignee?.role === "design" ? currTask?.timeSpent : 0),
        0,
      ),
    };
    processedTasks.cost = {
      dev: processedTasks?.hoursSpent?.dev * DEV_RATE_PER_HOUR,
      design: processedTasks?.hoursSpent?.design * DESIGNER_RATE_PER_HOUR,
      total:
        processedTasks?.hoursSpent?.dev * DEV_RATE_PER_HOUR +
        processedTasks?.hoursSpent?.design * DESIGNER_RATE_PER_HOUR,
    };
    processedTasks.invoiceDescription =
      GenerateInvoiceDescriptionService.generateInvoiceDescription(
        processedTasks,
      );
    return processedTasks;
  }

  static processTasksObjects(issues) {
    const processedTasks = [];
    (issues || [])?.forEach((task) => {
      processedTasks.push({
        id: task.id,
        key: task.key,
        title: task.fields?.summary,
        description: task.fields?.description,
        labels: task.fields?.labels,
        assignee: {
          id: task?.fields?.assignee?.accountId,
          name: task.fields?.assignee?.displayName,
          role: DEV_IDS.includes(task?.fields?.assignee?.accountId)
            ? "dev"
            : DESIGNER_IDS.includes(task?.fields?.assignee?.accountId)
              ? "design"
              : undefined,
        },
        timeSpent: Math.round(task.fields?.timespent / 3600),
        timeEstimate: Math.round(task.fields?.timeoriginalestimate / 3600),
        created: task.fields?.created,
        updated: task.fields?.updated,
        statusType: task.fields?.status?.name,
      });
    });

    return processedTasks;
  }
}

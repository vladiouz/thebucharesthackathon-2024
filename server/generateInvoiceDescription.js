import {
  DESIGNER_RATE_PER_HOUR,
  DEV_RATE_PER_HOUR,
} from "./getJiraClosedTasks";

const huggingFaceApiUrl =
  "https://api-inference.huggingface.co/models/google/flan-t5-xxl";

export class GenerateInvoiceDescriptionService {
  static generateInvoiceDescription(tasks) {
    let description = "";
    (tasks?.tasks || [])?.forEach((task) => {
      description += `${task?.title}\n`;
    });
    description += tasks?.hoursSpent?.dev
      ? `[dev] ${tasks?.hoursSpent?.dev}h * ${DEV_RATE_PER_HOUR}eur = ${tasks.cost.design}eur\n`
      : "";
    description += tasks?.hoursSpent?.design
      ? `[design] ${tasks?.hoursSpent?.design}h * ${DESIGNER_RATE_PER_HOUR}eur = ${tasks.cost.design}eur\n`
      : "";
    return description;
  }

  static getInputForDescriptionGeneration(tasks) {
    let input =
      "I had the following tasks completed and I want you to generate a description for my invoice: ";
    input += JSON.stringify(
      tasks.map((task) => ({
        title: task.title,
        description: task.description,
        labels: task.labels,
      })),
    );
    return input;
  }

  static async generateInvoiceDescriptionWithAI(inputString) {
    const response = await fetch(huggingFaceApiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_BEARER_TOKEN}`,
      },
      method: "POST",
      body: "I had the following tasks completed and I want you to generate a description between 20 and 100 words for my invoice: Create email sending script, Create email sending script, Login Functionality",
    });
    const result = await response.json();
    console.log("generateInvoiceDescription", result, inputString);
    return result?.[0]?.generated_text || undefined;
  }
}

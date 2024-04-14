import "dotenv/config";

import OpenAI from "openai";
import {
  DESIGNER_RATE_PER_HOUR,
  DEV_RATE_PER_HOUR,
} from "./getJiraClosedTasks";

const openai = new OpenAI();

const huggingFaceApiUrl =
  "https://api-inference.huggingface.co/models/NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO";

export class GenerateInvoiceDescriptionService {
  static async generateInvoiceNameAndDescription(tasks) {
    // let description = "";
    // (tasks?.tasks || [])?.forEach((task) => {
    //   description += `${task?.title}\n`;
    // });
    let name = "";
    name += tasks?.hoursSpent?.dev
      ? `\n[dev] ${tasks?.hoursSpent?.dev}h * ${DEV_RATE_PER_HOUR}RON = ${tasks.cost.dev}RON`
      : "";
    name += tasks?.hoursSpent?.design
      ? `\n[design] ${tasks?.hoursSpent?.design}h * ${DESIGNER_RATE_PER_HOUR}RON = ${tasks.cost.design}RON`
      : "";

    const input = this.getInputForDescriptionGeneration(tasks?.tasks || []);
    let description = await this.generateInvoiceDescriptionWithAI(input);
    description = description?.replace(/-/g, "")?.slice(0, 200);

    return { name, description };
  }

  static getInputForDescriptionGeneration(tasks) {
    let input = "I had the following tasks completed: ";
    input += JSON.stringify(
      tasks.map((task) => ({
        title: task.title,
        description: task.description,
        labels: task.labels,
      })),
    );
    input +=
      "\nI want you to generate a maximum 150 characters summarized description, in bullet points style, for my invoice";
    return input;
  }

  static async generateInvoiceDescriptionWithAI(inputString) {
    // const response = await fetch(huggingFaceApiUrl, {
    //   headers: {
    //     Authorization: `Bearer ${process.env.HUGGINGFACE_BEARER_TOKEN}`,
    //   },
    //   method: "POST",
    //   body: JSON.stringify({
    //     inputs: "Can you please let us know more details about your ",
    //   }),
    // });
    try {
      const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: inputString }],
        model: "gpt-3.5-turbo-0125",
      });
      return completion.choices[0]?.message?.content || "";
    } catch (error) {
      console.log("[generateInvoiceDescriptionWithAI] Error", error);
      return undefined;
    }
  }
}

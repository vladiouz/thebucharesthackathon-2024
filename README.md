# Task2Invoice

#### The Bucharest Hackathon 2024

Team name: Lettuce Cook

This system aims to **ease software project's bookkeeping**. 
* Takes the done tasks from **JIRA** (though the JIRA API) and quantifies them
* Generates an invoice in XML, compatible with Romanian E-Factura module _(the invoice's description is generated using OpenAI's GPT-3.5-turbo, considering all the Jira tasks' title, description and labels)_
* Sends the invoice though e-mail to the customer along with a **STRIPE** link for payment
* Lets you download it in PDF format created though ANAF's API

[Demo link](https://drive.google.com/file/d/1BtZuoUovPyJFc9ra42-TUoY-oMDZWv7-/view?usp=sharing).

Toolstack:
* Genezio SDK
* React
* Node.js
* API's: JIRA, STRIPE, ANAF, OpenAI
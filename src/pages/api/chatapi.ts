import type { NextApiRequest, NextApiResponse } from "next";
const axios = require("axios");
type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    const data = { data: req.body };
    let sql = await generateSQL(data);
    res.status(200).json({ message: sql || 'No Response' });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  
  }
}

async function generateSQL(input: any){
    const data = { data: `
    You are a database developer who is tasked on generating an SQL statement based on the following NLP prompt:
    "${input.data}"

    You are also given the following schema:
    Table: Transactions
    Columns: 
    - id
    - date
    - account
    - amount
    - description

    Table: Accounts
    Columns:
    - id
    - name
    - balance

    The following conditions are also true:
    The current date is april 26 2024
    
    If the prompt is not clear, please ask for reprompt, and use a style that is easy to understand without technical terms.

    Give me an SQL statement that returns the data required from the prompt, and make sure that the reply starts with SQL:.
    Don't allow any delete statement
    Don't allow any SQL injection vulnerabilities in the SQL statement.
    Make sure to use the correct table and column names, and use the correct SQL syntax, also dont allow any major security vulnerabilities in the SQL statement.
    
    `}
    var ans;
    await axios({
        method: "post",
        url: "https://models.aixplain.com/api/v1/execute/640b517694bf816d35a59125",
        data: data,
        headers: {
          "x-api-key": process.env.AIXPLAIN_API_KEY,
          "content-type": "application/json",
        },
      }).then(async (myres: any) => {
        const urlToPoll = myres.data.data;
        return await new Promise((resolve, reject) => {
          const interval = setInterval(async () => {
            try {
              console.log("Polling");
              const statusResponse = await axios({
                method: "get",
                url: urlToPoll,
                headers: {
                  "x-api-key": process.env.AIXPLAIN_API_KEY,
                  "content-type": "application/json",
                },
              });
              if (statusResponse.data.completed) {
                clearInterval(interval);
                ans = statusResponse.data.data;
                resolve(statusResponse.data.data);
              }
            } catch (error) {
              clearInterval(interval);
              reject(error);
            }
          }, 1000);
        });
      });
    return ans;
}
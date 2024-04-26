import type { NextApiRequest, NextApiResponse } from "next";
const axios = require("axios");
import { Client, sql } from "@vercel/postgres";

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
    // fetch table names
    let tables = await sql` SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';`;
    console.log(tables);
  if (req.method === "POST") {
    const data = { data: req.body };
    let sql = await generateSQL(data);
    if (sql) {
        let data = await fetchData(sql);
        if (data.length != 0) {
            res.status(200).json({ message: JSON.stringify(data) || 'No Response' });
        } else {
            res.status(200).json({ message: 'No matching data found' });
        }
    }

    


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
    TABLE Account (
        account_id SERIAL PRIMARY KEY,
        account_name TEXT,
        account_balance DECIMAL
    );
    
    TABLE Transaction (
        trans_id SERIAL PRIMARY KEY,
        trans_type TEXT,
        trans_method TEXT,
        trans_amount DECIMAL,
        trans_date DATE,
        from_acc INT REFERENCES Account(account_id),
        to_acc INT REFERENCES Account(account_id)
    );

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


// TODO handle query / insert / update / delete

async function fetchData(mysql: string) {
    mysql = mysql.replace("SQL:\n", "");
    mysql = mysql.replace("\n", " ");
    console.log(mysql);
    try {
    const { rows } = await sql.query(mysql);
    return rows;
    } catch (e) {
        console.log(e);
        return [];
    }
}
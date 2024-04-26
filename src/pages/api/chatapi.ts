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
  if (req.method === "POST") {
    const data = { data: req.body };
    let sql = await generateSQL(data);
    if (sql) {
        console.log(sql);
        if (sql.startsWith("ERROR:")) {
            res.status(200).json({ message: sql.split("ERROR:")[1] });
            return;
        }

        let data = await fetchData(sql);
        console.log(data);
        if (data) {
            let resData = await parseData(JSON.stringify(data), req.body.data);
            res.status(200).json({ message: resData || 'Error Parsing Data' });
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

async function generateSQL(input: any): Promise<string> {
    const data = { data: `
    You are a database developer who is tasked on generating an SQL statement based on the following NLP prompt:
    "${input.data}"
    
    You can only deal with the following prompt questions:
    Query transactions
    Query accounts
    Insert a new transaction
    Insert a new account

    Anything else should return an error message that starts with ERROR:.

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

    ONLY if the prompt is clear, and provides specific instructions, you can generate an SQL statement based on the prompt
    
    Give me an SQL statement that returns the data required from the prompt, and make sure that the reply only contains sql code without any prefix or suffix.
    Don't allow any delete statement
    Don't allow any SQL injection vulnerabilities in the SQL statement.
    Make sure to use the correct table and column names, and use the correct SQL syntax, also dont allow any major security vulnerabilities in the SQL statement.
    
    `}
    var ans = "";
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
    
    try{
    const { rows } = await sql.query(mysql);
    console.log(rows);
    return rows;
    } catch (e) {
        console.log(e);
        return undefined;
    }
}

async function parseData(res: string, org_prompt: string){
    let data = {data : `
    You are an AI tasked with summaryzing and explaining the following data:

    ${res}

    ,which was retrieved using an sql query from the following NLP prompt:
    
    ${org_prompt}

    Write a short summary of the data in a way that is easy to understand without any technical terms and matches the requirements of the original prompt. Make sure that the reply is clear based off the original prompt.
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
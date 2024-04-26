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
    const axres = await axios({
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
              res.status(200).json({ message: statusResponse.data.data });
              resolve(statusResponse.data.data);
            }
          } catch (error) {
            clearInterval(interval);
            reject(error);
          }
        }, 1000);
      });
    });
  }
}

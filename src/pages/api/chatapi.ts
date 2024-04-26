import type { NextApiRequest, NextApiResponse } from 'next'
 
type ResponseData = {
  message: string
}
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
    if (req.method === 'POST') {
        const data = req.body.text;
        const myreq = fetch("https://platform-api.aixplain.com/assets/pipeline/execution/run/662b8074d532f27117d5bb0d", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.AIXPLAIN_API_KEY || ''
            },
            body: JSON.stringify({
                "data" : {
                    "data": data
                }
            })
        })
        .then((response) => response.json())
        .then((data) => {
            res.status(200).json({ message: data });
        })
    }
}
import Image from "next/image";
import { Inter } from "next/font/google";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  let [messages, setMessages] = useState<string[]>([]);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = e.currentTarget["text_input"].value;

    const res = await fetch("/api/chatapi", {
      method: "POST",
      body: data}).then((res) => res.json());
      console.log(res.message);
      if (!res.message.error) {
      setMessages([...messages, res.message]);
      }
    console.log("Form submitted");
  }


  return (
    <main
      className={`${inter.className} h-screen`}
    >
      <div>
        <h1 className="text-4xl font-bold text-center mx-auto my-12">
          Menadevs Accounting Chatbot
        </h1>
        <div className="mx-auto w-[500px] h-[500px] bg-white rounded-lg shadow-lg p-6">
          {messages.map((message, index) => (
            <div key={index} className="text-left">
              {message}
              </div>
            ))}
        </div>
        <form onSubmit={handleSubmit} className="w-fit mx-auto">
          <label htmlFor="text_input" className="block text-left mt-6">Enter your input here:</label>
          <input id="text_input" className="w-[500px] bg-white rounded-lg shadow-lg mt-6 mx-auto h-12 p-2">
          </input>
        </form>
      </div>
    </main>
  );
}

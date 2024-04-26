import { Inter } from "next/font/google";
import { useState } from "react";
import { Message } from "../models/message";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  let [messages, setMessages] = useState<Message[]>([]);
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Get the data from the form
    const data = e.currentTarget["text_input"].value;

    // Clear text field
    e.currentTarget["text_input"].value = "";
    

    // Add User message to the chat
    setMessages([...messages, { sender: "User", message: data }]);

    // Add temporary message to the chat
    setMessages([...messages, { sender: "Bot", message: "Thinking..." }]);

    // Send the data to the server
    const res = fetch("/api/chatapi", {
      method: "POST",
      body: data}).then((res) => res.json()).then((res) => {
      if (!res.message.error) {
        console.log(res.message);
        
        // Clear temporary message
        setMessages(messages.slice(0, messages.length - 1));

        var newMsg = { sender: "Bot", message: res.message };
        setMessages([...messages, newMsg]);
      }
    }
      );
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
        <div className="mx-auto w-[500px] h-[500px] bg-white rounded-lg shadow-lg p-6 overflow-scroll">
          {messages.map((message, index) => (
              <div key={index} className="text-left">
               {message.sender}: {message.message}
              </div>
            ))}
        </div>
        <form onSubmit={handleSubmit} className="w-fit mx-auto">
          <label htmlFor="text_input" className="block text-left mt-6">Enter your input here:</label>
          <input id="text_input" className="w-[500px] bg-white rounded-lg shadow-lg mt-2 mx-auto h-12 p-2">
          </input>
        </form>
      </div>
    </main>
  );
}

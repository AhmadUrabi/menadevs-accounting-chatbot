import { Inter } from "next/font/google";
import { useState } from "react";
import { Message } from "../models/message";
const inter = Inter({ subsets: ["latin"] });

import {motion} from "framer-motion";

export default function Home() {

  const examples = [
    "What is the total amount of transactions?",
    "What are the biggest transactions of the past month?",
    "What is the average transaction amount in the past year?",
  ]

  const handleExampleClick = (e: any) => {
    e.preventDefault();
    const data = e.target.textContent;
    let el = document.getElementById("text_input") as HTMLInputElement;
    if (el) {
      el.value = data;
    }
    let submitButton = document.querySelector("button[type='submit']") as HTMLButtonElement;
    if (submitButton) {
      submitButton.click();
    }
  }

  let [messages, setMessages] = useState<Message[]>([]);
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Get the data from the form
    const data = e.currentTarget["text_input"].value;

    // Clear text field
    e.currentTarget["text_input"].value = "";
      
    console.log(data)
    // Add User message to the chat
    setMessages([...messages, { sender: "User", message: data }]);
    setMessages([...messages, { sender: "User", message: data }]);
    setMessages([...messages, { sender: "User", message: data as string }]);

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

  function handleClear() {
    setMessages([]);
  }

  return (
    <main
      className={`${inter.className} h-screen bg-gradient-to-br from-blue-500 to-blue-700 text-white`}
    >
      
        <h1 className="text-4xl font-bold text-center mx-auto py-12">
          Power of AI Team - Menadevs GenAI Hackathon
        </h1>
        <div className="flex flex-row gap-12 w-fit mx-auto text-black">
        {messages.length > 0 && <button onClick={handleClear} className="bg-white text-blue-500 rounded-lg shadow-lg h-12 w-24 absolute top-2 right-4">Clear</button>}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0}}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="w-[500px] h-[500px] bg-white rounded-lg shadow-lg p-6 overflow-scroll relative">
            
          {messages.map((message, index) => (
              <div key={index} className="text-left">
               {message.sender}: {message.message}
              </div>
            ))}
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0}}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="min-w-[200px] h-[500px] bg-white rounded-lg shadow-lg p-6 overflow-scroll">
          <h1 className="text-2xl font-bold mb-2">Examples:</h1>
          <ul>
            {examples.map((example, index) => (
              <li key={index} onClick={handleExampleClick} className="text-left bg-blue-600 hover:bg-blue-500 hover:-translate-y-[2px] hover:cursor-pointer transition-all ease-in-out text-white rounded-xl shadow-xl py-4 px-6 my-2">{example}</li>
            ))}
          </ul>
        </motion.div>
        </div>
        <form id="chat_form" onSubmit={handleSubmit} className="w-fit mx-auto text-black">
          <label htmlFor="text_input" className="block text-left mt-6 text-white">Ask a question:</label>
          <input id="text_input" className="w-[500px] bg-white rounded-lg shadow-lg mt-2 mx-auto h-12 p-2"/>
            <button type="submit" className="bg-blue-500 text-white rounded-lg shadow-lg h-12 w-24 ml-2">Send</button>
          
        </form>
    </main>
  );
}

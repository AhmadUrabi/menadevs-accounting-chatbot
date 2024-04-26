import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const el = document.getElementById("chat_output");
    if (el) {
      el.innerHTML = `Form submitted, Input: ${e.currentTarget["text_input"].value}`;
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
          <p id="chat_output">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur nemo quo quos porro quae. Illo harum repellat aspernatur doloribus hic labore nobis vitae quaerat. Dolorum hic sunt voluptas tempore assumenda.
          </p>
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

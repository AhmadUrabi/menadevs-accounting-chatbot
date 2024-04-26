import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("Form submitted");
  }


  return (
    <main
      className={`${inter.className} h-screen`}
    >
      <div>
        <h1 className="text-4xl font-bold text-center mx-auto">
          Menadevs Accounting Chatbot
        </h1>
        <div className="mx-auto w-[500px] h-[500px] bg-white rounded-lg shadow-lg">
          <p id="chat output">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur nemo quo quos porro quae. Illo harum repellat aspernatur doloribus hic labore nobis vitae quaerat. Dolorum hic sunt voluptas tempore assumenda.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <input className="w-[500px] bg-white rounded-lg shadow-lg mt-6 mx-auto h-12">
          </input>
        </form>
      </div>
    </main>
  );
}

import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const Home = () => {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [relationship, setRelationship] = useState("");
  const [badVibes, setBadVibes] = useState(false);
  const [yourName, setYourName] = useState("");
  const [output, setOutput] = useState("");

  useEffect(() => {}, [input]);

  const handleCopyClick = (e: any) => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="home">
      <>
        <img
          src="https://www.kitkat.com.au/media/logo/stores/1/kitkat-new-logo.png"
          width="250"
        />
        <h1>Need a break?</h1>
        <div>Try out some of our break maker AI tools.</div>
        <br />
        <br />
        <Link href="/outofoffice">
          <div className="linky" title="Out of Office">
            Out of Office
          </div>
        </Link>
        <Link href="/excuse">
          <div className="linky" title="Excuse Maker">
            Excuse Maker
          </div>
        </Link>
        <Link href="/sickday">
          <div className="linky" title="Sick Day">
            Sick Day
          </div>
        </Link>
        <Link href="/resignationletter">
          <div className="linky" title="Resignation Letter">
            Resignation Letter
          </div>
        </Link>
        <Link href="/lovenote">
          <div className="linky" title="Love Note">
            Love Note
          </div>
        </Link>
      </>

      <div className="poweredby">
        <p>
          Powered by{" "}
          <a href="https://openai.com" target="_blank" rel="noreferrer">
            OpenAI
          </a>
        </p>
      </div>
    </div>
  );
};

export default Home;

import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Configuration, OpenAIApi } from "openai";
import axios from "axios";
import Link from "next/link";

const CoverLetter = () => {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [relationship, setRelationship] = useState("");
  const [badVibes, setBadVibes] = useState(false);
  const [input2, setInput2] = useState("");
  const [input3, setInput3] = useState("");
  const [output, setOutput] = useState("");

  const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const getAltOpenAIResponse = async (
    input: string,
    input2: string,
    input3: string
  ) => {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt:
        "In a super cheeky Gen Z comedy style, write an insanely funny message back about how you know what they are up to, and how they should consider being less negative and that there is enough negativity in the world and maybe they should give negativity a break and have a KitKat instead.",
      temperature: 0.7,
      max_tokens: 1055,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    let outputFormatted = response.data.choices[0].text || "";

    setOutput(outputFormatted);

    console.log(response.data.choices[0].text);
    setBadVibes(true);
    setLoading(false);
  };

  const getOpenAIResponse = async (
    input: string,
    input2: string,
    input3: string
  ) => {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt:
        "In the super funny comedy Gen Z style, write an insanely funny and ironic cover letter I can attach to my job application for the role of " +
        input2 +
        ". Include in the cover letter that I have " +
        input3 +
        " years of experience. You must remember to keep it very funny and Gen Z. Please sign the cover letter with my name, " +
        input,
      temperature: 0.7,
      max_tokens: 1055,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    let outputFormatted = response.data.choices[0].text || "";

    setOutput(outputFormatted);

    console.log(response.data.choices[0].text);
    setLoading(false);
  };

  const checkForBadVibes = async (
    input: string,
    input2: string,
    input3: string
  ) => {
    console.log("getting response for: " + input);

    const textInput = input + " " + input2 + " " + input3;
    const analyzeParams = {
      text: textInput.repeat(3),
      features: {
        sentiment: {},
      },
    };

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content:
            "responding only with a percentage value and nothing else and no explanation, how controversial are these words: " +
            textInput,
        },
      ],
    });
    console.log(completion.data.choices[0].message);
  };

  useEffect(() => {}, [input]);

  const handleCopyClick = (e: any) => {
    navigator.clipboard.writeText(output);
  };

  const handleBackClick = (e: any) => {
    setLoading(false);
    setBadVibes(false);
    setInput("");
    setInput2("");
    setInput3("");
    setOutput("");
  };

  const handleButtonClick = (e: any) => {
    setLoading(true);
    setBadVibes(false);
    checkForBadVibes(input, input2, input3);
  };

  const handleRelationshipChange = (e: any) => {
    setRelationship(e.target.value);
  };
  const handleInputChange = (e: any) => {
    setBadVibes(false);
    setInput(e.target.value);
  };

  const handleInput2Change = (e: any) => {
    setBadVibes(false);
    setInput2(e.target.value);
  };

  const handleInput3Change = (e: any) => {
    setBadVibes(false);
    setInput3(e.target.value);
  };

  return (
    <div>
      {loading && (
        <>
          <img className="loader" src="/loading.gif" height="100" />
        </>
      )}
      {!loading && output && output.length > 0 && (
        <>
          {badVibes && (
            <h3>HMMM... KINDA GETTING BAD VIBES ABOUT THAT ONE...</h3>
          )}

          {!badVibes && (
            <h3>
              HERE YOU GO. THIS OUGHTA
              <br />
              DO THE TRICK.
            </h3>
          )}

          <div>{output}</div>
          <div className="doneButtons">
            {!badVibes && <button onClick={handleCopyClick}>Copy</button>}

            <button onClick={handleBackClick} className="back">
              Back
            </button>
          </div>
        </>
      )}

      {!loading && (!output || output.length < 1) && (
        <>
          <img
            src="https://www.kitkat.com.au/media/logo/stores/1/kitkat-new-logo.png"
            width="250"
          />
          <h1>Need an Cover Letter?</h1>
          <div>
            We get it. Some things are just hard.
            <br />
            Try out our CoverLetter maker upper. It works for anything anyone
            asks you to do.
          </div>
          <br />
          <br />
          <div>
            <label>Name</label>
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Your name"
            />
          </div>
          <div>
            <label>Position</label>
            <input
              type="text"
              value={input2}
              onChange={handleInput2Change}
              placeholder="Position applied for"
            />
          </div>

          <div>
            <label>Years of Experience</label>
            <input
              type="text"
              value={input3}
              onChange={handleInput3Change}
              placeholder="Years of Experience"
            />
          </div>

          <br />
          <button onClick={handleButtonClick}>Generate</button>

          <Link href="/">
            <button className="back">Back</button>
          </Link>
        </>
      )}
    </div>
  );
};

export default CoverLetter;

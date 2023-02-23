import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Configuration, OpenAIApi } from "openai";
import axios from "axios";

// import NaturalLanguageUnderstandingV1 from "ibm-watson/natural-language-understanding/v1";
// import { IamAuthenticator } from "ibm-watson/auth";

//const NaturalLanguageUnderstandingV1 = require("ibm-watson/natural-language-understanding/v1");
// const { IamAuthenticator } = require("ibm-watson/auth");

const Excuse = () => {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [relationship, setRelationship] = useState("");
  const [badVibes, setBadVibes] = useState(false);
  const [yourName, setYourName] = useState("");
  const [output, setOutput] = useState("");

  const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const getAltOpenAIResponse = async (input: string, yourName: string) => {
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

    // outputFormatted = outputFormatted.replace("\n", "<br />");

    setOutput(outputFormatted);

    console.log(response.data.choices[0].text);
    setBadVibes(true);
    setLoading(false);
  };

  const getOpenAIResponse = async (input: string, yourName: string) => {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt:
        "In the super funny comedy Gen Z style, write an insanely funny and ironic message I can send my colleague, named " +
        input +
        " with a hilariously brilliant excuse for why I didnt finish that thing (" +
        yourName +
        ") they asked me to do " +
        ". Make sure the message is written in a Gen Z style. " +
        " Also make sure to include some ironic joke about being late on work." +
        "Also start by saying hi " +
        input +
        ". And don't sign the end of the message.",
      temperature: 0.7,
      max_tokens: 1055,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    let outputFormatted = response.data.choices[0].text || "";

    // outputFormatted = outputFormatted.replace("\n", "<br />");

    setOutput(outputFormatted);

    console.log(response.data.choices[0].text);
    setLoading(false);
  };

  const getResponse = async (input: string, yourName: string) => {
    // getOpenAIResponse(input, yourName);
    // return;
    console.log("getting response for: " + input);

    // const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
    //   version: "2022-04-07",
    //   authenticator: new IamAuthenticator({
    //     apikey: "e5AVUgDFcpVm4bHGharvKxwz96kE6ndUFAmhSR43AmkQ",
    //   }),
    //   serviceUrl:
    //     "https://api.au-syd.natural-language-understanding.watson.cloud.ibm.com/instances/0a56f75e-dbae-4b48-ae8b-24964b65ac89",
    // });

    const analyzeParams = {
      text:
        "" +
        "to: " +
        input +
        " from: " +
        yourName +
        " " +
        "to: " +
        input +
        " from: " +
        yourName +
        " " +
        "to: " +
        input +
        " from: " +
        yourName +
        " " +
        "to: " +
        input +
        " from: " +
        yourName +
        " ",
      features: {
        sentiment: {},
      },
    };

    await axios
      .post(
        "https://api.au-syd.natural-language-understanding.watson.cloud.ibm.com/instances/0a56f75e-dbae-4b48-ae8b-24964b65ac89/v1/analyze?version=2022-04-07",
        analyzeParams,
        {
          auth: {
            username: "apikey",
            password: "e5AVUgDFcpVm4bHGharvKxwz96kE6ndUFAmhSR43AmkQ",
          },
        }
      )
      .then(function (response) {
        console.log("Authenticated");
        console.log(response);
        if (response.data.sentiment.document.score < -0.5) {
          getAltOpenAIResponse(input, yourName);
        } else {
          getOpenAIResponse(input, yourName);
        }
      })
      .catch(function (error) {
        console.log("Error on Authentication");
      });

    // naturalLanguageUnderstanding
    //   .analyze(analyzeParams)
    //   .then((analysisResults: any) => {
    //     console.log(JSON.stringify(analysisResults, null, 2));
    //   })
    //   .catch((err: any) => {
    //     console.log("error:", err);
    //   });
  };

  useEffect(() => {}, [input]);

  const handleCopyClick = (e: any) => {
    navigator.clipboard.writeText(output);
  };

  const handleBackClick = (e: any) => {
    setLoading(false);
    setBadVibes(false);
    setYourName("");
    setInput("");
    setOutput("");
  };

  const handleButtonClick = (e: any) => {
    setLoading(true);
    setBadVibes(false);
    getResponse(input, yourName);
  };
  // input change

  const handleRelationshipChange = (e: any) => {
    setRelationship(e.target.value);
  };
  const handleInputChange = (e: any) => {
    setBadVibes(false);
    setInput(e.target.value);
  };

  const handleYourNameChange = (e: any) => {
    setBadVibes(false);
    setYourName(e.target.value);
  };

  return (
    <div>
      {loading && (
        <>
          <img src="/loading.gif" height="200" />
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

            <button onClick={handleBackClick}>Try Again</button>
          </div>
        </>
      )}

      {!loading && (!output || output.length < 1) && (
        <>
          <img
            src="https://www.kitkat.com.au/media/logo/stores/1/kitkat-new-logo.png"
            width="250"
          />
          <h1>Need a break?</h1>
          <div>
            We get it. Some things are just too hard. Need a quick excuse?
            <br />
            Try out our excuse maker upper. It works for anything anyone asks
            you to do.
          </div>
          <br />
          <br />
          <div>
            <label>WHO</label>
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Your colleague's name"
            />
          </div>
          <div>
            <label>TASK </label>
            <input
              type="text"
              value={yourName}
              onChange={handleYourNameChange}
              placeholder="What did they ask you to do?"
            />
          </div>
          {/* <div>
            <label>Gender </label>
            <select onChange={handleRelationshipChange} value={relationship}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div> */}

          <br />
          <button onClick={handleButtonClick}>Generate</button>
        </>
      )}
    </div>
  );
};

export default Excuse;

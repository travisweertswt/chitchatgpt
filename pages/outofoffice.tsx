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

const OutOfOffice = () => {
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
        "In the super funny comedy Gen Z style, write an insanely funny and ironic out of office message for a " +
        relationship +
        '. Include that i am taking some "Me time" and include something ironic about eating KitKats. I will be returning in ' +
        input +
        ". Make sure the out of office is written in a Gen Z style and sign it " +
        yourName,
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
    getOpenAIResponse(input, yourName);
    return;
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
        if (response.data.sentiment.document.score < 0) {
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
              NOW...
              <br />
              COPY &amp; PASTE THIS IN YOUR OUT OF OFFICE
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
            How about you get out of the office for a bit?
            <br />
            We&apos;ll write the perfect OOF for you ;)
          </div>
          <br />
          <br />
          <div>
            <label>When do you return?</label>
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="An hour? a week? month? never?"
            />
          </div>
          <div>
            <label>Your Name </label>
            <input
              type="text"
              value={yourName}
              onChange={handleYourNameChange}
              placeholder="Your name"
            />
          </div>
          <div>
            <label>Gender </label>
            <select onChange={handleRelationshipChange} value={relationship}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <br />
          <button onClick={handleButtonClick}>Generate</button>
        </>
      )}
    </div>
  );
};

export default OutOfOffice;

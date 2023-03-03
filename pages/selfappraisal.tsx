import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Configuration, OpenAIApi } from "openai";
import axios from "axios";
import Link from "next/link";

const SelfAppraisal = () => {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [relationship, setRelationship] = useState("");
  const [badVibes, setBadVibes] = useState(false);
  const [input2, setInput2] = useState("");
  const [input3, setInput3] = useState("");
  const [output, setOutput] = useState("");
  const [outputRaw, setOutputRaw] = useState("");

  const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const getNoNegativityResponse = async (
    input: string,
    input2: string,
    input3: string
  ) => {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt:
        "In a super cheeky Gen Z comedy style, write an positive upbeat response to the user about how they should consider being less negative and that there is enough negativity in the world and maybe they should give negativity a break and look on the bright side instead.",
      temperature: 0.7,
      max_tokens: 1055,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    let outputFormatted = response?.data?.choices[0].text || "";

    setOutput(outputFormatted);

    console.log(response.data.choices[0].text);
    setBadVibes(true);
    setLoading(false);
  };

  const getChatGPTResponse = async (
    input: string,
    input2: string,
    input3: string
  ) => {
    const prompt = `In the super funny comedy Gen Z style, write an insanely funny and ironic self assessment for my role of ${input3} at my company ${input2}. Please sign the self appraisal with my name, ${input}`;

    let response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const outputFormatted = response?.data?.choices[0].message?.content || "";
    setOutputRaw(outputFormatted);
    setOutput(outputFormatted.replace(/(?:\r\n|\r|\n)/g, "<br>"));
    setLoading(false);
  };

  const checkForBadVibes = async (
    input: string,
    input2: string,
    input3: string
  ) => {
    const textInput = `"${input}" "${input2}" "${input3}"`;

    console.log("getting response for: " + textInput);

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
    const completionText = completion?.data?.choices[0].message?.content || "";

    if (completionText) {
      const nums = completionText.match(/\d+/g);
      const nums2 = nums && nums.length > 0 ? nums : [];
      const reallyNumbers = nums2.map(Number);

      console.log(
        "BAD VIBES CHECK: " + textInput,
        completionText,
        reallyNumbers
      );

      let detected = false;
      for (let x = 0; x < reallyNumbers.length; x++) {
        if (reallyNumbers[x] > 60) {
          detected = true;
          break;
        }
      }

      console.log("Detected bad vides", detected);

      if (detected) {
        getNoNegativityResponse(input, input2, input3);
      } else {
        getChatGPTResponse(input, input2, input3);
      }
    }
  };

  useEffect(() => {}, [input]);

  const handleCopyClick = (e: any) => {
    navigator.clipboard.writeText(outputRaw);
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

          <div dangerouslySetInnerHTML={{ __html: output }}></div>
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
          <h1>Need a Self Appraisal?</h1>
          <div>
            Uggghhh... its been another year already?
            <br />
            Do you need to write a self-assessment for your review? We got you
            covered.
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
            <label>Company</label>
            <input
              type="text"
              value={input2}
              onChange={handleInput2Change}
              placeholder="Company Name"
            />
          </div>

          <div>
            <label>Role</label>
            <input
              type="text"
              value={input3}
              onChange={handleInput3Change}
              placeholder="Your Role"
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

export default SelfAppraisal;

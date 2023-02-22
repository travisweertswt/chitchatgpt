import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Configuration, OpenAIApi } from 'openai';

const Home = () => {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [yourName, setYourName] = useState('');
  const [output, setOutput] = useState('');

  const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const getResponse = async (input: string, yourName: string) => {
    
    console.log("getting response for: " + input)

    // const response = await openai.createCompletion({
    //   model: "text-davinci-003",
    //   prompt: "I am a highly intelligent question answering bot. If you ask me a question that is rooted in truth, I will give you the answer. If you ask me a question that is nonsense, trickery, or has no clear answer, I will respond with \"Unknown\".\n\nQ: What is human life expectancy in the United States?\nA: Human life expectancy in the United States is 78 years.\n\nQ: Who was president of the United States in 1955?\nA: Dwight D. Eisenhower was president of the United States in 1955.\n\nQ: Which party did he belong to?\nA: He belonged to the Republican Party.\n\nQ: What is the square root of banana?\nA: Unknown\n\nQ: How does a telescope work?\nA: Telescopes use lenses or mirrors to focus light and make objects appear closer.\n\nQ: Where were the 1992 Olympics held?\nA: The 1992 Olympics were held in Barcelona, Spain.\n\nQ: How many squigs are in a bonk?\nA: Unknown\n\nQ: "+setInput+"\nA:",
    //   temperature: 0,
    //   max_tokens: 100,
    //   top_p: 1,
    //   frequency_penalty: 0.0,
    //   presence_penalty: 0.0,
    //   stop: ["\n"],
    // });

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: "In the super funny comedy style of Ryan Reynolds, write an insanely funny love letter for my loved one named " + input + " to let them know I bought them a KitKit bar and Ill give it to them when I see them. Sign the letter " + yourName + ".",
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

  }

  useEffect(() => {
    
    


  }, [input]);

  const handleCopyClick = (e: any) => {
    navigator.clipboard.writeText(output)
  }

  const handleBackClick = (e: any) => {
    setLoading(false)
    setYourName('')
    setInput('')
    setOutput('')
  }

  const handleButtonClick = (e: any) => {
    setLoading(true);
    getResponse(input, yourName);
  }
  // input change


  const handleInputChange = (e: any) => {
    setInput(e.target.value);
  }

  const handleYourNameChange = (e: any) => {
    setYourName(e.target.value);
  }

  
  return (
    <div>

      {loading && (
        <>
          <img src="/loading.gif" height="200" />
        </>

      )}
      {!loading && output && output.length > 0 && (
        <>
        <h3>NOW... COPY AND SEND THIS TO {input}:</h3>
        <div>{output}</div>
        <div className="doneButtons">
          <button onClick={handleCopyClick}>Copy</button>
          <button onClick={handleBackClick}>Try Again</button>
        </div>
       
        </>
      )}

      {!loading && (!output || output.length < 1) && (
        <>
        <img src="https://www.kitkat.com.au/media/logo/stores/1/kitkat-new-logo.png" width="250" />
        <h1>Take a Break...</h1>
        <div>How about you send your special person a note to remind them how much you love them?<br />We&apos;ll even write it for you.</div>
        <br />
        <br />
        <div>
          <label>Dear </label>
          <input type="text" value={input} onChange={handleInputChange} placeholder="Loved One's name" />
        </div>
        <div>
          <label>Love </label>
          <input type="text" value={yourName} onChange={handleYourNameChange} placeholder="Your name" />
        </div>
        
        <br />
        <button onClick={handleButtonClick}>Generate</button>
        </>
      )}
      
      
    </div>
  );
};

export default Home;
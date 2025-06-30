import { useState } from "react";

function App() {
  const [ value, setValue] = useState("")
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const surpriseOptions = [
    "Who won the latest Novel Peace Prize?",
    "Where does pizza come from?",
    "Who do you make a BLT sandwich?"
  ]

  const surprise = () =>{
    const randomValue = surpriseOptions[Math.floor(Math.random()* surpriseOptions.length)];

    setValue(randomValue);
  }

  const clear =()=>{
	setValue("");
	setError("");
	setChatHistory([]);
  }

  const getResponse = async () => {
  if (!value) {
    setError("Error! Please ask a question!");
    return;
  }

  try {
    const options = {
      method: "POST",
      body: JSON.stringify({
        history: chatHistory,
        message: value,
      }),
      headers: {
        "Content-Type": "application/json"
      }
    };

    const response = await fetch("https://nand.gemini-backend.repl.co/gemini", options);

    if (!response.ok) {
      throw new Error("Server error");
    }

    const data = await response.text();
    console.log(data);

    const text = typeof data === "string" ? data : String(data);

setChatHistory((prev) => [
  ...prev,
  { role: "user", parts: [value] },
  { role: "model", parts: [text] }
]);

    setValue("");
    setError("");
  } catch (error) {
    console.error("❌ Frontend error:", error.message);
    setError("Something went wrong! Please try again later.");
  }
};

if (chatHistory.length > 0) {
  console.log("💬 ChatItem debug:", chatHistory);
}
  return (
    <div className="app">
      <p>
        What do you want to know?
        <button className="surprise" onClick={surprise} disabled={!chatHistory}>Surprise me</button>
      </p>
      <div className="input-container">
        <input value={value} placeholder="When is Christmas...?" onChange={(e) =>setValue(e.target.value)} />
        {!error && <button onClick={getResponse}>Ask Me</button>}
        {/* if there is no error above button will show up */}
        {error && <button onClick={clear}>Clear</button>}
        {/* if there is an error above button will show up */}
      </div>
      {error && <p>{error}</p>}
      <div className="search-result">
        {chatHistory.map((chatItem, _index) => (
  <div key={_index}>
    <p className="answer">
  <strong>{chatItem.role}</strong>: {Array.isArray(chatItem.parts) ? chatItem.parts.join("") : chatItem.parts}
</p>
  </div>
))}
      </div>
    </div>
  );
}

export default App;

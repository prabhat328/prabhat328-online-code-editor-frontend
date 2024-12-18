import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import Navbar from "../components/navBar";
import spinner from "../components/spinner.svg";
import { toast } from "react-toastify";

const languageExtensions = {
  python: "py",
  javascript: "js",
  java: "java",
  cpp: "cpp",
  c: "c",
  html: "html",
  css: "css",
  typescript: "ts",
  json: "json",
  php: "php",
  ruby: "rb",
  go: "go",
  rust: "rs",
};

function EditorPage() {
  const [userCode, setUserCode] = useState("");
  const [userLang, setUserLang] = useState("python");
  const [userTheme, setUserTheme] = useState("vs-dark");
  const [fontSize, setFontSize] = useState(20);
  const [userInput, setUserInput] = useState("");
  const [userOutput, setUserOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("main.py");

  const [history, setHistory] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingCode, setLoadingCode] = useState(false);
  const [historyRefreshTrigger, setHistoryRefreshTrigger] = useState(false);

  const options = { fontSize };

  // Clear the output
  const clearOutput = () => {
    setUserOutput("");
  };

  useEffect(() => {
    const extension = languageExtensions[userLang] || "txt";
    setFileName((prev) => `${prev.split(".")[0]}.${extension}`);
  }, [userLang]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoadingHistory(true);
        const response = await axios.get("http://localhost:8000/codes", {
          withCredentials: true,
        });
        setHistory(response.data.codes);
        setIsLoggedIn(true);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          setIsLoggedIn(false);
          setHistory([]);
        }
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, [historyRefreshTrigger]);

  const fetchCode = async (codeId) => {
    setLoadingCode(true);
    try {
      const response = await axios.get(`http://localhost:8000/codes/${codeId}`, {
        withCredentials: true,
      });
      const { name, language, code } = response.data.code;
      setUserCode(code);
      setFileName(name);
      setUserLang(language);

      toast.success("Code loaded successfully!");
    } catch (err) {
      console.error("Error fetching code:", err.message);
      toast.error("Failed to load code.");
    } finally {
      setLoadingCode(false);
    }
  };

  const runCode = async () => {
    setLoading(true);
    setUserOutput("");
    try {
      const response = await axios.post("http://localhost:8000/code/execute", {
        code: userCode,
        input: userInput,
        language: userLang,
      });
      setUserOutput(response.data.output || "No output received");
      toast.success("Code executed successfully!");
    } catch (err) {
      toast.error("Error: Failed to execute code.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/auth/logout", {}, { withCredentials: true });
      toast.success("Logged out successfully!");
      setIsLoggedIn(false);
      setHistory([]);
    } catch (err) {
      toast.error("Failed to log out.");
    }
  };

  const saveCode = async () => {
    if (!isLoggedIn) {
      toast.error("Please log in to save your code.");
      return;
    }
    if (!userCode || userCode.trim() === "") {
      toast.warn("Code cannot be empty. Please write some code before saving.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/code",
        { name: fileName, language: userLang, code: userCode },
        { withCredentials: true }
      );

      if (response.status === 201) {
        toast.success("Code saved successfully!");
      } else if (response.status === 200) {
        toast.info("Code updated successfully!");
      }

      setHistoryRefreshTrigger((prev) => !prev);
    } catch (err) {
      toast.error("Failed to save code. Please try again.");
    }
  };

  return (
    <div className="mainWrap">
      {/* Sidebar */}
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img src="/logo.png" alt="Logo..." height={30} width={120} />
          </div>
          <hr />
          <h3>History</h3>
          {loadingHistory ? (
            <p>Loading...</p>
          ) : isLoggedIn ? (
            <div>
              {history.length > 0 ? (
                <ul className="historyList">
                  {history.map((code) => (
                    <li key={code._id} onClick={() => fetchCode(code._id)} className="historyItem">
                      {code.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No saved codes found.</p>
              )}
              <button onClick={handleLogout} className="btn logoutBtn">
                Logout
              </button>
            </div>
          ) : (
            <div>
              <p>Login to see history</p>
              <a href="/">
                <button className="btn loginBtn">Login</button>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Editor Section */}
      <div className="editorWrap">
        <Navbar
          userLang={userLang}
          setUserLang={setUserLang}
          userTheme={userTheme}
          setUserTheme={setUserTheme}
          fontSize={fontSize}
          setFontSize={setFontSize}
          fileName={fileName}
          setFileName={setFileName}
          onSaveCode={saveCode}
        />
        <div className="main">
          {/* Editor */}
          <div className="left-container">
            {loadingCode ? (
              <div className="loading-overlay">
                <img src={spinner} alt="Loading code..." />
                <p>Loading Code...</p>
              </div>
            ) : (
              <Editor
                options={options}
                height="calc(100vh - 50px)"
                width="100%"
                theme={userTheme}
                language={userLang}
                value={userCode}
                onChange={(newValue) => setUserCode(newValue)}
              />
            )}
            <button onClick={runCode} className="run-btn">
              Run
            </button>
          </div>

          {/* Input and Output */}
          <div className="right-container">
            <h4>Input:</h4>
            <textarea value={userInput} onChange={(e) => setUserInput(e.target.value)}></textarea>
            <h4>Output:</h4>
            {loading ? (
              <div className="spinner-box">
                <img src={spinner} alt="Loading output..." />
              </div>
            ) : (
              <pre>{userOutput}</pre>
            )}
            <button onClick={clearOutput} className="clear-btn">
              Clear Output
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditorPage;

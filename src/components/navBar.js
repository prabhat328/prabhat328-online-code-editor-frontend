import React from "react";
import Select from "react-select";
import "./navBar.css";

const Navbar = ({
    userLang,
    setUserLang,
    userTheme,
    setUserTheme,
    fontSize,
    setFontSize,
    fileName,
    setFileName,
    onSaveCode,
}) => {
    const languages = [
        { value: "c", label: "C" },
        { value: "cpp", label: "C++" },
        { value: "python", label: "Python" },
        { value: "java", label: "Java" },
    ];

    const themes = [
        { value: "vs-dark", label: "Dark" },
        { value: "light", label: "Light" },
    ];

    return (
        <div className="navbar">
            <h1>Too-Coders Compiler</h1>

            {/* Language Selector */}
            <Select
                options={languages}
                value={languages.find((lang) => lang.value === userLang)}
                onChange={(e) => setUserLang(e.value)}
                placeholder="Language"
                className="navbar-select"
            />

            {/* Theme Selector */}
            <Select
                options={themes}
                value={themes.find((theme) => theme.value === userTheme)}
                onChange={(e) => setUserTheme(e.value)}
                placeholder="Theme"
                className="navbar-select"
            />

            {/* Font Size Control */}
            <div className="font-size-control">
                <label>Font Size:</label>
                <input
                    type="range"
                    min="18"
                    max="30"
                    value={fontSize}
                    step="2"
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="font-input"
                />
            </div>

            {/* File Name Input */}
            <div className="file-name-input">
                <label>File Name:</label>
                <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="Enter file name"
                />
            </div>

            {/* Save Button */}
            <button onClick={onSaveCode} className="btn save-btn">
                Save Code
            </button>
        </div>
    );
};

export default Navbar;

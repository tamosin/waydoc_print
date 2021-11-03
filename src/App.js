import React from "react";
import "./App.css";
import { data_obj, desc_data_obj } from "./data";
import TextInputField from "./TextIInputField";
import { useState, useEffect } from "react";
import waydoc_tmp from "./files/waydoc_tmp.htm";

function App() {
  const [fields, setFields] = useState([]);

  // make temp file from TEXT
  const makeTextFile = (text) => {
    let textFile = null;
    var data = new Blob([text], { type: "text/html" });
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }
    textFile = window.URL.createObjectURL(data);
    return textFile;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // open template file
    let response = await fetch(waydoc_tmp);
    let blob = await response.blob();

    // read file as text and replace template strings
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      let editedText = text;
      fields.forEach((item) => {
        var re = new RegExp("{" + item.key.toUpperCase() + "}", "g");
        console.log(re)
        editedText = editedText.replace(re, item.value);
      });
      var textFile = makeTextFile(editedText);
      window.open(textFile, "_blank");
    };
    reader.readAsText(blob);
  };

  useEffect(() => {
    let new_fields = [];

    // Base fields
    for (const [key, value] of Object.entries(data_obj)) {
      if (key !== "fuels" && key !== "cust_docs") {
        new_fields.push({ key, value });
      }
    }

    // Fuel fields
    for (const item of data_obj.fuels) {
      for (const [key, value] of Object.entries(item)) {
        const new_key = key + (data_obj.fuels.indexOf(item) + 1)
        new_fields.push({ key: new_key, value });
      }
    }

    // Cust doc fields
    for (const item of data_obj.cust_docs) {
      for (const [key, value] of Object.entries(item)) {
        const new_key = key + (data_obj.cust_docs.indexOf(item) + 1)
        new_fields.push({ key: new_key, value });
      }
    }

    setFields(new_fields);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Waydoc print</h1>
      </header>
      <section className="waydoc-data">
        <form className="waydoc-data-form" onSubmit={handleSubmit}>
          {fields.length > 0 &&
            fields.map((item, index) => {
              const label = desc_data_obj[item.key] ? desc_data_obj[item.key] : desc_data_obj[item.key.substring(0, item.key.length - 1)]
              return (
                <TextInputField
                  key={index}
                  name={item.key}
                  label={label}
                  value={item.value}
                  fields={fields}
                  setFields={setFields}
                />
              );
            })}
          <label className="text-label"></label>
          <button className="submit-btn" type="submit">
            Печать
          </button>
        </form>
      </section>
    </div>
  );
}

export default App;


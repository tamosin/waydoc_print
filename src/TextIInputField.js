import "./App.css";

function TextInputField({ name, label, value, fields, setFields }) {
  const onChangeHandler = (e) => {
    const new_fields = fields.map((item) => {
      if (item.key !== name) {
        return item;
      } else {
        item.value = e.target.value;
        return item;
      }
    });

    setFields(new_fields);
  };

  return (
    <>
      <label className="text-label" htmlFor={name}>
        {label}
      </label>
      <input
        className="text-input"
        type="text"
        value={value}
        name={name}
        id={name}
        onChange={onChangeHandler}
      ></input>
    </>
  );
}

export default TextInputField;

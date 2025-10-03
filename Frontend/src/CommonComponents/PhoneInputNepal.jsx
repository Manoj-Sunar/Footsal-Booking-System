import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const PhoneInputNepal = ({ value, onChange, error, name = "phone" }) => {
  return (
    <div className="space-y-1">
      <PhoneInput
        country={"np"}
        onlyCountries={["np"]}
        countryCodeEditable={false}
        inputProps={{
          name,
          required: true,
        }}
        value={value}
        onChange={(phone) => onChange({ target: { name, value: phone } })}
        inputStyle={{
          width: "100%",
          height: "40px",
          border: error ? "1px solid red" : "1px solid #d1d5db",
        }}
        buttonStyle={{
          borderTopLeftRadius: "6px",
          borderBottomLeftRadius: "6px",
        }}
        containerStyle={{ width: "100%" }}
      />
    </div>
  );
};

export default PhoneInputNepal;

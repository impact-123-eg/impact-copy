export default function TimePickerInput({ value, onChange, name }) {
  return (
    <div className="relative w-full">
      <input
        type="time"
        name={name}
        value={value}
        onChange={onChange}
        required
        className="
          w-full p-3 rounded-xl
          bg-[var(--Input)] border-2 border-[var(--Main)]
          text-[var(--numbers-text-color)] 
          focus:border-[var(--Yellow)] focus:ring-2 focus:ring-[var(--Yellow)]
          outline-none transition
        "
      />
    </div>
  );
}

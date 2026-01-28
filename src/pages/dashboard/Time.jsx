import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TimePicker = () => {
  const [date, setDate] = useState(new Date()); 

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const submitData = (e) => {
    e.preventDefault();
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    alert(formattedDate);
  };

  return (
    <div>
      <form onSubmit={submitData}>
        <DatePicker
          selected={date}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
          minDate={new Date()}
          inline
        />
        <button type="submit">Click</button>
      </form>
    </div>
  );
};

export default TimePicker;

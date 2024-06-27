import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

export default function DateCalendarValue({ resultActivity }) {
  const [value, setValue] = React.useState(dayjs('2022-04-17'));

  let day = dayjs(resultActivity?.start_date);
  let fecha = resultActivity?.start_date.split("T");
  let hoy = new Date(fecha);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateCalendar', 'DateCalendar']}>

        {fecha && <DemoItem >
          <DateCalendar defaultValue={dayjs(hoy)} readOnly />
        </DemoItem>}
      </DemoContainer>
    </LocalizationProvider>
  );
}
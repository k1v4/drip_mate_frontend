import React, { useState, useEffect } from 'react';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Badge } from '@mui/material';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import dayjs, { Dayjs } from 'dayjs';
import ShoeCalendar from './get';
import axios from 'axios';

// Тип для даты
interface HighlightedDate {
  id: number;
  date: Dayjs;
}

// Тип для данных с сервера
interface Release {
  id: number;
  release_date: string;
  name: string;
}

const Calendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
  const [showHello, setShowHello] = useState<boolean>(false);
  const [highlightedDates, setHighlightedDates] = useState<HighlightedDate[]>([]); // Состояние для данных с сервера
  const [selectedDateId, setSelectedDateId] = useState<number | null>(null); // Состояние для id выбранной даты

  // Функция для получения данных с сервера
  const fetchReleases = async (month: string) => {
    try {
      const response = await axios.get(`http://localhost:8083/api/v1/releases?month=${month}`);
      const releases: Release[] = response.data;

      // Преобразуем данные в формат HighlightedDate
      const formattedDates: HighlightedDate[] = releases.map((release) => ({
        id: release.id,
        date: dayjs(release.release_date), // Преобразуем строку в Dayjs
      }));

      setHighlightedDates(formattedDates); // Обновляем состояние
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  };

  // При монтировании компонента отправляем запрос
  useEffect(() => {
    const monthInRussian = currentMonth.locale('ru').format('MMMM'); // Получаем текущий месяц на русском
    console.log(monthInRussian);
    
    fetchReleases(monthInRussian); // Отправляем запрос
  }, [currentMonth]);

  const handleAddShoe = () => {
    setShowHello(!showHello);
  };

  // Кастомизация для подсветки дат
  const ServerDay = (
    props: PickersDayProps<Dayjs> & { highlightedDates?: HighlightedDate[] }
  ) => {
    const { highlightedDates = [], day, outsideCurrentMonth, ...other } = props;

    const isHighlighted = highlightedDates.some(
      (highlighted) =>
        highlighted.date.isSame(day, 'year') &&
        highlighted.date.isSame(day, 'month') &&
        highlighted.date.isSame(day, 'day')
    );

    return (
      <Badge
        key={day.toString()}
        overlap="circular"
        badgeContent={isHighlighted ? '●' : undefined}
        color="primary"
      >
        <PickersDay
          {...other}
          outsideCurrentMonth={outsideCurrentMonth}
          day={day}
          disabled={outsideCurrentMonth}
          sx={{
            backgroundColor: isHighlighted ? 'black' : 'transparent',
            color: isHighlighted ? 'white' : 'black',
            borderRadius: '50%',
          }}
        />
      </Badge>
    );
  };

  const filteredHighlightedDates = highlightedDates.filter(
    (item) =>
      item.date.isSame(currentMonth, 'year') &&
      item.date.isSame(currentMonth, 'month')
  );

  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      const highlightedDate = highlightedDates.find(
        (highlighted) =>
          highlighted.date.isSame(date, 'year') &&
          highlighted.date.isSame(date, 'month') &&
          highlighted.date.isSame(date, 'day')
      );

      if (highlightedDate) {
        setSelectedDate(date);
        setSelectedDateId(highlightedDate.id); // Сохраняем id выбранной даты
        console.log('Выбрана дата:', date.format('DD.MM.YYYY'));
        console.log('ID подсвеченной даты:', highlightedDate.id);

        handleAddShoe(); // Открываем окно ShoeCalendar
      }
    }
  };

  return (
    <div>
      {showHello ? (
        <ShoeCalendar onClose={handleAddShoe} selectedDateId={selectedDateId} />
      ) : (
        <div className="calendarContainer">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              sx={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                backgroundColor: 'white',
              }}
              value={selectedDate}
              onChange={handleDateChange}
              disableFuture
              disablePast
              views={['day']}
              slots={{
                day: ServerDay,
              }}
              slotProps={{
                day: {
                  highlightedDates: filteredHighlightedDates,
                } as any,
              }}
            />
          </LocalizationProvider>
        </div>
      )}
    </div>
  );
};

export default Calendar;
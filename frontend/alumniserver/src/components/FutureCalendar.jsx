import { useState, useEffect } from 'react';
import { ChevronRight, RotateCcw } from 'lucide-react';

const FutureCalendar = ({ events = [], onEventClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayEvents, setDayEvents] = useState([]);

  const eventDates = events.reduce((acc, event) => {
    const dateKey = new Date(event.event_date).toDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(event);
    return acc;
  }, {});

  useEffect(() => {
    generateCalendar();
  }, [currentDate]);

  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startDayOfWeek; i++) {
      days.push({ date: null, isCurrentMonth: false, isEmpty: true });
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const currentDateObj = new Date(year, month, i);
      const isPast = currentDateObj < today;
      const dateKey = currentDateObj.toDateString();
      const hasEvent = !!eventDates[dateKey];

      days.push({
        date: currentDateObj,
        day: i,
        isCurrentMonth: true,
        isPast: isPast,
        isEmpty: false,
        isToday: currentDateObj.toDateString() === today.toDateString(),
        hasEvent,
        eventCount: eventDates[dateKey]?.length || 0,
      });
    }

    setCalendarDays(days);
  };

  const changeMonth = (increment) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1);
    const today = new Date();
    if (newDate.getFullYear() < today.getFullYear() ||
        (newDate.getFullYear() === today.getFullYear() && newDate.getMonth() < today.getMonth())) {
      return;
    }
    setCurrentDate(newDate);
    setSelectedDate(null);
    setDayEvents([]);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(null);
    setDayEvents([]);
  };

  const handleDateClick = (day) => {
    if (!day.isPast && !day.isEmpty) {
      setSelectedDate(day.date);
      const dateKey = day.date.toDateString();
      setDayEvents(eventDates[dateKey] || []);
    }
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const isCurrentMonthNow = () => {
    const today = new Date();
    return currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="bg-blue-900 px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="text-white">
            <h2 className="text-lg font-bold">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
            {isCurrentMonthNow() && <p className="text-blue-100 text-xs mt-0.5">Current Month</p>}
          </div>
          <div className="flex gap-1">
            <button onClick={goToToday}
              className="p-1.5 bg-white text-blue-600 rounded hover:bg-blue-50 transition-colors">
              <RotateCcw size={14} />
            </button>
            <button onClick={() => changeMonth(1)}
              className="p-1.5 bg-white text-blue-600 rounded hover:bg-blue-50 transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {weekdays.map(day => (
          <div key={day} className="bg-gray-50 py-2 text-center text-xs font-semibold text-gray-600">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {calendarDays.map((day, index) => {
          if (day.isEmpty) {
            return <div key={index} className="bg-white p-1 min-h-[52px]"></div>;
          }

          const isSelected = selectedDate && day.date && selectedDate.toDateString() === day.date.toDateString();

          return (
            <div key={index}
              onClick={() => handleDateClick(day)}
              className={`bg-white p-1 min-h-[52px] relative transition-all duration-200 ${
                !day.isPast && !day.isEmpty ? 'hover:bg-blue-50 cursor-pointer' : 'cursor-not-allowed'
              } ${isSelected ? 'ring-2 ring-blue-500 ring-inset' : ''}`}
            >
              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                day.isToday ? 'bg-blue-900 text-white' : day.isPast ? 'text-gray-400' : 'text-gray-700'
              }`}>
                {day.day}
              </span>
              {day.hasEvent && (
                <div className="flex justify-center gap-0.5 mt-0.5">
                  {Array.from({ length: Math.min(day.eventCount, 3) }).map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  ))}
                </div>
              )}
              {day.isPast && <div className="absolute inset-0 bg-gray-50 bg-opacity-50"></div>}
            </div>
          );
        })}
      </div>

      {selectedDate && dayEvents.length > 0 && (
        <div className="border-t border-gray-100 p-3 space-y-2">
          <p className="text-xs font-semibold text-gray-700">
            Events on {selectedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
          {dayEvents.map((event, i) => (
            <div key={event.id || i}
              onClick={() => onEventClick?.(event)}
              className="flex items-center gap-2 p-2 bg-green-50 rounded-lg hover:bg-green-100 cursor-pointer transition">
              <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-gray-900 truncate">{event.title}</p>
                <p className="text-xs text-gray-500 truncate">{event.location || 'No location'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FutureCalendar;

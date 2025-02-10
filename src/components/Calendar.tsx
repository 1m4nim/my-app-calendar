import React, { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";
import "./Calendar.css";

type Event = {
  id: string;
  title: string;
  time: string; // 時間を追加
};

type Events = {
  [date: string]: Event[];
};

const getSunday = (date: Date) => {
  const day = date.getDay();
  const diff = date.getDate() - day;
  return new Date(date.setDate(diff));
};

const getWeekDates = (startDate: Date) => {
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return date.toISOString().split("T")[0];
  });
};

const getWeekDays = () => ["日", "月", "火", "水", "木", "金", "土"];

const Calendar: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Events>({});
  const [newEvent, setNewEvent] = useState<{
    [key: string]: { title: string; time: string };
  }>({});

  // 初期データのロード
  useEffect(() => {
    const savedEvents = localStorage.getItem("events");
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  // イベントが変更されたときにローカルストレージに保存
  useEffect(() => {
    if (Object.keys(events).length > 0) {
      localStorage.setItem("events", JSON.stringify(events));
    }
  }, [events]);

  const today = new Date();
  const startOfWeek = getSunday(new Date());
  const weekDates = getWeekDates(startOfWeek);
  const weekDays = getWeekDays();

  const addEvent = (date: string) => {
    if (!newEvent[date]) return;

    const newEventObj: Event = {
      id: Math.random().toString(),
      title: newEvent[date].title,
      time: newEvent[date].time,
    };

    setEvents((prev) => {
      const updatedEvents = {
        ...prev,
        [date]: [...(prev[date] || []), newEventObj],
      };
      return updatedEvents;
    });

    setNewEvent({ ...newEvent, [date]: { title: "", time: "" } });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceDate = source.droppableId;
    const destDate = destination.droppableId;

    if (sourceDate === destDate) {
      const updatedEvents = [...events[sourceDate]];
      const [movedItem] = updatedEvents.splice(source.index, 1);
      updatedEvents.splice(destination.index, 0, movedItem);
      setEvents({ ...events, [sourceDate]: updatedEvents });
    } else {
      const sourceEvents = [...(events[sourceDate] || [])];
      const [movedItem] = sourceEvents.splice(source.index, 1);
      const destEvents = [...(events[destDate] || []), movedItem];

      setEvents({
        ...events,
        [sourceDate]: sourceEvents,
        [destDate]: destEvents,
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="calendar">
        <div className="week">
          {weekDates.map((date, index) => (
            <div key={date} className="day">
              <p className="weekday">{weekDays[index]}</p>
              <h3
                className="date"
                onClick={() => navigate(`/day/${date}`)}
                style={{
                  color:
                    date === today.toISOString().split("T")[0] ? "red" : "blue",
                }}
              >
                {date}
              </h3>
              <Droppable droppableId={date}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="events"
                  >
                    {(events[date] || [])
                      .sort((a, b) => a.time.localeCompare(b.time)) // 時間順に並べ替え
                      .map((event, index) => (
                        <Draggable
                          key={event.id}
                          draggableId={event.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="event"
                            >
                              {event.title} ({event.time})
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <input
                type="text"
                value={newEvent[date]?.title || ""}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    [date]: { ...newEvent[date], title: e.target.value },
                  })
                }
                placeholder="予定を追加"
              />
              <input
                type="time"
                value={newEvent[date]?.time || ""}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    [date]: { ...newEvent[date], time: e.target.value },
                  })
                }
                placeholder="時間を選択"
              />
              <button onClick={() => addEvent(date)}>追加</button>
            </div>
          ))}
        </div>
      </div>
    </DragDropContext>
  );
};

export default Calendar;

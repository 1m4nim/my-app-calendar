import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";
import "./Calendar.css";

type Event = {
  id: string;
  title: string;
};

type Events = {
  [date: string]: Event[];
};

const initialEvents: Events = {
  "2024-02-07": [{ id: "1", title: "会議 10:00" }],
  "2024-02-08": [{ id: "2", title: "ランチ 12:30" }],
};

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<Events>(initialEvents);
  const navigate = useNavigate();

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return; // ドラッグ先がない場合は処理しない

    const { source, destination } = result;
    const sourceDate = source.droppableId;
    const destDate = destination.droppableId;

    // 同じ日付内での移動
    if (sourceDate === destDate) {
      const updatedEvents = [...events[sourceDate]];
      const [movedItem] = updatedEvents.splice(source.index, 1);
      updatedEvents.splice(destination.index, 0, movedItem);
      setEvents({ ...events, [sourceDate]: updatedEvents });
    } else {
      // 異なる日付間での移動
      const sourceEvents = [...events[sourceDate]];
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
        {Object.keys(events).map((date) => (
          <div key={date} className="day">
            <h3
              onClick={() => navigate(`/day/${date}`)}
              style={{ cursor: "pointer", color: "blue" }}
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
                  {events[date].map((event, index) => (
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
                          {event.title}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default Calendar;

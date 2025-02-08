import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";
import "./Calendar.css";

const initialEvents = {
  "2024-02-07": [{ id: "1", title: "会議 10:00" }],
  "2024-02-08": [{ id: "2", title: "ランチ 12:30" }],
};

const Calendar: React.FC = () => {
  const [events, setEvents] = useState(initialEvents);
  const navigate = useNavigate();

  const onDragEnd = (result: any) => {
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

import { useState } from "react";

export function CalendarMockup() {
  const [selectedDate, setSelectedDate] = useState<number | null>(15);
  const [hoverEvent, setHoverEvent] = useState<{ day: number; title: string } | null>(null);

  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const events: Record<number, { title: string; time: string }[]> = {
    5: [{ title: "Design review", time: "10:00 AM" }],
    12: [{ title: "Sprint planning", time: "2:00 PM" }],
    15: [{ title: "Product demo", time: "11:00 AM" }],
    20: [{ title: "Team sync", time: "3:00 PM" }],
    25: [{ title: "Launch prep", time: "9:00 AM" }],
  };

  return (
    <div className="rounded-2xl border border-[#EAEAEA] shadow-lg overflow-hidden bg-white p-3 h-[420px]">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-[#111111]">March 2026</h3>
        <div className="flex gap-1 text-xs">
          <button className="px-2 py-1 rounded-md hover:bg-[#FAFAFA]">Today</button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-[#111111]/50 mb-2">
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const hasEvents = events[day];
          const isSelected = selectedDate === day;
          return (
            <div
              key={day}
              className={`relative p-1 text-center rounded-lg cursor-pointer transition-all ${
                isSelected ? "bg-[#4F46E5]/10 ring-1 ring-[#4F46E5]" : "hover:bg-[#FAFAFA]"
              }`}
              onClick={() => setSelectedDate(day)}
              onMouseEnter={() =>
                hasEvents && setHoverEvent({ day, title: hasEvents[0].title })
              }
              onMouseLeave={() => setHoverEvent(null)}
            >
              <span className={`text-sm ${isSelected ? "text-[#4F46E5] font-medium" : "text-[#111111]/70"}`}>
                {day}
              </span>
              {hasEvents && (
                <div className="w-1 h-1 rounded-full bg-[#4F46E5] mx-auto mt-0.5"></div>
              )}
              {hoverEvent?.day === day && (
                <div className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-[#111111] text-white text-[10px] rounded whitespace-nowrap">
                  {hoverEvent.title}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {selectedDate && events[selectedDate] && (
        <div className="mt-4 p-2 border-t border-[#EAEAEA] text-xs">
          <span className="font-medium">Events for Mar {selectedDate}:</span>
          <ul className="mt-1 space-y-1">
            {events[selectedDate].map((e, i) => (
              <li key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]"></div>
                <span>{e.title}</span>
                <span className="text-[#111111]/40">{e.time}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
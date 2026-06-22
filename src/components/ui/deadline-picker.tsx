"use client";

import React, { useState, useEffect } from "react";
import { format, addDays, isSameDay, startOfDay } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DeadlinePickerProps {
  value: string | null;
  onChange: (value: string | null) => void;
  trigger?: React.ReactNode;
}

export function DeadlinePicker({ value, onChange, trigger }: DeadlinePickerProps) {
  const [date, setDate] = useState<Date | undefined>(value ? new Date(value) : undefined);
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("00");
  const [ampm, setAmpm] = useState("PM");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (value) {
      const d = new Date(value);
      setDate(d);
      let h = d.getHours();
      const m = d.getMinutes();
      const ampmVal = h >= 12 ? "PM" : "AM";
      h = h % 12 || 12;
      setHour(h.toString().padStart(2, '0'));
      setMinute(m.toString().padStart(2, '0'));
      setAmpm(ampmVal);
    } else {
      setDate(undefined);
    }
  }, [value, isOpen]);

  const handleSave = (selectedDate: Date | undefined, h: string, m: string, ap: string) => {
    if (!selectedDate) {
      onChange(null);
      return;
    }
    const newDate = new Date(selectedDate);
    let hours = parseInt(h);
    if (ap === "PM" && hours < 12) hours += 12;
    if (ap === "AM" && hours === 12) hours = 0;
    
    newDate.setHours(hours, parseInt(m), 0, 0);
    // store UTC, display local by using toISOString() which produces UTC
    onChange(newDate.toISOString());
  };

  const onDateSelect = (d: Date | undefined) => {
    setDate(d);
    if (d) {
      handleSave(d, hour, minute, ampm);
    }
  };

  const handleTimeChange = (type: 'hour' | 'minute' | 'ampm', val: string) => {
    let newH = hour;
    let newM = minute;
    let newAp = ampm;

    if (type === 'hour') {
      newH = val;
      setHour(val);
    } else if (type === 'minute') {
      newM = val;
      setMinute(val);
    } else if (type === 'ampm') {
      newAp = val;
      setAmpm(val);
    }

    if (date) {
      handleSave(date, newH, newM, newAp);
    }
  };

  const setQuickDate = (daysToAdd: number) => {
    const d = addDays(startOfDay(new Date()), daysToAdd);
    // Default time to 5 PM for quick dates
    d.setHours(17, 0, 0, 0); 
    setDate(d);
    setHour("05");
    setMinute("00");
    setAmpm("PM");
    handleSave(d, "05", "00", "PM");
    setIsOpen(false);
  };

  const formatButtonText = () => {
    if (!value) return "Set deadline";
    const d = new Date(value);
    const today = new Date();
    const tomorrow = addDays(today, 1);
    
    if (isSameDay(d, today)) return `Today ${format(d, "h:mm a")}`;
    if (isSameDay(d, tomorrow)) return `Tomorrow ${format(d, "h:mm a")}`;
    return format(d, "MMM d, yyyy h:mm a");
  };

  const isOverdue = value ? new Date(value) < new Date() : false;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {trigger || (
          <Button 
            variant="outline" 
            size="sm" 
            className={`h-8 font-medium ${isOverdue ? 'border-red-200 text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700' : value ? 'text-indigo-600 border-indigo-200 bg-indigo-50 hover:bg-indigo-100' : 'text-neutral-500 hover:text-neutral-900'}`}
          >
            <CalendarDays className="w-4 h-4 mr-2" />
            {formatButtonText()}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 rounded-2xl shadow-lg border-neutral-200" align="start">
        <div className="flex flex-col sm:flex-row">
          <div className="p-3 border-b sm:border-b-0 sm:border-r border-neutral-100 bg-neutral-50/50 flex flex-row sm:flex-col gap-2 min-w-[120px]">
            <Button variant="ghost" size="sm" className="justify-start text-xs font-medium" onClick={() => setQuickDate(0)}>
              Today
            </Button>
            <Button variant="ghost" size="sm" className="justify-start text-xs font-medium" onClick={() => setQuickDate(1)}>
              Tomorrow
            </Button>
            <Button variant="ghost" size="sm" className="justify-start text-xs font-medium" onClick={() => setQuickDate(7)}>
              Next Week
            </Button>
            <div className="flex-1" />
            {value && (
              <Button variant="ghost" size="sm" className="justify-start text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => { onChange(null); setIsOpen(false); }}>
                <X className="w-3 h-3 mr-2" /> Clear
              </Button>
            )}
          </div>
          
          <div className="p-3">
            <Calendar
              mode="single"
              selected={date}
              onSelect={onDateSelect}
              initialFocus
              className="p-0 border-0"
            />
            
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-neutral-100">
              <Clock className="w-4 h-4 text-neutral-400" />
              <div className="flex items-center gap-1">
                <Select value={hour} onValueChange={(v) => handleTimeChange('hour', v)}>
                  <SelectTrigger className="w-[60px] h-8 px-2 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="min-w-[60px]">
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i+1} value={(i+1).toString().padStart(2, '0')}>{i+1}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-neutral-500 font-bold">:</span>
                <Select value={minute} onValueChange={(v) => handleTimeChange('minute', v)}>
                  <SelectTrigger className="w-[60px] h-8 px-2 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="min-w-[60px]">
                    {['00', '15', '30', '45'].map(m => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={ampm} onValueChange={(v) => handleTimeChange('ampm', v)}>
                  <SelectTrigger className="w-[60px] h-8 px-2 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="min-w-[60px]">
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './CustomClock.module.css';

const H  = { h: 0,   m: 180 },
      V  = { h: 270, m: 90 },
      TL = { h: 180, m: 270 },
      TR = { h: 0,   m: 270 },
      BL = { h: 180, m: 90 },
      BR = { h: 0,   m: 90 },
      E  = { h: 135, m: 135 };

const digits = [
  // 0
  [
    BR, H,  H,  BL,
    V,  BR, BL, V,
    V,  V,  V,  V,
    V,  V,  V,  V,
    V,  TR, TL, V,
    TR, H,  H,  TL,
  ],
  // 1
  [
    BR, H,  BL, E,
    TR, BL, V,  E,
    E,  V,  V,  E,
    E,  V,  V,  E,
    BR, TL, TR, BL,
    TR, H,  H,  TL,
  ],
  // 2
  [
    BR, H,  H,  BL,
    TR, H,  BL, V,
    BR, H,  TL, V,
    V,  BR, H,  TL,
    V,  TR, H,  BL,
    TR, H,  H,  TL,
  ],
  // 3
  [
    BR, H,  H,  BL,
    TR, H,  BL, V,
    E,  BR, TL, V,
    E,  TR, BL, V,
    BR, H,  TL, V,
    TR, H,  H,  TL,
  ],
  // 4
  [
    BR, BL, BR, BL,
    V,  V,  V,  V,
    V,  TR, TL, V,
    TR, H,  BL, V,
    E,  E,  V,  V,
    E,  E,  TR, TL,
  ],
  // 5
  [
    BR, H,  H,  BL,
    V,  BR, H,  TL,
    V,  TR, H,  BL,
    TR, H,  BL, V,
    BR, H,  TL, V,
    TR, H,  H,  TL,
  ],
  // 6
  [
    BR, H,  H,  BL,
    V,  BR, H,  TL,
    V,  TR, H,  BL,
    V,  BR, BL, V,
    V,  TR, TL, V,
    TR, H,  H,  TL,
  ],
  // 7
  [
    BR, H,  H,  BL,
    TR, H,  BL, V,
    E,  E,  V,  V,
    E,  E,  V,  V,
    E,  E,  V,  V,
    E,  E,  TR, TL,
  ],
  // 8
  [
    BR, H,  H,  BL,
    V,  BR, BL, V,
    V,  TR, TL, V,
    V,  BR, BL, V,
    V,  TR, TL, V,
    TR, H,  H,  TL,
  ],
  // 9
  [
    BR, H,  H,  BL,
    V,  BR, BL, V,
    V,  TR, TL, V,
    TR, H,  BL, V,
    BR, H,  TL, V,
    TR, H,  H,  TL,
  ],
];

const normalizeAngle = (next: number, prev: number) => {
  const delta = ((next - prev) % 360 + 360) % 360;
  return prev + delta;
};

const getTimeDigits = () => {
  const now = new Date();
  return [
    now.getHours(),
    now.getMinutes(),
    now.getSeconds()
  ].flatMap((val) => String(val).padStart(2, "0").split("").map(Number));
};

const randomAngle = () => Math.floor(Math.random() * 360);

const ClockSegment = ({ h, m, initial }: { h: number; m: number; initial: boolean }) => {
  const prev = useRef({ h: 0, m: 0 });
  
  // Use a ref and simple condition so we don't recalculate uncontrollably, 
  // but react handles the initial render nicely.
  const hourAngle = normalizeAngle(h, prev.current.h);
  const minuteAngle = normalizeAngle(m, prev.current.m);
  
  // Update prev for next render
  useEffect(() => {
    prev.current = { h: hourAngle, m: minuteAngle };
  }, [hourAngle, minuteAngle]);
  
  return (
    <div
      className={styles.clock}
      style={{
        "--hour-angle": initial ? randomAngle() : hourAngle,
        "--minute-angle": initial ? randomAngle() : minuteAngle,
        "--dur": initial ? 1 : 0.4
      } as React.CSSProperties}
    />
  );
};

export const CustomClock = () => {
  const [time, setTime] = useState(Array(6).fill(0));
  const [initial, setInitial] = useState(true);

  useEffect(() => {
    let updateTimerId: NodeJS.Timeout;
    const updateTime = () => {
      setTime(getTimeDigits());
      const now = Date.now();
      const delay = 1000 - (now % 1000);
      updateTimerId = setTimeout(updateTime, delay);
    };
    
    const initialTimerId = setTimeout(() => {
      setInitial(false);
      updateTime();
    }, 600);
    
    return () => {
      clearTimeout(updateTimerId);
      clearTimeout(initialTimerId);
    };
  }, []);

  return (
    <div className={styles.appContainer}>
      <div className={styles.app}>
        {time.map((t, i) => (
          <div key={i} className={styles.digit}>
            {digits[t].map(({ h, m }, j) => <ClockSegment key={`${i}-${j}`} h={h} m={m} initial={initial} />)}
          </div>
        ))}
      </div>
    </div>
  );
};

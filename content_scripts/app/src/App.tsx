import { useEffect, useMemo, useRef, useState } from 'react';
import $ from 'jquery';
import './App.css';

function App() {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const findPart = (evt: MouseEvent) => {
      if (!evt.target) return;
      if (ref.current?.contains(evt.target as Node)) return;
      const part = $(evt.target).hasClass('.part') ? $(evt.target) : $(evt.target).closest('.part');
      const elem = part.get(0);
      setElement(elem as HTMLElement);
    };
    window.addEventListener('mousemove', findPart);
    return () => {
      window.removeEventListener('mousemove', findPart);
    };
  }, []);

  useEffect(() => {
    if (!element) return;
    const prevOutline = element.style.outline;
    element.style.outline = '1px solid red';
    return () => {
      element.style.outline = prevOutline;
    };
  }, [element]);

  const info = useMemo(() => {
    if (!element) return null;
    let partviewId = null;
    let canvasId = null;
    let innerPartviewId = null;
    if (element.className.match(/partview-\d+/)) {
      partviewId = element.className.match(/partview-\d+/)![0].split('-')[1];
    }
    if (element.className.match(/canvas-\d+/)) {
      canvasId = element.className.match(/canvas-\d+/)![0].split('-')[1];
    }
    if (element.className.match(/inner-partview-\d+/)) {
      innerPartviewId = element.className.match(/inner-partview-\d+/)![0].split('-')[1];
    }
    return {
      partId: element.dataset.part_id,
      partType: element.dataset.part_type,
      partviewId,
      canvasId,
      innerPartviewId,
    };
  }, [element]);

  return (
    <div className="App" ref={ref}>
      <div className="title">
        <h1>Serpentine Dev Tools</h1>
      </div>
      <div className="content">
        <p>Hover over an element to highlight it.</p>
        {info && (
          <div className="part-info">
            <p>Part ID: {info.partId}</p>
            <p>Part type: {info.partType}</p>
            {info.partviewId && <p>Partview ID: {info.partviewId}</p>}
            {info.canvasId && <p>Canvas ID: {info.canvasId}</p>}
            {info.innerPartviewId && <p>Inner partview ID: {info.innerPartviewId}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

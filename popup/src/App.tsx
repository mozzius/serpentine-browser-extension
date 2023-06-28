import { useEffect, useState } from 'react';

const App = () => {
  const [tab, setTab] = useState<chrome.tabs.Tab | null>(null);

  useEffect(() => {
    if (!tab) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        setTab(tabs[0]);
      });
    } else {
      const listener = (newTabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
        if (newTabId === tab.id && changeInfo.status === 'complete') {
          setTab(tab);
        }
      }
      chrome.tabs.onUpdated.addListener(listener);
      return () => {
        chrome.tabs.onUpdated.removeListener(listener);
      }
    }
  }, [tab]);

  if (!tab || !tab.url) return null;

  const searchParams = new URL(tab.url).searchParams;

  const version = searchParams.get('version') || 'live';
  const noCache = searchParams.has('no-cache');

  return (
    <div>
      <p>Version:</p>
      <select
        value={noCache ? 'no-cache' : version}
        onChange={async (evt) => {
          const newVersion = evt.target.value;
          const newNoCache = newVersion === 'no-cache';
          const newSearchParams = new URLSearchParams(window.location.search);
          if (newNoCache) {
            newSearchParams.delete('version');
            newSearchParams.set('no-cache', 'true');
          } else {
            newSearchParams.set('version', newVersion);
            newSearchParams.delete('no-cache');
          }
          await chrome.tabs.update(tab.id!, {
            url: `${tab.url!.split('?')[0]}?${newSearchParams.toString()}`,
          });
          // reload tab
          chrome.tabs.reload(tab.id!);
        }}
      >
        <option value="live">Live</option>
        <option value="no-cache">Live (no-cache)</option>
        <option value="preview">Preview</option>
        <option value="draft">Draft</option>
      </select>
    </div>
  );
};

export default App;

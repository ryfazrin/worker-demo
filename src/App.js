import React, { useState } from "react";
import "./styles.css";

export default function App() {
  const [syncTime, setSyncTime] = useState(0);
  const [asyncTime, setAsyncTime] = useState(0);
  const [workerTime, setWorkerTime] = useState(0);

  const [syncTrace, setSyncTrace] = useState([]);
  const [asyncTrace, setAsyncTrace] = useState([]);
  const [workerTrace, setWorkerTrace] = useState([]);

  const sync = [];
  const async = [];
  const webWorker = [];

  const runSyncTest = () => {
    const d = new Date().getTime();
    setSyncTime("Waiting for the response ...");
    sync.push("Waiting");
    for (let i = 0; i < 10e8; i += 1) {}
    for (let i = 0; i < 10e8; i += 1) {}
    setSyncTime("Received the result ...");
    sync.push("Receiving");
    setSyncTime(new Date().getTime() - d + " ms");
  };

  const runAsyncTest = () => {
    const d = new Date().getTime();
    setTimeout(() => {
      setAsyncTime("Waiting for the response ...");
      async.push("Waiting");
      for (let i = 0; i < 10e8; i += 1) {}
    });
    setTimeout(() => {
      for (let i = 0; i < 10e8; i += 1) {}
      setAsyncTime("Received the result ...");
      async.push("Receiving");
      setAsyncTime(new Date().getTime() - d + " ms");
    });
  };

  const runWorkerTest = () => {
    const d = new Date().getTime();

    const worker = new Worker("/worker.js");

    setWorkerTime("Waiting for the response ...");
    webWorker.push("Waiting");

    worker.postMessage(d);
    worker.addEventListener("message", event => {
      setWorkerTime("Received the result ...");
      webWorker.push("Receiving");
      setWorkerTime(event.data + " ms");
    });

    setWorkerTime("Worker does not block your code");
    webWorker.push("Non-blocking");
  };

  return (
    <>
      <table>
        <tbody>
          <tr>
            <th>Synchronous</th>
            <th>Asynchronous</th>
            <th>Worker</th>
          </tr>
          <tr>
            <td>{syncTime}</td>
            <td>{asyncTime}</td>
            <td>{workerTime}</td>
          </tr>
          <tr>
            <td>
              <ul>
                {syncTrace.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </td>
            <td>
              <ul>
                {asyncTrace.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </td>
            <td>
              <ul>
                {workerTrace.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </td>
          </tr>
          <tr>
            <td>
              <button
                onClick={() => {
                  runSyncTest();
                  setSyncTrace(sync);
                }}
              >
                Run Test
              </button>
            </td>
            <td>
              <button
                onClick={() => {
                  runAsyncTest();
                  setAsyncTrace(async);
                }}
              >
                Run Test
              </button>
            </td>
            <td>
              <button
                onClick={() => {
                  runWorkerTest();
                  setWorkerTrace(webWorker);
                }}
              >
                Run Test
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

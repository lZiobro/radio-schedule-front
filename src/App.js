import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [dayOfTheWeek, setDayOfTheWeek] = useState(0);
  const [title, setTitle] = useState();
  const [author, setAuthor] = useState();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [imgUrl, setImgUrl] = useState();
  const [active, setActive] = useState(true);
  const [schedule, setSchedule] = useState();

  const baseApiUrl = "https://vps-7695c5a6.vps.ovh.net:9876";

  const getCurrentSchedule = () => {
    fetch(`${baseApiUrl}/getSchedule`)
      .then((response) => response.json())
      .then((data) => setSchedule(data));
  };
  useEffect(() => {
    getCurrentSchedule();
  }, []);

  const addBroadcast = () => {
    fetch(`${baseApiUrl}/addBroadcastToSchedule`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dayOfTheWeek,
        title,
        author,
        startTime,
        endTime,
        imgUrl,
        active,
      }),
    }).then((x) => getCurrentSchedule());
  };

  const changeBroadcastStatus = (broadcast) => {
    broadcast.active = !broadcast.active;
    fetch(`${baseApiUrl}/updateBroadcastStatus`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(broadcast),
    }).then((x) => getCurrentSchedule());
  };

  const removeBroadcastFromSchedule = (broadcast) => {
    fetch(`${baseApiUrl}/removeBroadcastFromSchedule`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(broadcast),
    }).then((x) => getCurrentSchedule());
  };

  return (
    <div className="App">
      <div>
        <label>
          Dzień tygodnia:
          <select
            onChange={(x) => {
              setDayOfTheWeek(x.target.value);
            }}
          >
            <option value="0">Poniedziałek</option>
            <option value="1">Wtorek</option>
            <option value="2">Środa</option>
            <option value="3">Czwartek</option>
            <option value="4">Piątek</option>
            <option value="5">Sobota</option>
            <option value="6">Niedziela</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Tytuł:{" "}
          <input
            type="text"
            onChange={(x) => setTitle(x.target.value)}
            value={title}
          />
        </label>
      </div>
      <div>
        <label>
          Autor:{" "}
          <input
            type="text"
            onChange={(x) => setAuthor(x.target.value)}
            value={author}
          />
        </label>
      </div>
      <div>
        <label>
          Godzina startu(format 00:00):{" "}
          <input
            type="text"
            onChange={(x) => setStartTime(x.target.value)}
            value={startTime}
          />
        </label>
        <div>
          <label>
            Godzina zakończenia(format 00:00):{" "}
            <input
              type="text"
              onChange={(x) => setEndTime(x.target.value)}
              value={endTime}
            />
          </label>
        </div>
        <div>
          <label>
            Link do obrazka poglądowego:{" "}
            <input
              type="text"
              onChange={(x) => setImgUrl(x.target.value)}
              value={imgUrl}
            />
          </label>
        </div>
        <div>
          <label>
            Aktywna:{" "}
            <input
              type="checkbox"
              onChange={(x) => setActive(!active)}
              checked={active}
            />
          </label>
        </div>

        <div>
          <button onClick={addBroadcast}>Dodaj Audycje</button>
        </div>

        <div>
          <p>Aktualna ramowka: </p>
          {schedule
            ?.sort((a, b) =>
              a.dayOfTheWeek > b.dayOfTheWeek
                ? 1
                : b.dayOfTheWeek > a.dayOfTheWeek
                ? -1
                : 0
            )
            .map((x, index) => (
              <div>
                {(index === 0 ||
                  schedule[index].dayOfTheWeek !==
                    schedule[index - 1].dayOfTheWeek) && (
                  <p>
                    {index !== 0 &&
                      schedule[index].dayOfTheWeek !==
                        schedule[index - 1].dayOfTheWeek && (
                        <div>
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                        </div>
                      )}
                    {x.dayOfTheWeek === 0
                      ? "Poniedziałek"
                      : x.dayOfTheWeek === 1
                      ? "Wtorek"
                      : x.dayOfTheWeek === 2
                      ? "Środa"
                      : x.dayOfTheWeek === 3
                      ? "Czwartek"
                      : x.dayOfTheWeek === 4
                      ? "Piątek"
                      : x.dayOfTheWeek === 5
                      ? "Sobota"
                      : "Niedziela"}
                  </p>
                )}
                <p>
                  {x.title} {x.author} {x.startTime} - {x.endTime} {x.imgUrl}{" "}
                  {x.active ? (
                    <button onClick={() => changeBroadcastStatus(x)}>
                      "Aktywna"
                    </button>
                  ) : (
                    <button onClick={() => changeBroadcastStatus(x)}>
                      "Wyłączona"
                    </button>
                  )}
                  <button onClick={() => removeBroadcastFromSchedule(x)}>
                    Usuń
                  </button>
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;

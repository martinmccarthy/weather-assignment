import './App.css';
import {useState} from 'react';
import axios from 'axios';

function App() {
  //states for app functionality
  const [days, setDays] = useState(1);
  const [city, setCity] = useState("");
  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState("");
  const [searchCards, setSearchCards] = useState([]);
  const [forecastSaved, setForecastSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);

  // used to set the path based on local host vs heroku
  var path = require('./Path.js');
  
  const cityHandler = (event) => {
    setCity(event.target.value);
  };
  const searchHandler = (event) => {
    setSearch(event.target.value);
  };

  async function saveForecast() {
    var payload = {city: city, forecast: cards};
    var _payload = JSON.stringify(payload);
    await axios({
      method: 'post',
      url: path.buildPath('/forecasts/add'),
      headers: {
        'Content-Type': 'application/json'
      },
      data: _payload
    }).then(function(response) {
      setForecastSaved(true);
    }).catch(function(error) {
      console.error(error);
    });

  }

  async function loadForecasts() {
    await axios ({
      method: 'get',
      url: path.buildPath('/forecasts/' + search),
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(function(response){
      console.log(response);
      var res = response.data;
      if(res == null) {
        setErrorMsg("City not found!");
        return;
      }
      setSearchCards(res.forecast);
    }).catch(function(error) {
      setSearchCards([]);
      console.error(error);
    })
  }

  async function deleteForecast() {
    var payload = {city: search};
    var _payload = JSON.stringify(payload);
    console.log(_payload);
    await axios ({
      method: 'delete',
      url: path.buildPath('/forecasts/delete'),
      headers: {
        'Content-Type': 'application/json'
      },
      data: _payload
    }).then(function(response) {
      setSearchCards([]);
    }).catch(function(error) {
      console.error(error);
    })
  }

  async function getCards() {
    setForecastSaved(false);
    var temp = [];
    await axios({
      method: 'get',
      url: 'http://api.weatherapi.com/v1/forecast.json',
      params: {key: process.env.REACT_APP_KEY, days: days, q: city}
    }).then(function(response) {
      var res = response.data;
      var forecast = res.forecast.forecastday;
      for(var i = 0; i < forecast.length; i++) {
        var dayInfo = {
          city: res.location.name,
          region: res.location.region,
          date: forecast[i].date,
          min_temp: forecast[i].day.mintemp_f,
          max_temp: forecast[i].day.maxtemp_f,
          avg_temp: forecast[i].day.avgtemp_f,
          condition: forecast[i].day.condition.text,
          condition_icon: forecast[i].day.condition.icon
        }
        temp.push(dayInfo);
      }
    }).catch(function(error) {
      console.error(error);
      setCards([]);
    });
    setCards(temp);
  }

  return (
    <div className="App">
      <div className="form">
        <h1>Search a City:</h1>
        <input type="input" placeholder="Enter a city" className="input" value={city} onChange={cityHandler}/>
        <h1>Search the forecast for up to 3 days:</h1>
        <button type="button" className="daysBtn" onClick={() => setDays(1)}>1</button>
        <button type="button" className="daysBtn" onClick={() => setDays(2)}>2</button>
        <button type="button" className="daysBtn" onClick={() => setDays(3)}>3</button>
      </div>
      <br />
      <button type="button" className="btn" onClick={getCards}>Submit</button>
      <br /><br />
      <div id="resultContainer">
        <ul className="resultList">
          {cards.map((card) => (
            <li className="listElement" >
              <div className="card">
                <h1 id="cityName">{card.city}</h1>
                <h1 id="cityRegion">{card.region}</h1>
                <h1 id="date">{card.date}</h1>
                <h1 id="avgTemp">{card.avg_temp}°F</h1>
                <h1 id="tempRange">{card.min_temp}°F - {card.max_temp}°F</h1>
                <img id="conditionIcon" src={card.condition_icon} />
                <h1 id="condition">{card.condition}</h1>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <br />
      {cards.length > 0 && <button type="button" onClick={saveForecast}>Save Forecast</button>}
      <br />
      {forecastSaved && <label>Forecast Saved</label>}
      <div>
        <h1>Already saved a location? Look it up here!</h1>
        <br /><input type="input" className="input" placeholder="Search" value={search} onChange={searchHandler}/>
        <button type="button" className="loadBtn" onClick={loadForecasts}>Load Forecasts</button>
        {errorMsg && <label>Unable to find city in the database</label>}
        <div id="resultContainer">
          <ul className="resultList">
            {searchCards.map((card) => (
              <li className="listElement">
                <div className="card">
                  <h1 id="cityName">{card.city}</h1>
                  <h1 id="cityRegion">{card.region}</h1>
                  <h1 id="date">{card.date}</h1>
                  <h1 id="avgTemp">{card.avg_temp}°F</h1>
                  <h1 id="tempRange">{card.min_temp}°F - {card.max_temp}°F</h1>
                  <img id="conditionIcon" src={card.condition_icon} />
                  <h1 id="condition">{card.condition}</h1>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {searchCards.length > 0 && <div>
          <h1>Don't need this forecast anymore?</h1>
          <button onClick={deleteForecast}>Delete</button>
        </div>}
      </div>
    </div>
  );
}

export default App;

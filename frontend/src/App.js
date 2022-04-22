import logo from './logo.svg';
import './App.css';
import {useState} from 'react';
import axios from 'axios';

function App() {
  const [days, setDays] = useState(1);
  const [city, setCity] = useState("");
  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState("");
  const [searchCards, setSearchCards] = useState([]);

  var path = require('./Path.js');
  
  const cityHandler = (event) => {
    setCity(event.target.value);
  };
  const dayHandler = (event) => {
    setDays(event.target.value);
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
      console.log(response);
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
      var res = response.data;
      console.log(res);
      setSearchCards(res.forecast);
    }).catch(function(error) {
      console.error(error);
    })
  }

  async function getCards() {
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
    });
    setCards(temp);
  }

  function doSearch() {
    getCards();
  };

  return (
    <div className="App">
      <div>

      </div>
      <form>
        <input type="input" placeholder="Enter a city" value={city} onChange={cityHandler}/>
        <select name="days" onChange={dayHandler}>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          {/*<option value={4}>4</option>
          <option value={5}>5</option>
          <option value={6}>6</option>
          <option value={7}>7</option>
          <option value={8}>8</option>
          <option value={9}>9</option>
          <option value={10}>10</option>*/}
        </select>
        <button type="button" onClick={doSearch}>Submit</button>
      </form>
      <div id="resultContainer">
        <ul className="resultList">
          {cards.map((card) => (
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
      <div>
        <br /><button type="button" onClick={saveForecast}>Save Forecast</button>
        <br /><input type="input" placeholder="Search" value={search} onChange={searchHandler}/>
        <button type="button" onClick={loadForecasts}>Load Forecasts</button>
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
      </div>
      
    </div>
  );
}

export default App;

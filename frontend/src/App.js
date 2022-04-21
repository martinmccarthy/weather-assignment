import logo from './logo.svg';
import './App.css';
import {useState} from 'react';
import axios from 'axios';

function App() {
  const [days, setDays] = useState(1);
  const [city, setCity] = useState("");
  const [cards, setCards] = useState([]);
  const [info, setInfo] = useState([]);
  
  const cityHandler = (event) => {
    setCity(event.target.value);
  };
  const dayHandler = (event) => {
    setDays(event.target.value);
  };

  async function getCards() {
    var temp = [];
    console.log(process.env.REACT_APP_KEY);
    await axios({
      method: 'get',
      url: 'http://api.weatherapi.com/v1/forecast.json',
      params: {key: process.env.REACT_APP_KEY, q: city, days: days}
    }).then(function(response) {
      var res = response.data;
      var forecast = res.forecast.forecastday;
      for(var i = 0; i < forecast.length; i++) {
        var dayInfo = {
          city: res.location.name,
          date: forecast[i].date,
          min_temp: forecast[i].day.mintemp_f,
          max_temp: forecast[i].day.maxtemp_f,
          avg_temp: forecast[i].day.avgtemp_f,
          condition: forecast[i].day.condition.text
        }
        temp.push(dayInfo);
      }
    })
    setCards(temp);
  }

  function doSearch() {
    // pull the items and then populate the cards
    getCards();

  };

  return (
    <div className="App">
      <form>
        <input type="input" placeholder="Enter a city" value={city} onChange={cityHandler}/>
        <select name="days" onChange={dayHandler}>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
          <option value={6}>6</option>
          <option value={7}>7</option>
          <option value={8}>8</option>
          <option value={9}>9</option>
          <option value={10}>10</option>
        </select>
        <button type="button" onClick={doSearch}>Submit</button>
      </form>
      <ul>
        {cards.map((card) => (
          <li>
            <div>
              <h1>{card.city}</h1>
              <h1>{card.date}</h1>
              <h1>{card.condition}</h1>
              <h1>{card.avg_temp}</h1>
              <h1>{card.min_temp} - {card.max_temp}</h1>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

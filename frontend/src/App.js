import logo from './logo.svg';
import './App.css';
import {useState} from 'react';

function App() {
  const [days, setDays] = useState(1);
  const [city, setCity] = useState("");
  const [cards, setCards] = useState([]);
  const cityHandler = (event) => {
    setCity(event.target.value);
  };
  const dayHandler = (event) => {
    setDays(event.target.value);
  };

  function populate() {
    var temp = [];
    for(var i = 0; i < days; i++) {
      var cardInfo = {
        min_temp: 0,
        max_temp: 50,
        avg_temp: 41,
        date: "2022-04-21",
        condition: "sunny",
        city: "london"
      }
      temp.push(cardInfo);
    };
    setCards(temp);
  }

  function doSearch() {
    // pull the items and then populate the cards
    populate();
    

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
      <h1>{days}</h1>
      <h1>{city}</h1>
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

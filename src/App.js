import './App.css';
import Footer from './components/Footer/Footer.js';
import Search from './components/Search/Search.js';
import Criteria from './components/Criteria/Criteria.js';
import ResultArea from './components/Result/ResultArea.js';
import Header from './components/Header/Header.js';
import React, { useState } from 'react';

const cr = {
  "transfersAmount": [
    1,
    2,
    3
  ],
  "transfersTimeRange": [
    0,
    24
  ],
  "transportType": [
    "Самолет",
    "Поезд"
  ],
  "journeyTimeRange": [
    0,
    24
  ]
}

const d = [{
  "header": {
    "startDate": "2024-10-01T10:00:00",
    "endDate": "2024-10-02T10:00:00"
  },
  "route": [
    {
      "type": "way",
      "transport": "Поезд",
      "fromStation": "A_s1",
      "toStation": "B_s1",
      "fromCity": "A",
      "toCity": "B",
      "startDate": "2024-10-01T10:00:00",
      "endDate": "2024-10-01T17:00:00"
    },
  ]
},
{
  "header": {
    "startDate": "2024-10-01T10:00:00",
    "endDate": "2024-10-02T10:00:00"
  },
  "route": [
    {
      "type": "way",
      "transport": "Поезд",
      "fromStation": "A_s1",
      "toStation": "B_s1",
      "fromCity": "A",
      "toCity": "B",
      "startDate": "2024-10-01T10:00:00",
      "endDate": "2024-10-01T17:00:00"
    },
    {
      "type": "transfer",
      "fromStation": "B_s1",
      "toStation": "B_s1",
      "fromCity": "B",
      "toCity": "B",
      "startDate": "2024-10-01T17:00:00",
      "endDate": "2024-10-01T20:00:00"
    },
    {
      "type": "way",
      "transport": "Поезд",
      "fromStation": "B_s1",
      "toStation": "C_s1",
      "fromCity": "B",
      "toCity": "C",
      "startDate": "2024-10-01T20:00:00",
      "endDate": "2024-10-02T10:00:00"
    },
  ]
},
{
  "header": {
    "startDate": "2024-10-01T10:00:00",
    "endDate": "2024-10-02T10:00:00"
  },
  "route": [
    {
      "type": "way",
      "transport": "Поезд",
      "fromStation": "A_s1",
      "toStation": "B_s1",
      "fromCity": "A",
      "toCity": "B",
      "startDate": "2024-10-01T10:00:00",
      "endDate": "2024-10-01T17:00:00"
    },
    {
      "type": "transfer",
      "fromStation": "B_s1",
      "toStation": "B_s1",
      "fromCity": "B",
      "toCity": "B",
      "startDate": "2024-10-01T17:00:00",
      "endDate": "2024-10-01T20:00:00"
    },
    {
      "type": "way",
      "transport": "Поезд",
      "fromStation": "B_s1",
      "toStation": "C_s1",
      "fromCity": "B",
      "toCity": "C",
      "startDate": "2024-10-01T20:00:00",
      "endDate": "2024-10-02T10:00:00"
    },
  ]
},
{
  "header": {
    "startDate": "2024-10-01T10:00:00",
    "endDate": "2024-10-02T10:00:00"
  },
  "route": [
    {
      "type": "way",
      "transport": "Поезд",
      "fromStation": "A_s1",
      "toStation": "B_s1",
      "fromCity": "A",
      "toCity": "B",
      "startDate": "2024-10-01T10:00:00",
      "endDate": "2024-10-01T17:00:00"
    },
    {
      "type": "transfer",
      "fromStation": "B_s1",
      "toStation": "B_s1",
      "fromCity": "B",
      "toCity": "B",
      "startDate": "2024-10-01T17:00:00",
      "endDate": "2024-10-01T20:00:00"
    },
    {
      "type": "way",
      "transport": "Поезд",
      "fromStation": "B_s1",
      "toStation": "C_s1",
      "fromCity": "B",
      "toCity": "C",
      "startDate": "2024-10-01T20:00:00",
      "endDate": "2024-10-02T10:00:00"
    },
  ]
},
{
  "header": {
    "startDate": "2024-10-01T10:00:00",
    "endDate": "2024-10-02T10:00:00"
  },
  "route": [
    {
      "type": "way",
      "transport": "Поезд",
      "fromStation": "A_s1",
      "toStation": "B_s1",
      "fromCity": "A",
      "toCity": "B",
      "startDate": "2024-10-01T10:00:00",
      "endDate": "2024-10-01T17:00:00"
    },
    {
      "type": "transfer",
      "fromStation": "B_s1",
      "toStation": "B_s1",
      "fromCity": "B",
      "toCity": "B",
      "startDate": "2024-10-01T17:00:00",
      "endDate": "2024-10-01T20:00:00"
    },
    {
      "type": "way",
      "transport": "Поезд",
      "fromStation": "B_s1",
      "toStation": "C_s1",
      "fromCity": "B",
      "toCity": "C",
      "startDate": "2024-10-01T20:00:00",
      "endDate": "2024-10-02T10:00:00"
    },
  ]
}]

function App() {
  const [outputReceived, setOutputReceived] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [criteria, setCriteria] = useState({});

  const handleSearchSubmit = (searchParams) => {
    setOutputReceived(false);
    setLoading(true)
    setTimeout(() => {
      setData(d);
      setCriteria(cr);
      setOutputReceived(true);
      setLoading(false)
    }, 2000);
  };

  const handleMoreButton = () => {
    setData(data.concat(d))
  }

  const handleCriteriaChange = (params) => {

  }

  return (
    <div className='Window'>
      <div className={`Top ${outputReceived ? '' : 'top-large'}`}>
        <Header />
        <Search setOutputReceived={setOutputReceived} handleSearchSubmit={handleSearchSubmit} />
      </div>
      {(() => {
        if (outputReceived) {
          return (
            <div className='Output'>
              <Criteria criteria={criteria} handleCriteriaChange={handleCriteriaChange} />
              <ResultArea data={data} handleMoreButton={handleMoreButton} />
            </div>
          )
        } else if (loading) {
          return (
            <div className='Info'>
              <img src="loading.gif" alt="Loading..."  width="5%" height="20%"/>
            </div>
          )
        } else {
          return (
            <div className='Info'>
              <div>Информация</div>
            </div>
          )
        }
      })()}
      <div className='Bottom'>
        <hr className='Line' />
        <Footer />
      </div>
    </div >
  );
}

export default App;
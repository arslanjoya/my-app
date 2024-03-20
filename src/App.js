import './App.css';
import  Navbar from './components/Navbar';
import  Textform from './components/Textform';
import React, { useState } from 'react';
import  Alert from './components/Alert';

function App() {
  const [mode, setmode] = useState('light');
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type)=>
  {
    setAlert({
      msg:message,
      type:type,
    })
    setTimeout(() => {
      setAlert(null);
    }, 1000);
  }
 
  const toggleMode = ()=>
  {
    if(mode === 'light')
    {
      setmode('dark'); 
      document.body.style.backgroundColor ='#042743';
      showAlert("Dark mode has been enabled", "Success");
    }
    else
    {
      setmode('light');
      document.body.style.backgroundColor ='white';
      showAlert("Light mode has been enabled", "Success");
    }
  }
  return (
    <>
    <Navbar title="TextUtiles" mode={mode} toggleMode= {toggleMode}/>
    <Alert  alert ={alert} />
      <div className="container my-3">
      <Textform showAlert={showAlert} heading="Enter your Comment" mode={mode}/>
    </div>

   
  </>
  );
}

export default App;

import React, { useState } from 'react';
export default function Textform(props){
  const handelUpClick = ()=>
  {
    console.log('you clicked on Change text'+ text);
    let newText = text.toUpperCase();
    setText(newText);
    props.showAlert("The text has been changed to Uppercase", "Success");
  }

  const handelLoClick = ()=>
  {
    console.log('you clicked on Change text'+ text);
    let newText = text.toLowerCase();
    setText(newText);
    props.showAlert("The text has been changed to Lowerase", "Success");
  }
  const handleExtraSpace = () =>
  {
    let newText = text.split(/[ ] + /);
    setText(newText.join(" "))
    props.showAlert("Extra Space Remove from text", "Success");
  }
  const handelClear = ()=>
  {
    let newText = '';
    setText(newText);
    props.showAlert(text +" is cleared","Success");
  }
  const handleCopy = () =>
  {
    var text = document.getElementById('box');
    text.select();
    navigator.clipboard.writeText(text.value);
    props.showAlert("Text is copied ","Success")
  }
  const handleOnChange = (event)=>
  {
    console.log('On change');
    setText(event.target.value);
  }
  const [text, setText] = useState('');
    return (
      <>
      <div style={{color: props.mode==='dark'?'white':'black'}}>
        <h1>{props.heading}</h1>
        <div className="mb-3">
            <textarea className="form-control" value={text} onChange={handleOnChange} style={{background: props.mode==='dark'?'grey':'white', color: props.mode=== 'dark'?'white':'black'}} placeholder='Enter your text' id="box" rows='8'></textarea>
        </div>
        <button className='btn btn-primary mx-1 mt-2' onClick={handelUpClick}>Convert to UperCase</button>
        <button className='btn btn-primary mx-1 mt-2' onClick={handelLoClick}>Convert to LowerCase</button>
        <button className='btn btn-primary mx-1 mt-2' onClick={handleExtraSpace}>Remove Extra Spaces</button>
        <button className='btn btn-primary mx-1 mt-2' onClick={handelClear}>Clear</button>
        <button className='btn btn-primary mx-1 mt-2' onClick={handleCopy}>Copy Text</button>
      </div>

      <div className="container mt-3" style={{color: props.mode==='dark'?'white':'black'}}>
        <h1>Your text Summary</h1>
        <p>Words {text.split(" ").length} and {text.length}Characters</p>
        <h2>Preview</h2>
        <p>{text.length>0?text:"Enter something in the textbox to preview it here"}</p>
      </div>
      </>
    )
  }

import { useState,useEffect } from 'react'
import axios from "axios";
import logo from './logo.svg';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [inputData,setInputData]=useState('');
  const [file,setFile]=useState(null);
  const formData = new FormData();
  formData.append('file', file);
  const [textRendered,setTextRendered]=useState('');
  function getData() {
    axios.get(`/profile?sentence=${inputData}`)
    .then((response) => {
      const res =response.data
      console.log(res)
      setData(({
        corrected_sentence: res.corrected_sentence,
        namedConventions:res.named_conventions,
        nounphrases:res.nounphrases,
        sentiment:res.sentiment,
        tags:res.tags,
        words:res.words
      }))
    }).catch((error) => {  
      if (error.response) {
        console.log(error.response)
        }
    })}
    const {
      transcript,
      listening,
      resetTranscript,
      browserSupportsSpeechRecognition
    } = useSpeechRecognition();
  
    useEffect(()=>{console.log(listening)
    },[listening])
    useEffect(()=>{
      setInputData(transcript)
    },[transcript,listening])
   async function fileSubmitFunc(){
      if(file){
        axios.post('/upload',formData,{
          headers: {
            'Content-Type':'multipart/form-data',
          }
        }).then((response)=>{setTextRendered(response.data.text);console.log(response.data)})
        .catch(()=>setTextRendered('Error'))
      }
    }
  return (
    <div className="App">
      <div>
      Enter text here:  <input className='Input' type='text' value={inputData} onChange={(e)=>setInputData(e.target.value)}/>
       
       <div className='microphone'>
        <p>Microphone: {listening ? 'on' : 'off'} </p>
      {/* Buttons to start, stop, and reset speech recognition */}
      <button onClick={()=>{
        SpeechRecognition.startListening();
        }}>Start</button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
      <button onClick={resetTranscript}>Reset</button>

      {/* Display the transcribed speech */}
      {/* <p>{transcript}</p> */}
        </div>
        </div>
       <button onClick={getData}>Click</button>
        {data && <div>
            <p>{data.corrected_sentence}</p>
              <p><span className='Bold'>Sentiment:</span> {data.sentiment}</p>
              <p> <span className='Bold'>Named-Conventions</span>  {Object.keys(data.namedConventions).map(key=>(<div>{key}:{data.namedConventions[key]}</div>))}</p>
              <p> <span className='Bold'>Parts of Speech </span> {data.tags?data.tags.map((val,index)=>(<div key={index}>{val[0] }: { val[1]}</div>)):'Not found'}</p>
              <p><span className='Bold'>Words: </span>{data.words.map((val,index)=><div className='inline'>{val},</div>)}</p>
              <p><span className='Bold'>Noun Phrases:</span>{data.nounphrases.length>0?data.nounphrases.map((val,index)=><div className='inline'>{val},</div>):'Not found'}</p>
            </div>
        }
        <div className='scanner'>
          <input type='file' onChange={(e)=>{setFile(e.target.files[0]);}}/>
          <button onClick={fileSubmitFunc}>Submit</button>
        </div>
        {textRendered&&<p>{textRendered}</p>}
        
  
    </div>
  );
}

export default App;

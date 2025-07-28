import { useState,useEffect, useTransition } from "react"
import './App.css'
function App(){
  const [topic,settopic] = useState('');
  const [number,setno] = useState('');
  const [tone,settone] = useState('');
  const [utar,setutar]=useState({});
  const [pop, setpop] = useState(true)
  const [okay, setokay] = useState(false)
  const [name, setname] = useState('')
  const [email, setemail] = useState('')
  const [pending,setpending]= useState(true);
  const[loading,setloading]=useState(false)
  useEffect(() => {
  console.log("Updated utar:", utar);
}, [utar]);

  async function get()
  {
    const top=topic
    const num=number
    const ton=tone
    if(num>5){
      alert("number of question should be less the or equal to 5")
      return;
    }
    setpending(false)
     try {
      setloading(true)
      const response = await fetch('https://vedh-backend.onrender.com/ai/', {
        method: 'POST',
        headers: {
    "Content-Type": "application/json"
   },
        body: JSON.stringify({top,num,ton})
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        alert("Error occure")
      }
      const data = await response.json();
      console.log(data)
      setloading(false)
     setutar(() => data);
      setno('');
      settopic('');
      settone('');
    } catch (err) {
      setresult(null);
    }
  }

  async function user() {
        if (!name|| !email) {
           setokay(true)
            return;
        }
        try {
            const response = await fetch('https://vedh-backend.onrender.com/user/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            if (data==1){
                alert("email already exist");
                return;
            }
            if(data==2){
              alert("The limit of 10 user is hit ")
              return;
            }
            setpop(false)
            alert("You are Register You can generate only one MCQ with maximum 5 question");
        }
        catch (err) {
            alert(err)
        }
    }
  return(
    <div className="main">
       {
                pop &&
                <div className="register">
                    <h1>REGISTER</h1>
                    <div>
                        Name:<br />
                        <input value={name} onChange={(event) => setname(event.target.value)} type="text" required /><br />
                        Email:<br />
                        <input value={email} onChange={(event) => setemail(event.target.value.toLowerCase())} type="email" required /><br />
                        <button onClick={user} className='regbutton'>Register</button>
                    </div>
                    {
                okay&&
                <h2 style={{fontSize:'large',color:'red',fontWeight:'bolder'}}>Enter valid Name and Email</h2>
            }
                </div>
            }
      <header>
        <div className="log"></div>
        <h1 className="ved">Vedh</h1>
        <h1 className="head"><img className="img" src="https://cdn-icons-png.flaticon.com/256/12239/12239688.png"/>AI MCQ Generator</h1>
       <div className="topiclab" > Topic: <input value={topic} className="topic" onChange={(event)=>settopic(event.target.value)} type="text"/></div>
       <div className="numton">
        <div className="num"> 
         No.of MCQ: <input value={number}  onChange={(event)=>setno(event.target.value)} type="number"/>
         </div>
         <div className="ton">
         Tone: <input value={tone} onChange={(event)=>settone(event.target.value)} type="text"/>
         </div>
         </div>
         {
          !pop && pending &&
         <button onClick={get} className="generate">Generate</button>
         }
         {
          !pending &&
          <h2  className="trial">Your Trial has finish</h2>
         }
      </header>
     <div>
      
        {
          loading&&
        <img className="loading" src="https://media.tenor.com/PfFDd3eNE_gAAAAm/loading-load.webp"/>
        }
     {
      utar!=null&&
       Object.values(utar).map((item, index) => {
         return (
           <div className="resultdiv" key={index}>
             <h2>{index + 1}: {item.mcq}</h2>
             <ul>
               <li><span>a:</span> {item.option.a}</li>
               <li><span>b:</span> {item.option.b}</li>
               <li><span>c:</span> {item.option.c}</li>
               <li><span>d:</span> {item.option.d}</li>
             </ul>
             <p><span>Answer:</span> {item.correct}</p>
           </div>
         );
       })
     }
   </div>
    </div>
  )
}
export default App

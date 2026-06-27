import { useNavigate } from 'react-router-dom'
import './PageStyling.css' ;

export default function Home() {
  const navigate = useNavigate()

  return (
    <main className='main'>
      <div className='pageContainer'>
          <div className='pageBox'>
          <div className="homeHeadingContainer">
            <button
              onClick={() => navigate('/court-booking')}
              style={{
                background: 'none',
                border: 'none',
                padding: 10,
                margin: 0,
                cursor: 'pointer',
                fontFamily: 'Monaco, monospace, monospace',
                color: 'white',
                fontSize: '3em',
                fontWeight: 'bold',
                textDecoration: 'none',
                outline: 'none',
                width: '100%'
              }}
            >
              TennisToday
            </button>
          </div>
          <div>
            <div className='homeDescContainer'>
              <p>TennisToday is a website aimed at letting all residents in a community make use of their local amenities, or, put simply, play tennis today! Using this site, you can book a court at your local venue, go there, and play tennis! You can find a tutorial on how to use this website here.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

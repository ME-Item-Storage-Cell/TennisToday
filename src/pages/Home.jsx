import { useNavigate } from 'react-router-dom'
import './PageStyling.css'
import homeImage from './homeImages/homeImage.jpeg'

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
                fontSize: 'clamp(1.5rem, 5vw, 3rem)',
                fontWeight: 'bold',
                textDecoration: 'none',
                outline: 'none',
                width: '100%'
              }}
            >
              TennisToday
            </button>
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className='homeDescContainer' style={{ flex: 1, minWidth: '300px' }}>
              <p>TennisToday is a website aimed at letting all residents in a community make use of their local amenities, or, put simply, play tennis today! Using this site, you can book a court at your local venue, go there, and play tennis!</p>
            </div>
            <img src={homeImage} alt="Tennis court" style={{ width: '100%', maxWidth: '400px', borderRadius: '8px', flex: 1, minWidth: '300px' }}></img>
          </div>
        </div>
      </div>
    </main>
  )
}

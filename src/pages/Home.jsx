import './PageStyling.css' ;

export default function Home() {
  return (
    <main className='main'>
      <div className='pageContainer'>
          <div className='pageBox'>
          <div className="homeHeadingContainer">
            <h1 className='homeTitleText'>TennisToday</h1>
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

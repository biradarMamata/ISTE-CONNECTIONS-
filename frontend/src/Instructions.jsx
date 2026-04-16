import React from 'react'

function Instructions({ onStart }) {
  return (
    <main className="page-shell">
      <div className="backdrop backdrop-left" />
      <div className="backdrop backdrop-right" />

      <div className="page-brand page-brand--left">
        <img src="./assets/atria.png" alt="Atria Institute of Technology logo" />
      </div>

      <div className="page-brand page-brand--right">
        <img src="./assets/iste-logo.svg" alt="ISTE logo" />
      </div>

      <section className="poster">
        <header className="poster__header" />

        <div className="poster__hero">
          <h1>Connections Game Instructions</h1>
        </div>

        <div className="instructions-content">
          <p>Participants will be presented with a total of 20 Connection Questions, each containing a set of words that share a common link.</p>
          <p>The objective is to identify the correct connection or relationship between the given words.</p>
          <p>Each question will have a specific time limit based on its difficulty level.</p>
          <p>A timer will be displayed for every question, and answers must be submitted before the time runs out.</p>
          <p>The connections may include categories, word patterns, double meanings, abbreviations, or popular culture references.</p>
          <p>Participants are not allowed to use any external help during the game.</p>
          <p>Correct answers will earn points.</p>
          <p>No points will be awarded for incorrect or unanswered questions.</p>
          <p>Participants are encouraged to think creatively and consider multiple interpretations before answering.</p>
          <p>Some questions may include tricky or misleading words, so careful analysis is important.</p>
          <p>The final score will be displayed after all 20 questions are completed.</p>
          <p>If a leaderboard is included, participants will be ranked based on their total score.</p>
        </div>

        <button className="submit-button" onClick={onStart}>
          <span>Start Game</span>
          <span aria-hidden="true" className="submit-button__bolt">
            ⚡
          </span>
        </button>
      </section>
    </main>
  )
}

export default Instructions
const audio = document.getElementById('beep')

class App extends React.Component {
    constructor() {
        super()
        this.loop
    }

    state = {
        breakCount: 5,
        sessionCount: 25,
        currentTimer: 'Session',
        currentTimerCount: 25 * 60,
        isPlaying: false
    }

    componentWillUnmount() {
        clearInterval(this.loop)
    }

    timeDisplay(count) {
        let minutes = Math.floor(count / 60)
        let seconds = count % 60

        minutes = minutes <= 9 ? ('0' + minutes) : minutes
        seconds = seconds <= 9 ? ('0' + seconds) : seconds

        return `${minutes}:${seconds}`
    }

    action = (timer, count, number) => {
        let newCount = this.state[count] + number;

        if (newCount > 0 && newCount < 61 && !this.state.isPlaying) {
            this.setState({ [count]: newCount})
            if(this.state.currentTimer == timer) {
                this.setState({currentTimerCount: newCount * 60})
            }
        }
    }

    playPause = () => {
        if (this.state.isPlaying) {
            clearInterval(this.loop)
            this.setState({ isPlaying: false })
        } else {
            this.loop = setInterval(() => {
                if (this.state.currentTimerCount === 0) {
                    audio.play()
                    this.setState({currentTimerCount: (this.state.currentTimer == 'Session') ? (this.state.breakCount * 60) : (this.state.sessionCount * 60)})
                    this.setState({currentTimer: (this.state.currentTimer == 'Session') ? 'Break' : 'Session'})
                } else {
                    this.setState({ currentTimerCount: this.state.currentTimerCount - 1 })
                }
            }, 1000)
            this.setState({ isPlaying: true })
        }
    }
    
    reset = () => {
        audio.pause()
        audio.currentTime = 0
        clearInterval(this.loop)
        this.setState(
            {
                breakCount: 5,
                sessionCount: 25,
                currentTimer: 'Session',
                currentTimerCount: 25 * 60,
                isPlaying: false
            }
        )
    }

    render() {
        const {
            breakCount,
            sessionCount,
            currentTimer,
            currentTimerCount,
            isPlaying,
        } = this.state

        return (
            <div className="pomodoro-clock">
                <h1>Pomodoro Timer</h1>
                <div className="flex">
                    <SetTimer label="Break" count={breakCount} action={this.action} />
                    <SetTimer label="Session" count={sessionCount} action={this.action} />
                </div>
                <div className="timerWrapper">
                    <h2 id="timer-label">{currentTimer}</h2>
                    <div id="time-left">{this.timeDisplay(currentTimerCount)}</div>
                    <button id='start_stop' className={`fas fa-${isPlaying ? 'pause' : 'play'}`} onClick={this.playPause}></button>
                    <button id='reset' className="fas fa-sync" onClick={this.reset}></button>
                </div>
            </div>
        )
    }
}

function SetTimer({ label, count, action }) {

    return (
        <div className="setTimerWrapper">
            <h2 id={`${label.toLowerCase()}-label`}>{`${label} Length`}</h2>
            <div className="actionsWrapper flex">
                <button id={`${label.toLowerCase()}-decrement`} className="fas fa-minus" onClick={() => action(label, `${label.toLowerCase()}Count`, -1)}></button>
                <span id={`${label.toLowerCase()}-length`}>{count}</span>
                <button id={`${label.toLowerCase()}-increment`} className="fas fa-plus" onClick={() => action(label, `${label.toLowerCase()}Count`, 1)}></button>
            </div>
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('root'))

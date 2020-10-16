class TiltEngine {
  constructor(currentHighscore) {
    this.sequence = [];
    this.currentAttemptIndex = 0;
    this.latestHighscore = currentHighscore;
    this.moveData = {
      xSpeeds: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ySpeeds: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      counted: false
    };
  }

  onAnimationNeeded(handler) {
    this.animationHandler = handler;
  }

  onMoveMade(handler) {
    this.moveMadeHandler = handler;
  }

  onLevelBeat(handler) {
    this.levelBeatHandler = handler;
  }

  onNewLevelStart(handler) {
    this.newLevelStartHandler = handler;
  }

  onGameOver(handler) {
    this.gameOverHandler = handler;
  }

  onNewHighScoreAchieved(handler) {
    this.newHighScoreHandler = handler;
  }

  startNewGame() {
    this.startNewLevel(1);
  }

  startNewLevel(level) {
    this.sequence = [];
    this.currentAttemptIndex = 0;
    for (let i = 0; i < level; i++) {
      let index = Math.floor(Math.random() * 4);
      this.sequence.push(index);
    }

    this.newLevelStartHandler(this.sequence.length, this.sequence);
  }

  processMotion(xSpeed, ySpeed) {
    if (!this.moveData.counted) {
      this.moveData.xSpeeds.shift();
      this.moveData.xSpeeds.push(xSpeed);
      this.moveData.ySpeeds.shift();
      this.moveData.ySpeeds.push(ySpeed);

      this.performAnimation();
    }
  }

  performAnimation() {
    const moveIdx = this.determineMove();

    if (moveIdx !== null) {
      this.animationHandler(moveIdx);

      if (this.sequence[this.currentAttemptIndex] !== moveIdx) {
        if (this.sequence.length - 1 > this.latestHighscore) {
          this.latestHighscore = this.sequence.length - 1;
          this.newHighScoreHandler(this.sequence.length - 1);
        } else {
          this.gameOverHandler();
        }
      } else if (this.currentAttemptIndex + 1 === this.sequence.length) {
        this.levelBeatHandler();
        setTimeout(() => this.startNewLevel(this.sequence.length + 1), 1000);
      } else {
        this.currentAttemptIndex++;
        this.moveMadeHandler(this.currentAttemptIndex);
      }
    }
  }

  /*
    Procedure for determining move with gyroscope:
      - maintain arrays containing the last 10 samples of gyroscope x and y speed readings
      - every time the gyroscope provides data, check if we need to trigger a move
      - to determine if the gyroscope data indicates a move:
        - consider each speed array in two halves (start and end half.)
        - if the first half of the speed array contains a certain threshold of positive speeds over another threshold, 
          and the second half contains a certain threshold of negative speeds over a certain threshold, then that would
          indicate a quick tilt back and forth, which should trigger a move
  */
  determineMove() {
    const threshold = 2;
    const startCounter = { right: 0, left: 0, top: 0, bottom: 0 };
    const endCounter = { right: 0, left: 0, top: 0, bottom: 0 };
    this.moveData.xSpeeds.forEach((s, idx) => {
      if (idx < this.moveData.xSpeeds.length / 2) {
        if (s > threshold) {
          startCounter.right++;
        } else if (s < -threshold) {
          startCounter.left++;
        }
      } else {
        if (s > threshold) {
          endCounter.right++;
        } else if (s < -threshold) {
          endCounter.left++;
        }
      }
    });
    this.moveData.ySpeeds.forEach((s, idx) => {
      if (idx < this.moveData.ySpeeds.length / 2) {
        if (s > threshold) {
          startCounter.top++;
        } else if (s < -threshold) {
          startCounter.bottom++;
        }
      } else {
        if (s > threshold) {
          endCounter.top++;
        } else if (s < -threshold) {
          endCounter.bottom++;
        }
      }
    });

    const countThreshold = 3;
    // object just to clarify return values with names
    const locationIndexMap = {
      left: 0,
      right: 2,
      top: 1,
      bottom: 3
    };
    if (
      startCounter.right >= countThreshold &&
      endCounter.left >= countThreshold
    ) {
      this.moveData.counted = true;
      return locationIndexMap.right;
    } else if (
      startCounter.left >= countThreshold &&
      endCounter.right >= countThreshold
    ) {
      this.moveData.counted = true;
      return locationIndexMap.left;
    } else if (
      startCounter.top >= countThreshold &&
      endCounter.bottom >= countThreshold
    ) {
      this.moveData.counted = true;
      return locationIndexMap.top;
    } else if (
      startCounter.bottom >= countThreshold &&
      endCounter.top >= countThreshold
    ) {
      this.moveData.counted = true;
      return locationIndexMap.bottom;
    } else {
      return null;
    }
  }

  resetMoveData() {
    this.moveData.xSpeeds = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.moveData.ySpeeds = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.moveData.counted = false;
  }
}

export default TiltEngine;

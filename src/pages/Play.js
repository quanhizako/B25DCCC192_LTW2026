import React, { useState, useEffect, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import MoneyLadder from '../components/MoneyLadder';
import Lifelines from '../components/Lifelines';
import AudienceChart from '../components/AudienceChart';
import { TIME_PER_QUESTION } from '../data';
import { calcPrize, generateAudienceVotes } from '../utils';

const Play = ({ questions = [], playerName, onGameOver }) => {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState('answering');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);

  const [lifelinesUsed, setLifelinesUsed] = useState({
    half: false,
    audience: false,
    stop: false,
  });
  const [hiddenOptions, setHiddenOptions] = useState([]);
  const [audienceVotes, setAudienceVotes] = useState(null);

  useEffect(() => {
    if (playerName && playerName.trim()) {
      document.title = `Câu ${currentIndex + 1}/15 – ${playerName}`;
    }
    return () => {
      document.title = 'Ai là triệu phú';
    };
  }, [currentIndex, playerName]);

  const finishGame = useCallback(
    (correctCount, reason) => {
      const prize = calcPrize(correctCount, reason);
      if (onGameOver) {
        onGameOver({
          name: playerName,
          prize,
          correctCount,
          reason,
        });
      }
      navigate('/result', {
        replace: true,
        state: {
          name: playerName,
          prize,
          correctCount,
          reason,
        },
      });
    },
    [playerName, onGameOver, navigate]
  );

  const currentQuestion = questions[currentIndex];

  const handleSelectAnswer = useCallback(
    (index) => {
      if (status !== 'answering' || hiddenOptions.includes(index)) {
        return;
      }
      setSelectedAnswer(index);
      setStatus('locked');
    },
    [status, hiddenOptions]
  );

  useEffect(() => {
    let timeoutId;
    if (status === 'locked') {
      timeoutId = setTimeout(() => {
        setStatus('revealed');
      }, 1000);
    } else if (status === 'revealed') {
      timeoutId = setTimeout(() => {
        if (!currentQuestion) return;
        const isCorrect = selectedAnswer === currentQuestion.answer;
        if (isCorrect) {
          if (currentIndex < 14) {
            setCurrentIndex((prev) => prev + 1);
            setStatus('answering');
            setSelectedAnswer(null);
            setTimeLeft(TIME_PER_QUESTION);
            setHiddenOptions([]);
            setAudienceVotes(null);
          } else {
            finishGame(15, 'win');
          }
        } else {
          finishGame(currentIndex, 'wrong');
        }
      }, 2000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [status, selectedAnswer, currentIndex, currentQuestion, finishGame]);

  useEffect(() => {
    if (status !== 'answering') {
      return;
    }

    if (timeLeft === 0) {
      finishGame(currentIndex, 'timeout');
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [status, timeLeft, currentIndex, finishGame]);

  useEffect(() => {
    const handleKey = (e) => {
      if (status !== 'answering') return;
      const key = e.key.toUpperCase();
      const keyMap = { A: 0, B: 1, C: 2, D: 3 };
      if (keyMap.hasOwnProperty(key)) {
        const optionIndex = keyMap[key];
        if (!hiddenOptions.includes(optionIndex)) {
          handleSelectAnswer(optionIndex);
        }
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
    };
  }, [status, hiddenOptions, handleSelectAnswer]);

  const handleUse5050 = () => {
    if (status !== 'answering' || lifelinesUsed.half || !currentQuestion) return;
    const wrongIndices = [0, 1, 2, 3].filter(
      (idx) => idx !== currentQuestion.answer
    );
    const shuffled = [...wrongIndices].sort(() => 0.5 - Math.random());
    const toHide = shuffled.slice(0, 2);

    setHiddenOptions(toHide);
    setLifelinesUsed((prev) => ({ ...prev, half: true }));
  };

  const handleUseAudience = () => {
    if (
      status !== 'answering' ||
      lifelinesUsed.audience ||
      !currentQuestion
    ) {
      return;
    }
    const votes = generateAudienceVotes(currentQuestion.answer, hiddenOptions);
    setAudienceVotes(votes);
    setLifelinesUsed((prev) => ({ ...prev, audience: true }));
  };

  const handleStopGame = () => {
    if (status !== 'answering' || lifelinesUsed.stop) return;
    setLifelinesUsed((prev) => ({ ...prev, stop: true }));
    finishGame(currentIndex, 'stop');
  };

  if (!playerName || !playerName.trim()) {
    return <Navigate to="/" replace />;
  }

  if (!currentQuestion) {
    return (
      <div className="status-container">
        <p className="status-message">Đang chuẩn bị câu hỏi...</p>
      </div>
    );
  }

  return (
    <div className="play-layout">
      <div className="play-main-area">
        <div className="play-top-bar">
          <Timer timeLeft={timeLeft} />
          <Lifelines
            lifelinesUsed={lifelinesUsed}
            status={status}
            onUse5050={handleUse5050}
            onUseAudience={handleUseAudience}
            onStopGame={handleStopGame}
          />
        </div>

        {audienceVotes && <AudienceChart votes={audienceVotes} />}

        <QuestionCard
          key={currentIndex}
          questionNumber={currentIndex + 1}
          question={currentQuestion}
          status={status}
          selectedAnswer={selectedAnswer}
          hiddenOptions={hiddenOptions}
          onSelectAnswer={handleSelectAnswer}
        />
      </div>

      <div className="play-sidebar">
        <MoneyLadder currentQuestionIndex={currentIndex} />
      </div>
    </div>
  );
};

export default Play;

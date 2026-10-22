import React, { useState, useEffect, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import MoneyLadder from '../components/MoneyLadder';
import { TIME_PER_QUESTION } from '../data';
import { calcPrize } from '../utils';

const Play = ({ questions = [], playerName }) => {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState('answering');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);

  const finishGame = useCallback(
    (correctCount, reason) => {
      const prize = calcPrize(correctCount, reason);
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
    [playerName, navigate]
  );

  const currentQuestion = questions[currentIndex];

  const handleSelectAnswer = useCallback(
    (index) => {
      if (status !== 'answering') {
        return;
      }
      setSelectedAnswer(index);
      setStatus('locked');
    },
    [status]
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
        </div>

        <QuestionCard
          questionNumber={currentIndex + 1}
          question={currentQuestion}
          status={status}
          selectedAnswer={selectedAnswer}
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

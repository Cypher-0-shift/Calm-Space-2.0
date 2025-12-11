import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';
import { GamepadIcon, BrainIcon, ZapIcon, TargetIcon, PuzzleIcon } from 'lucide-react';

type GameType = 'memory' | 'tictactoe' | 'bubble' | 'reaction' | 'puzzle';

interface GameCard {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface GameStats {
  moves: number;
  matches: number;
  timeElapsed: number;
  score: number;
}

interface HighScore {
  game: string;
  score: number;
  moves?: number;
  time: number;
  date: string;
}

const Games = () => {
  const [currentGame, setCurrentGame] = useState<GameType | null>(null);
  const [gameData, setGameData] = useState<any>({});
  const [highScores, setHighScores] = useLocalStorage<HighScore[]>('gameHighScores', []);
  const { toast } = useToast();

  const gamesList = [
    {
      type: 'memory' as GameType,
      title: 'Memory Match',
      icon: <BrainIcon className="w-8 h-8" />,
      description: 'Flip and match the cards',
      color: 'from-purple-400 to-purple-600',
      emoji: '🧠'
    },
    {
      type: 'tictactoe' as GameType,
      title: 'Tic Tac Toe',
      icon: <TargetIcon className="w-8 h-8" />,
      description: 'Classic X vs O game',
      color: 'from-red-400 to-red-600',
      emoji: '❌'
    },
    {
      type: 'bubble' as GameType,
      title: 'Bubble Pop',
      icon: <ZapIcon className="w-8 h-8" />,
      description: 'Tap to pop bubbles',
      color: 'from-pink-400 to-purple-500',
      emoji: '💫'
    },
    {
      type: 'reaction' as GameType,
      title: 'Reaction Test',
      icon: <ZapIcon className="w-8 h-8" />,
      description: 'Test your reaction speed',
      color: 'from-orange-400 to-yellow-500',
      emoji: '⚡'
    },
    {
      type: 'puzzle' as GameType,
      title: 'Number Puzzle',
      icon: <PuzzleIcon className="w-8 h-8" />,
      description: 'Slide tiles to arrange numbers',
      color: 'from-blue-400 to-cyan-500',
      emoji: '🔢'
    }
  ];

  // Memory Game Component
  const MemoryGame = () => {
    const [cards, setCards] = useState<GameCard[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [gameStats, setGameStats] = useState<GameStats>({ moves: 0, matches: 0, timeElapsed: 0, score: 0 });
    const [isGameActive, setIsGameActive] = useState(false);
    const [gameCompleted, setGameCompleted] = useState(false);

    const gameIcons = ['🌟', '🎵', '🌈', '🦋', '🌸', '🎨', '🌙', '⭐'];

    useEffect(() => {
      let timer: NodeJS.Timeout;
      if (isGameActive && !gameCompleted) {
        timer = setInterval(() => {
          setGameStats(prev => ({ ...prev, timeElapsed: prev.timeElapsed + 1 }));
        }, 1000);
      }
      return () => clearInterval(timer);
    }, [isGameActive, gameCompleted]);

    const initializeGame = () => {
      const pairedIcons = [...gameIcons, ...gameIcons];
      const shuffledCards = pairedIcons
        .map((icon, index) => ({ id: index, icon, isFlipped: false, isMatched: false }))
        .sort(() => Math.random() - 0.5);

      setCards(shuffledCards);
      setFlippedCards([]);
      setGameStats({ moves: 0, matches: 0, timeElapsed: 0, score: 0 });
      setIsGameActive(true);
      setGameCompleted(false);
    };

    const handleCardClick = (cardId: number) => {
      if (!isGameActive || flippedCards.length >= 2 || gameCompleted) return;
      
      const card = cards.find(c => c.id === cardId);
      if (!card || card.isFlipped || card.isMatched) return;

      const newFlippedCards = [...flippedCards, cardId];
      setCards(prev => prev.map(card => 
        card.id === cardId ? { ...card, isFlipped: true } : card
      ));
      setFlippedCards(newFlippedCards);

      if (newFlippedCards.length === 2) {
        const [first, second] = newFlippedCards;
        const firstCard = cards.find(card => card.id === first);
        const secondCard = cards.find(card => card.id === second);

        if (firstCard && secondCard && firstCard.icon === secondCard.icon) {
          setTimeout(() => {
            setCards(prev => prev.map(card => 
              card.id === first || card.id === second 
                ? { ...card, isMatched: true }
                : card
            ));
            setGameStats(prev => ({ 
              ...prev, 
              matches: prev.matches + 1,
              score: prev.score + Math.max(100 - prev.moves, 10)
            }));
            setFlippedCards([]);

            if (gameStats.matches + 1 === 8) {
              setGameCompleted(true);
              setIsGameActive(false);
              const finalScore = gameStats.score + Math.max(300 - gameStats.timeElapsed, 0);
              saveHighScore('Memory Match', finalScore, gameStats.timeElapsed, gameStats.moves);
              toast({ title: "Congratulations! Game completed!" });
            }
          }, 500);
        } else {
          setTimeout(() => {
            setCards(prev => prev.map(card => 
              card.id === first || card.id === second 
                ? { ...card, isFlipped: false }
                : card
            ));
            setFlippedCards([]);
          }, 1000);
        }

        setGameStats(prev => ({ ...prev, moves: prev.moves + 1 }));
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-4 text-sm">
            <span>Time: {Math.floor(gameStats.timeElapsed / 60)}:{(gameStats.timeElapsed % 60).toString().padStart(2, '0')}</span>
            <span>Moves: {gameStats.moves}</span>
            <span>Score: {gameStats.score}</span>
          </div>
          <Button onClick={initializeGame} size="sm">
            {cards.length === 0 ? 'Start Game' : 'New Game'}
          </Button>
        </div>

        {cards.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🧠</div>
            <h3 className="text-xl font-semibold mb-2">Memory Match</h3>
            <p className="text-gray-600 mb-6">Flip cards to find matching pairs!</p>
            <Button onClick={initializeGame} size="lg">Start Game</Button>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
            {cards.map((card) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`aspect-square rounded-xl flex items-center justify-center text-2xl cursor-pointer transition-all duration-300 ${
                  card.isFlipped || card.isMatched
                    ? 'bg-white shadow-lg transform scale-105'
                    : 'bg-gradient-to-br from-purple-200 to-pink-200 hover:scale-105'
                } ${card.isMatched ? 'ring-4 ring-green-300' : ''}`}
              >
                {card.isFlipped || card.isMatched ? card.icon : '?'}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Tic Tac Toe Game Component
  const TicTacToeGame = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [winner, setWinner] = useState<string | null>(null);
    const [gameCount, setGameCount] = useState(0);

    const checkWinner = (squares: string[]) => {
      const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
      ];

      for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
          return squares[a];
        }
      }
      return null;
    };

    const handleClick = (index: number) => {
      if (board[index] || winner) return;

      const newBoard = [...board];
      newBoard[index] = isXNext ? 'X' : 'O';
      setBoard(newBoard);
      setIsXNext(!isXNext);

      const gameWinner = checkWinner(newBoard);
      if (gameWinner) {
        setWinner(gameWinner);
        if (gameWinner === 'X') {
          saveHighScore('Tic Tac Toe', 100, Date.now());
          toast({ title: "You won!" });
        }
      } else if (newBoard.every(square => square)) {
        setWinner('Draw');
        toast({ title: "It's a draw!" });
      }
    };

    const resetGame = () => {
      setBoard(Array(9).fill(null));
      setIsXNext(true);
      setWinner(null);
      setGameCount(gameCount + 1);
    };

    return (
      <div className="space-y-4 text-center">
        <div className="text-lg font-semibold">
          {winner ? (
            winner === 'Draw' ? "It's a draw!" : `Winner: ${winner}`
          ) : (
            `Next player: ${isXNext ? 'X' : 'O'}`
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
          {board.map((square, index) => (
            <button
              key={index}
              className="w-20 h-20 bg-white border-2 border-gray-300 rounded-lg text-2xl font-bold hover:bg-gray-50 transition-colors"
              onClick={() => handleClick(index)}
            >
              {square}
            </button>
          ))}
        </div>

        <Button onClick={resetGame}>New Game</Button>
      </div>
    );
  };

  // Bubble Pop Game Component
  const BubblePopGame = () => {
    const [bubbles, setBubbles] = useState<Array<{id: number, x: number, y: number, size: number, color: string}>>([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
      let timer: NodeJS.Timeout;
      if (isPlaying && timeLeft > 0) {
        timer = setInterval(() => {
          setTimeLeft(prev => prev - 1);
        }, 1000);
      } else if (timeLeft === 0) {
        setIsPlaying(false);
        saveHighScore('Bubble Pop', score, 30);
        toast({ title: `Game Over! Score: ${score}` });
      }
      return () => clearInterval(timer);
    }, [isPlaying, timeLeft, score]);

    useEffect(() => {
      let bubbleTimer: NodeJS.Timeout;
      if (isPlaying) {
        bubbleTimer = setInterval(() => {
          const newBubble = {
            id: Date.now(),
            x: Math.random() * 300,
            y: Math.random() * 400,
            size: Math.random() * 30 + 20,
            color: ['bg-pink-400', 'bg-purple-400', 'bg-blue-400', 'bg-green-400'][Math.floor(Math.random() * 4)]
          };
          setBubbles(prev => [...prev, newBubble]);
        }, 800);
      }
      return () => clearInterval(bubbleTimer);
    }, [isPlaying]);

    const popBubble = (id: number) => {
      setBubbles(prev => prev.filter(bubble => bubble.id !== id));
      setScore(prev => prev + 10);
    };

    const startGame = () => {
      setBubbles([]);
      setScore(0);
      setTimeLeft(30);
      setIsPlaying(true);
    };

    return (
      <div className="space-y-4 text-center">
        <div className="flex justify-center gap-6">
          <span>Score: {score}</span>
          <span>Time: {timeLeft}s</span>
        </div>

        {!isPlaying && timeLeft === 30 ? (
          <div className="py-16">
            <div className="text-6xl mb-4">💫</div>
            <h3 className="text-xl font-semibold mb-2">Bubble Pop</h3>
            <p className="text-gray-600 mb-6">Pop as many bubbles as you can in 30 seconds!</p>
            <Button onClick={startGame} size="lg">Start Game</Button>
          </div>
        ) : (
          <div className="relative bg-gradient-to-b from-blue-100 to-blue-200 rounded-xl h-96 overflow-hidden">
            {bubbles.map(bubble => (
              <div
                key={bubble.id}
                className={`absolute rounded-full ${bubble.color} cursor-pointer hover:scale-110 transition-transform animate-bounce`}
                style={{
                  left: bubble.x,
                  top: bubble.y,
                  width: bubble.size,
                  height: bubble.size
                }}
                onClick={() => popBubble(bubble.id)}
              />
            ))}
            {!isPlaying && timeLeft === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-white text-center">
                  <h3 className="text-2xl font-bold">Game Over!</h3>
                  <p className="text-lg">Final Score: {score}</p>
                  <Button onClick={startGame} className="mt-4">Play Again</Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Reaction Test Game Component
  const ReactionTestGame = () => {
    const [stage, setStage] = useState<'waiting' | 'ready' | 'go' | 'result'>('waiting');
    const [startTime, setStartTime] = useState(0);
    const [reactionTime, setReactionTime] = useState(0);
    const [bestTime, setBestTime] = useLocalStorage('bestReactionTime', 0);

    const startTest = () => {
      setStage('ready');
      const delay = Math.random() * 3000 + 2000; // 2-5 seconds
      setTimeout(() => {
        setStage('go');
        setStartTime(Date.now());
      }, delay);
    };

    const handleClick = () => {
      if (stage === 'go') {
        const endTime = Date.now();
        const reaction = endTime - startTime;
        setReactionTime(reaction);
        setStage('result');
        
        if (!bestTime || reaction < bestTime) {
          setBestTime(reaction);
          saveHighScore('Reaction Test', Math.round(1000 / reaction), reaction);
          toast({ title: "New best time!" });
        }
      } else if (stage === 'ready') {
        setStage('waiting');
        toast({ title: "Too early! Wait for green." });
      }
    };

    const resetTest = () => {
      setStage('waiting');
      setReactionTime(0);
    };

    return (
      <div className="space-y-4 text-center">
        <div className="text-lg">
          {bestTime > 0 && <span>Best: {bestTime}ms</span>}
        </div>

        <div
          className={`h-64 rounded-xl flex items-center justify-center cursor-pointer transition-colors ${
            stage === 'waiting' ? 'bg-gray-200 hover:bg-gray-300' :
            stage === 'ready' ? 'bg-red-400' :
            stage === 'go' ? 'bg-green-400' :
            'bg-blue-200'
          }`}
          onClick={handleClick}
        >
          <div className="text-center">
            {stage === 'waiting' && (
              <>
                <div className="text-6xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold mb-2">Reaction Test</h3>
                <p className="text-gray-600">Click to start</p>
              </>
            )}
            {stage === 'ready' && (
              <>
                <div className="text-4xl mb-2">🔴</div>
                <p className="text-white font-semibold">Wait for green...</p>
              </>
            )}
            {stage === 'go' && (
              <>
                <div className="text-4xl mb-2">🟢</div>
                <p className="text-white font-semibold">CLICK NOW!</p>
              </>
            )}
            {stage === 'result' && (
              <>
                <div className="text-4xl mb-2">🎯</div>
                <p className="text-2xl font-bold">{reactionTime}ms</p>
                <p className="text-gray-600">
                  {reactionTime < 200 ? 'Excellent!' :
                   reactionTime < 300 ? 'Good!' :
                   reactionTime < 400 ? 'Average' : 'Try again!'}
                </p>
              </>
            )}
          </div>
        </div>

        {stage === 'result' && (
          <Button onClick={resetTest}>Try Again</Button>
        )}
      </div>
    );
  };

  // Number Puzzle Game Component
  const NumberPuzzleGame = () => {
    const [tiles, setTiles] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [isWon, setIsWon] = useState(false);

    const initializePuzzle = () => {
      let numbers = Array.from({length: 15}, (_, i) => i + 1);
      numbers.push(0); // Empty space
      
      // Shuffle
      for (let i = 0; i < 1000; i++) {
        const emptyIndex = numbers.indexOf(0);
        const neighbors = [];
        if (emptyIndex % 4 !== 0) neighbors.push(emptyIndex - 1);
        if (emptyIndex % 4 !== 3) neighbors.push(emptyIndex + 1);
        if (emptyIndex >= 4) neighbors.push(emptyIndex - 4);
        if (emptyIndex < 12) neighbors.push(emptyIndex + 4);
        
        const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
        [numbers[emptyIndex], numbers[randomNeighbor]] = [numbers[randomNeighbor], numbers[emptyIndex]];
      }
      
      setTiles(numbers);
      setMoves(0);
      setIsWon(false);
    };

    const moveTile = (index: number) => {
      if (isWon) return;
      
      const emptyIndex = tiles.indexOf(0);
      const isAdjacent = 
        (Math.abs(index - emptyIndex) === 1 && Math.floor(index / 4) === Math.floor(emptyIndex / 4)) ||
        Math.abs(index - emptyIndex) === 4;
      
      if (isAdjacent) {
        const newTiles = [...tiles];
        [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
        setTiles(newTiles);
        setMoves(moves + 1);
        
        // Check if won
        const solved = newTiles.every((tile, idx) => 
          idx === 15 ? tile === 0 : tile === idx + 1
        );
        
        if (solved) {
          setIsWon(true);
          saveHighScore('Number Puzzle', Math.max(1000 - moves, 100), Date.now(), moves);
          toast({ title: `Puzzle solved in ${moves + 1} moves!` });
        }
      }
    };

    return (
      <div className="space-y-4 text-center">
        <div className="flex justify-center gap-6">
          <span>Moves: {moves}</span>
          <Button onClick={initializePuzzle} size="sm">
            {tiles.length === 0 ? 'Start Game' : 'New Game'}
          </Button>
        </div>

        {tiles.length === 0 ? (
          <div className="py-16">
            <div className="text-6xl mb-4">🔢</div>
            <h3 className="text-xl font-semibold mb-2">Number Puzzle</h3>
            <p className="text-gray-600 mb-6">Arrange numbers 1-15 in order!</p>
            <Button onClick={initializePuzzle} size="lg">Start Game</Button>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
            {tiles.map((tile, index) => (
              <div
                key={index}
                onClick={() => moveTile(index)}
                className={`aspect-square flex items-center justify-center text-xl font-bold rounded-lg cursor-pointer transition-colors ${
                  tile === 0
                    ? 'bg-gray-100'
                    : 'bg-white border-2 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {tile === 0 ? '' : tile}
              </div>
            ))}
          </div>
        )}

        {isWon && (
          <div className="bg-green-100 p-4 rounded-xl">
            <h3 className="text-xl font-bold text-green-800">Congratulations!</h3>
            <p className="text-green-700">Puzzle solved in {moves} moves!</p>
          </div>
        )}
      </div>
    );
  };

  const saveHighScore = (game: string, score: number, time: number, moves?: number) => {
    const newScore: HighScore = {
      game,
      score,
      time,
      moves,
      date: new Date().toISOString()
    };

    const updatedScores = [...highScores, newScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, 50);
    
    setHighScores(updatedScores);
  };

  const renderCurrentGame = () => {
    switch (currentGame) {
      case 'memory': return <MemoryGame />;
      case 'tictactoe': return <TicTacToeGame />;
      case 'bubble': return <BubblePopGame />;
      case 'reaction': return <ReactionTestGame />;
      case 'puzzle': return <NumberPuzzleGame />;
      default: return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-slide-up">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🎮 Calm Space Games
        </h1>
        <p className="text-lg text-gray-600">
          Exercise your mind with these calming and therapeutic games
        </p>
      </div>

      {!currentGame ? (
        <>
          {/* Games Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gamesList.map((game) => (
              <Card key={game.type} className="glass hover:scale-105 transition-transform cursor-pointer">
                <CardContent 
                  className="p-6 text-center"
                  onClick={() => setCurrentGame(game.type)}
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${game.color} flex items-center justify-center text-white`}>
                    {game.icon}
                  </div>
                  <div className="text-4xl mb-2">{game.emoji}</div>
                  <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
                  <p className="text-gray-600 text-sm">{game.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* High Scores */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Recent High Scores</CardTitle>
            </CardHeader>
            <CardContent>
              {highScores.length === 0 ? (
                <p className="text-gray-600 text-center">No scores yet. Start playing to see your achievements!</p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {highScores.slice(0, 6).map((score, index) => (
                    <div key={index} className="bg-white/50 rounded-lg p-3">
                      <div className="font-semibold text-sm">{score.game}</div>
                      <div className="text-lg text-purple-600">{score.score} points</div>
                      <div className="text-xs text-gray-500">
                        {new Date(score.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Benefits of Mental Games</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl mb-2">🧠</div>
                  <h4 className="font-semibold mb-2">Cognitive Enhancement</h4>
                  <p className="text-sm text-gray-600">
                    Improves working memory, attention span, and cognitive flexibility
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🎯</div>
                  <h4 className="font-semibold mb-2">Focus Training</h4>
                  <p className="text-sm text-gray-600">
                    Develops concentration skills and mindful attention to the present moment
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">😌</div>
                  <h4 className="font-semibold mb-2">Stress Relief</h4>
                  <p className="text-sm text-gray-600">
                    Provides a calming, meditative activity that reduces anxiety and stress
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        /* Current Game View */
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => setCurrentGame(null)} 
              variant="outline"
            >
              ← Back to Games
            </Button>
            <h2 className="text-2xl font-bold">
              {gamesList.find(g => g.type === currentGame)?.title}
            </h2>
          </div>

          <Card className="glass">
            <CardContent className="p-6">
              {renderCurrentGame()}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Games;
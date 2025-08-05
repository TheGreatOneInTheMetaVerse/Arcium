"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RotateCcw, Trophy, Clock, Star } from "lucide-react"

const symbols = [
  "/images/puzzle1.jpg",
  "/images/puzzle2.jpg",
  "/images/puzzle3.jpg",
  "/images/puzzle4.jpg",
  "/images/puzzle5.jpg",
  "/images/puzzle6.jpg",
  "/images/puzzle7.jpg",
  "/images/puzzle8.jpg",
]
const gameSymbols = [...symbols, ...symbols]

interface GameCard {
  id: number
  symbol: string
  isFlipped: boolean
  isMatched: boolean
}

export default function MemoryGame() {
  const [cards, setCards] = useState<GameCard[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [moves, setMoves] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameWon, setGameWon] = useState(false)

  // Initialize game
  const initializeGame = () => {
    const shuffledSymbols = gameSymbols.sort(() => Math.random() - 0.5)
    const initialCards = shuffledSymbols.map((symbol, index) => ({
      id: index,
      symbol,
      isFlipped: false,
      isMatched: false,
    }))
    setCards(initialCards)
    setFlippedCards([])
    setMatchedPairs(0)
    setMoves(0)
    setTimeElapsed(0)
    setGameStarted(false)
    setGameWon(false)
  }

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameStarted && !gameWon) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameStarted, gameWon])

  // Initialize game on mount
  useEffect(() => {
    initializeGame()
  }, [])

  // Handle card click
  const handleCardClick = (cardId: number) => {
    if (!gameStarted) setGameStarted(true)

    const card = cards.find((c) => c.id === cardId)
    if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) {
      return
    }

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)

    // Update card state
    setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c)))

    // Check for match when 2 cards are flipped
    if (newFlippedCards.length === 2) {
      setMoves((prev) => prev + 1)

      const [firstId, secondId] = newFlippedCards
      const firstCard = cards.find((c) => c.id === firstId)
      const secondCard = cards.find((c) => c.id === secondId)

      if (firstCard?.symbol === secondCard?.symbol) {
        // Match found
        setTimeout(() => {
          setCards((prev) => prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c)))
          setMatchedPairs((prev) => prev + 1)
          setFlippedCards([])
        }, 500)
      } else {
        // No match - flip cards back
        setTimeout(() => {
          setCards((prev) => prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c)))
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  // Check for game win
  useEffect(() => {
    if (matchedPairs === symbols.length) {
      setGameWon(true)
      setGameStarted(false)
    }
  }, [matchedPairs])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <img src="/images/logo.jpg" alt="ARCI Logo" className="w-12 h-12 rounded-lg" />
            Encryptd Memory 
            <Star className="text-yellow-300" />
          </h1>
          <p className="text-purple-200">Match all the pairs to win!</p>
        </div>

        {/* Game Stats */}
        <div className="flex justify-center gap-6 mb-6">
          <Card className="bg-purple-800/50 border-purple-600 px-4 py-2">
            <div className="flex items-center gap-2 text-white">
              <Clock className="w-4 h-4 text-purple-300" />
              <span className="font-mono">{formatTime(timeElapsed)}</span>
            </div>
          </Card>
          <Card className="bg-purple-800/50 border-purple-600 px-4 py-2">
            <div className="flex items-center gap-2 text-white">
              <Trophy className="w-4 h-4 text-purple-300" />
              <span>Moves: {moves}</span>
            </div>
          </Card>
          <Card className="bg-purple-800/50 border-purple-600 px-4 py-2">
            <div className="flex items-center gap-2 text-white">
              <Star className="w-4 h-4 text-purple-300" />
              <span>
                Pairs: {matchedPairs}/{symbols.length}
              </span>
            </div>
          </Card>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-4 gap-4 max-w-md mx-auto mb-6">
          {cards.map((card) => (
            <Card
              key={card.id}
              className={`
                aspect-square cursor-pointer transition-all duration-300 transform hover:scale-105
                ${
                  card.isFlipped || card.isMatched
                    ? "bg-gradient-to-br from-purple-400 to-purple-600 border-purple-300"
                    : "bg-gradient-to-br from-purple-700 to-purple-900 border-purple-500 hover:from-purple-600 hover:to-purple-800"
                }
                ${card.isMatched ? "ring-2 ring-yellow-400 ring-opacity-75" : ""}
              `}
              onClick={() => handleCardClick(card.id)}
            >
              <div className="w-full h-full flex items-center justify-center">
                {card.isFlipped || card.isMatched ? (
                  <img
                    src={card.symbol || "/placeholder.svg"}
                    alt="Memory card"
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <div className="w-8 h-8 bg-purple-300 rounded-full opacity-30"></div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Win Message */}
        {gameWon && (
          <div className="text-center mb-6">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 max-w-md mx-auto">
              <Trophy className="w-12 h-12 text-yellow-300 mx-auto mb-2" />
              <h2 className="text-2xl font-bold text-white mb-2">🎉 Congratulations! 🎉</h2>
              <p className="text-purple-100">
                You won in {moves} moves and {formatTime(timeElapsed)}!
              </p>
            </div>
          </div>
        )}

        {/* Reset Button */}
        <div className="text-center">
          <Button
            onClick={initializeGame}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            New Game
          </Button>
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center">
          <Card className="bg-purple-800/30 border-purple-600 max-w-md mx-auto p-4">
            <h3 className="text-lg font-semibold text-white mb-2">How to Play</h3>
            <p className="text-purple-200 text-sm">
              Click on cards to flip them over. Find matching pairs of symbols. Match all pairs in the fewest moves and
              fastest time possible!
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}

/* eslint-disable @typescript-eslint/no-unused-vars */

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Brain, MessageSquare, Target, Trophy, Star, Zap, Heart } from "lucide-react"

export default function EnglishStudyApp() {
  const [currentStreak, setCurrentStreak] = useState(7)
  const [totalPoints, setTotalPoints] = useState(2450)

  const studyModes = [
    {
      id: "vocabulary",
      title: "Word Adventure! 🌟",
      description: "Discover amazing new words on your journey",
      icon: BookOpen,
      color: "bg-gradient-to-br from-green-400 to-green-500",
      progress: 75,
      lessons: 12,
      emoji: "📚",
    },
    {
      id: "grammar",
      title: "Grammar Quest 🎯",
      description: "Master the magic of English grammar",
      icon: Brain,
      color: "bg-gradient-to-br from-yellow-400 to-yellow-500",
      progress: 60,
      lessons: 8,
      emoji: "🧠",
    },
    {
      id: "conversation",
      title: "Chat Challenge 💬",
      description: "Practice speaking like a native!",
      icon: MessageSquare,
      color: "bg-gradient-to-br from-green-500 to-emerald-500",
      progress: 45,
      lessons: 15,
      emoji: "🗣️",
    },
    {
      id: "reading",
      title: "Story Time 📖",
      description: "Dive into exciting English stories",
      icon: Target,
      color: "bg-gradient-to-br from-yellow-500 to-amber-500",
      progress: 80,
      lessons: 6,
      emoji: "📚",
    },
  ]

  const achievements = [
    { name: "First Steps! 👶", description: "You started your journey!", earned: true },
    { name: "Word Wizard 🧙‍♂️", description: "Learned 100 amazing words", earned: true },
    { name: "Grammar Guru 🎓", description: "Grammar master in training", earned: false },
    { name: "Streak Star ⭐", description: "7 days of awesome learning!", earned: true },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Playful Header */}
        <div className="text-center space-y-4 py-8">
          <div className="relative">
            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-yellow-500 transform -rotate-1">
              HEY ENGLISH! 👋
            </h1>
            <div className="absolute -top-2 -right-2 animate-bounce">
              <div className="bg-yellow-400 text-green-800 px-3 py-1 rounded-full text-sm font-bold transform rotate-12">
                Let&apos;s Go! 🚀
              </div>
            </div>
          </div>
          <p className="text-green-700 text-xl font-medium">Your super fun English adventure starts NOW! 🎉</p>
        </div>

        {/* Fun Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-green-400 to-green-500 text-white border-0 shadow-xl transform hover:scale-105 transition-all duration-300 rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-black">{totalPoints}</p>
                  <p className="text-green-100 font-medium">Super Points! ⭐</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-white border-0 shadow-xl transform hover:scale-105 transition-all duration-300 rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-black">{currentStreak}</p>
                  <p className="text-yellow-100 font-medium">Day Streak! 🔥</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0 shadow-xl transform hover:scale-105 transition-all duration-300 rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-black">B2</p>
                  <p className="text-green-100 font-medium">Level Up! 🎯</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Playful Study Modes */}
        <div className="space-y-6">
          <h2 className="text-3xl font-black text-green-800 text-center">Pick Your Adventure! 🎮</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {studyModes.map((mode, index) => {
              const IconComponent = mode.icon
              return (
                <Card
                  key={mode.id}
                  className="bg-white border-4 border-green-200 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group hover:-translate-y-2 rounded-3xl overflow-hidden"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-4 ${mode.color} rounded-2xl shadow-lg transform group-hover:rotate-12 transition-transform duration-300`}
                        >
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-black text-green-800">{mode.title}</CardTitle>
                          <CardDescription className="text-green-600 font-medium">{mode.description}</CardDescription>
                        </div>
                      </div>
                      <div className="text-4xl animate-pulse">{mode.emoji}</div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-green-700">Your Progress 📈</span>
                        <span className="text-green-800">{mode.progress}%</span>
                      </div>
                      <div className="relative">
                        <Progress value={mode.progress} className="h-4 bg-green-100" />
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-green-400 to-yellow-400 rounded-full"
                          style={{ width: `${mode.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <Badge className="bg-yellow-400 text-green-800 font-bold text-sm px-3 py-1 rounded-full">
                          {mode.lessons} fun lessons! 🎉
                        </Badge>
                        <Button className="bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-white font-bold rounded-full px-6 py-2 shadow-lg transform hover:scale-105 transition-all">
                          Let&apos;s Go! 🚀
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Fun Achievements */}
        <Card className="bg-white border-4 border-yellow-300 shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-yellow-400 to-green-400 text-white">
            <CardTitle className="text-2xl font-black">Your Amazing Achievements! 🏆</CardTitle>
            <CardDescription className="text-yellow-100 font-medium">Look how awesome you are!</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-4 p-4 rounded-2xl border-2 transition-all duration-300 ${
                    achievement.earned
                      ? "bg-gradient-to-r from-green-100 to-yellow-100 border-green-300 shadow-lg"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div
                    className={`p-3 rounded-full ${achievement.earned ? "bg-gradient-to-r from-green-400 to-yellow-400" : "bg-gray-300"}`}
                  >
                    <Trophy className={`h-6 w-6 ${achievement.earned ? "text-white" : "text-gray-500"}`} />
                  </div>
                  <div>
                    <p className={`font-bold ${achievement.earned ? "text-green-800" : "text-gray-600"}`}>
                      {achievement.name}
                    </p>
                    <p className={`text-sm ${achievement.earned ? "text-green-600" : "text-gray-500"}`}>
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.earned && (
                    <div className="ml-auto">
                      <Heart className="h-6 w-6 text-red-500 animate-pulse" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Super Fun Daily Challenge */}
        <Card className="bg-gradient-to-r from-green-500 via-yellow-400 to-green-500 text-white border-0 shadow-2xl rounded-3xl overflow-hidden transform hover:scale-105 transition-all duration-300">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-black mb-3">Daily Super Challenge! 🎯</h3>
                <p className="text-green-100 mb-6 text-lg font-medium">
                  Complete today&apos;s challenge and become a hero! 🦸‍♂️
                </p>
                <Button className="bg-white text-green-600 hover:bg-green-50 font-black text-lg px-8 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all">
                  Start Adventure! 🚀
                </Button>
              </div>
              <div className="hidden md:block text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6">
                  <p className="text-5xl font-black">+50</p>
                  <p className="text-yellow-100 font-bold">Bonus Points! ⭐</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

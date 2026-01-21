import { useState } from 'react';
import {
  TrendingUp, TrendingDown, CheckCircle2, AlertCircle, ChevronRight,
  Calendar, CreditCard, FileText, Users, Shield, Plus, ExternalLink,
  Award, Target, Zap, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { motion } from 'motion/react';

interface ScoreDashboardProps {
  onNavigate: (route: string, id?: string) => void;
}

export function ScoreDashboard({ onNavigate }: ScoreDashboardProps) {
  // Mock user score - in real app this would come from auth context
  const userScore = {
    overall: 720,
    paymentHistory: 750,
    rentalDuration: 680,
    incomeVerification: 740,
    references: 710,
    identityVerification: 800,
  };

  const scoreBreakdown = [
    {
      name: 'Payment History',
      score: userScore.paymentHistory,
      weight: 35,
      icon: CreditCard,
      color: '#0D7377',
      description: 'On-time rent and bill payments',
      status: 'good',
      tips: 'Keep making payments on time to maintain your score',
    },
    {
      name: 'Rental Duration',
      score: userScore.rentalDuration,
      weight: 25,
      icon: Calendar,
      color: '#F4A261',
      description: 'Length of rental history',
      status: 'fair',
      tips: 'Your score will improve as you build longer rental history',
    },
    {
      name: 'Income Verification',
      score: userScore.incomeVerification,
      weight: 20,
      icon: FileText,
      color: '#0D7377',
      description: 'Verified income sources',
      status: 'good',
      tips: 'Add more income sources for a better score',
    },
    {
      name: 'References & Reviews',
      score: userScore.references,
      weight: 15,
      icon: Users,
      color: '#F4A261',
      description: 'Landlord and neighbor feedback',
      status: 'fair',
      tips: 'Request more references from previous landlords',
    },
    {
      name: 'Identity Verification',
      score: userScore.identityVerification,
      weight: 5,
      icon: Shield,
      color: '#0D7377',
      description: 'Government ID verification',
      status: 'excellent',
      tips: 'Your identity is fully verified!',
    },
  ];

  const improvementActions = [
    {
      action: 'Link Bank Account',
      impact: '+20 points',
      status: 'pending',
      description: 'Connect your bank account to verify income',
      icon: CreditCard,
    },
    {
      action: 'Add Employment Letter',
      impact: '+15 points',
      status: 'pending',
      description: 'Upload employment verification letter',
      icon: FileText,
    },
    {
      action: 'Request Landlord Reference',
      impact: '+10 points',
      status: 'pending',
      description: 'Get a reference from your current landlord',
      icon: Users,
    },
    {
      action: 'Verify Phone Number',
      impact: '+5 points',
      status: 'completed',
      description: 'Phone number verified',
      icon: CheckCircle2,
    },
  ];

  const rentalHistory = [
    {
      address: '123 Main St, Montreal',
      duration: '2022 - 2024',
      status: 'Good Standing',
      rent: 1800,
      landlord: 'Jean Dupont',
    },
    {
      address: '456 Oak Ave, Montreal',
      duration: '2020 - 2022',
      status: 'Good Standing',
      rent: 1600,
      landlord: 'Marie Tremblay',
    },
    {
      address: '789 King St, Montreal',
      duration: '2018 - 2020',
      status: 'Good Standing',
      rent: 1400,
      landlord: 'Pierre Gagnon',
    },
  ];

  const getScoreLevel = (score: number) => {
    if (score >= 750) return { label: 'Excellent', color: 'text-green-600', bg: 'bg-green-50' };
    if (score >= 700) return { label: 'Good', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (score >= 650) return { label: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { label: 'Needs Improvement', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const scoreLevel = getScoreLevel(userScore.overall);

  const getStatusBadge = (status: string) => {
    if (status === 'excellent') return <Badge className="bg-green-500">Excellent</Badge>;
    if (status === 'good') return <Badge className="bg-blue-500">Good</Badge>;
    if (status === 'fair') return <Badge className="bg-yellow-500">Fair</Badge>;
    return <Badge variant="destructive">Needs Work</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Your O'Key Score</h1>
            <p className="text-lg text-gray-600">Your real estate credibility at a glance</p>
          </div>

          {/* Main Score Display */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center md:text-left"
                  >
                    <div className="inline-flex items-center justify-center w-48 h-48 rounded-full bg-gradient-to-br from-[#0D7377] to-[#14FFEC] mb-4">
                      <div className="w-44 h-44 rounded-full bg-white flex flex-col items-center justify-center">
                        <div className="text-6xl font-bold text-[#0D7377]">{userScore.overall}</div>
                        <div className="text-sm text-gray-600">out of 850</div>
                      </div>
                    </div>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${scoreLevel.bg}`}>
                      <Award className={`w-5 h-5 ${scoreLevel.color}`} />
                      <span className={`font-medium ${scoreLevel.color}`}>{scoreLevel.label}</span>
                    </div>
                  </motion.div>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">What does this mean?</h2>
                    <p className="text-gray-600">
                      With a score of {userScore.overall}, you're considered a <span className={`font-semibold ${scoreLevel.color}`}>{scoreLevel.label}</span> tenant.
                      This qualifies you for most premium properties on O'Key.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">Properties Available</div>
                      <div className="text-2xl font-bold text-[#0D7377]">85%</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">Acceptance Rate</div>
                      <div className="text-2xl font-bold text-[#F4A261]">High</div>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-[#0D7377] hover:bg-[#0a5a5d]"
                    onClick={() => onNavigate('search')}
                  >
                    Browse Qualifying Properties
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="breakdown" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="breakdown">Score Breakdown</TabsTrigger>
              <TabsTrigger value="improve">Improve Score</TabsTrigger>
              <TabsTrigger value="history">Rental History</TabsTrigger>
            </TabsList>

            {/* Score Breakdown */}
            <TabsContent value="breakdown" className="mt-6">
              <div className="space-y-4">
                {scoreBreakdown.map((item, index) => {
                  const Icon = item.icon;
                  const percentage = (item.score / 850) * 100;

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-12 h-12 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: `${item.color}20` }}
                              >
                                <Icon className="w-6 h-6" style={{ color: item.color }} />
                              </div>
                              <div>
                                <h3 className="font-bold">{item.name}</h3>
                                <p className="text-sm text-gray-600">{item.description}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold" style={{ color: item.color }}>
                                {item.score}
                              </div>
                              <div className="text-xs text-gray-500">{item.weight}% weight</div>
                            </div>
                          </div>

                          <Progress value={percentage} className="mb-3" />

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getStatusBadge(item.status)}
                            </div>
                            <p className="text-sm text-gray-600">{item.tips}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            {/* Improve Score */}
            <TabsContent value="improve" className="mt-6">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Quick Actions to Boost Your Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {improvementActions.map((action, index) => {
                      const Icon = action.icon;

                      return (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-4 rounded-lg border ${
                            action.status === 'completed'
                              ? 'bg-green-50 border-green-200'
                              : 'bg-white border-gray-200 hover:border-[#0D7377] cursor-pointer'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                action.status === 'completed' ? 'bg-green-100' : 'bg-gray-100'
                              }`}
                            >
                              <Icon
                                className={`w-6 h-6 ${
                                  action.status === 'completed' ? 'text-green-600' : 'text-gray-600'
                                }`}
                              />
                            </div>
                            <div>
                              <h3 className="font-medium">{action.action}</h3>
                              <p className="text-sm text-gray-600">{action.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge
                              variant={action.status === 'completed' ? 'secondary' : 'default'}
                              className={action.status === 'completed' ? '' : 'bg-green-500'}
                            >
                              {action.impact}
                            </Badge>
                            {action.status === 'completed' ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : (
                              <Button size="sm" variant="ghost">
                                <Plus className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Score Improvement Tips */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Target className="w-12 h-12 text-[#0D7377] mx-auto mb-3" />
                    <h3 className="font-bold mb-2">Set Goals</h3>
                    <p className="text-sm text-gray-600">
                      Target specific score ranges to unlock better properties
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Zap className="w-12 h-12 text-[#F4A261] mx-auto mb-3" />
                    <h3 className="font-bold mb-2">Quick Wins</h3>
                    <p className="text-sm text-gray-600">
                      Complete simple verifications for instant score boosts
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Clock className="w-12 h-12 text-[#E76F51] mx-auto mb-3" />
                    <h3 className="font-bold mb-2">Track Progress</h3>
                    <p className="text-sm text-gray-600">
                      Monitor your score changes over time
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Rental History */}
            <TabsContent value="history" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Rental History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {rentalHistory.map((rental, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-[#0D7377] rounded-lg flex items-center justify-center text-white font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-medium mb-1">{rental.address}</h3>
                            <p className="text-sm text-gray-600 mb-2">{rental.duration}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-gray-600">
                                Rent: <span className="font-medium">${rental.rent}/mo</span>
                              </span>
                              <span className="text-gray-600">
                                Landlord: <span className="font-medium">{rental.landlord}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-green-500">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          {rental.status}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Previous Rental
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* CTA */}
          <Card className="mt-8 bg-gradient-to-br from-[#0D7377] to-[#14FFEC] text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-2">Ready to Find Your Home?</h2>
              <p className="mb-6 text-white/90">
                Your score qualifies you for premium properties. Start browsing now!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-[#0D7377] hover:bg-gray-100"
                  onClick={() => onNavigate('search')}
                >
                  Browse Properties
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => onNavigate('marketplace')}
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

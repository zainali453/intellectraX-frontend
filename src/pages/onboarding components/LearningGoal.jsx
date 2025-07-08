import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LearningGoal = ({ onNext, onPrevious, currentStep, totalSteps }) => {
  const [learningGoals, setLearningGoals] = useState('');

  const handleNext = () => {
    if (learningGoals.trim()) {
      onNext({ learningGoals });
    }
  };

  const handlePrevious = () => {
    onPrevious();
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
            Learning Goals
          </CardTitle>
          <p className="text-gray-600 text-lg">
            Please tell us a bit about yourself and your learning skills
          </p>
          <div className="flex justify-center mt-4">
            <div className="flex space-x-2">
              {Array.from({ length: totalSteps }, (_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentStep - 1
                      ? 'bg-blue-600'
                      : index < currentStep - 1
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="learning-goals" className="text-sm font-medium text-gray-700">
              Describe your learning goals and skills
            </label>
            <Textarea
              id="learning-goals"
              placeholder="Tell us about your learning objectives, preferred learning styles, areas you want to improve, and any specific skills you're working on..."
              value={learningGoals}
              onChange={(e) => setLearningGoals(e.target.value)}
              className="min-h-[200px] resize-none text-base leading-relaxed"
              rows={8}
            />
            <p className="text-xs text-gray-500">
              Be as detailed as possible to help us personalize your learning experience
            </p>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              onClick={handlePrevious}
              variant="outline"
              className="px-8 py-2 text-base"
            >
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!learningGoals.trim()}
              className="px-8 py-2 text-base bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningGoal;

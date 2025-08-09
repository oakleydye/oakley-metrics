'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CreateOrganizationForm } from './create-organization-form'
import { CreateWebsiteForm } from './create-website-form'
import { CreateClientForm } from './create-client-form'
import { CheckCircle2, ArrowRight, ArrowLeft, RotateCcw } from 'lucide-react'

interface StepData {
  organization?: any
  website?: any
  client?: any
}

interface StepperStepProps {
  number: number
  title: string
  description: string
  isActive: boolean
  isCompleted: boolean
}

function StepperStep({ number, title, description, isActive, isCompleted }: StepperStepProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className={`
        flex items-center justify-center w-10 h-10 rounded-full border-2 
        ${isCompleted 
          ? 'bg-green-500 border-green-500 text-white' 
          : isActive 
            ? 'bg-blue-500 border-blue-500 text-white' 
            : 'bg-gray-100 border-gray-300 text-gray-500'
        }
      `}>
        {isCompleted ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : (
          <span className="text-sm font-semibold">{number}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
          {title}
        </p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  )
}

export function OnboardingStepper() {
  const [currentStep, setCurrentStep] = useState(1)
  const [stepData, setStepData] = useState<StepData>({})

  const steps = [
    {
      number: 1,
      title: 'Create Organization',
      description: 'Set up the client company details',
      component: CreateOrganizationForm
    },
    {
      number: 2,
      title: 'Add Website',
      description: 'Register website for tracking',
      component: CreateWebsiteForm
    },
    {
      number: 3,
      title: 'Create Client User',
      description: 'Add client user with access',
      component: CreateClientForm
    }
  ]

  const currentStepConfig = steps[currentStep - 1]
  const isLastStep = currentStep === steps.length
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100

  const handleStepComplete = (data: any, stepType: string) => {
    setStepData(prev => ({
      ...prev,
      [stepType]: data
    }))
    
    if (!isLastStep) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleReset = () => {
    setCurrentStep(1)
    setStepData({})
  }

  const canSkipToStep = (stepNumber: number) => {
    if (stepNumber === 1) return true
    if (stepNumber === 2) return !!stepData.organization
    if (stepNumber === 3) return !!stepData.organization && !!stepData.website
    return false
  }

  if (currentStep > steps.length) {
    // Completion screen
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">Onboarding Complete!</CardTitle>
          <CardDescription>
            Successfully set up the complete client environment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Organization:</span>
              <Badge variant="outline">{stepData.organization?.organization?.name}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Website:</span>
              <Badge variant="outline">{stepData.website?.website?.name}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Client:</span>
              <Badge variant="outline">{stepData.client?.client?.name}</Badge>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Next Steps:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Client will receive login credentials via email</li>
              <li>• Website tracking will begin automatically</li>
              <li>• Data will appear in analytics dashboard within 24 hours</li>
            </ul>
          </div>
          
          <div className="flex justify-center">
            <Button onClick={handleReset} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Start New Onboarding
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Client Onboarding Progress</CardTitle>
              <Badge variant="outline">
                Step {currentStep} of {steps.length}
              </Badge>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardHeader>
      </Card>

      {/* Steps Navigation */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {steps.map((step) => (
              <div key={step.number} className="flex items-center">
                <button
                  onClick={() => canSkipToStep(step.number) && setCurrentStep(step.number)}
                  disabled={!canSkipToStep(step.number)}
                  className="flex-1 text-left disabled:cursor-not-allowed"
                >
                  <StepperStep
                    number={step.number}
                    title={step.title}
                    description={step.description}
                    isActive={currentStep === step.number}
                    isCompleted={currentStep > step.number}
                  />
                </button>
                {step.number < steps.length && (
                  <div className="w-6 flex justify-center">
                    <ArrowRight className="w-4 h-4 text-gray-400 ml-2" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Step Form */}
      <Card>
        <CardHeader>
          <CardTitle>Step {currentStep}: {currentStepConfig.title}</CardTitle>
          <CardDescription>
            {currentStepConfig.description}
            {currentStep === 2 && stepData.organization && (
              <span className="block mt-1 text-sm">
                Adding website for: <strong>{stepData.organization.organization.name}</strong>
              </span>
            )}
            {currentStep === 3 && stepData.organization && (
              <span className="block mt-1 text-sm">
                Creating client for: <strong>{stepData.organization.organization.name}</strong>
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <CreateOrganizationForm 
              onSuccess={(data) => handleStepComplete(data, 'organization')}
            />
          )}
          {currentStep === 2 && (
            <CreateWebsiteForm 
              onSuccess={(data) => handleStepComplete(data, 'website')}
              preselectedOrganizationId={stepData.organization?.organization?.id}
            />
          )}
          {currentStep === 3 && (
            <CreateClientForm 
              onSuccess={(data) => {
                handleStepComplete(data, 'client')
                setCurrentStep(prev => prev + 1) // Go to completion screen
              }}
              preselectedOrganizationId={stepData.organization?.organization?.id}
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous Step
            </Button>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handleReset}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              {currentStep < steps.length && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  disabled={currentStep === 1 ? !stepData.organization : currentStep === 2 ? !stepData.website : false}
                >
                  Skip Step
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

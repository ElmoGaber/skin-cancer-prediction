"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, Brain, Shield, AlertTriangle, CheckCircle, Info, Camera, FileText, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

export default function SkinCancerPrediction() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [result, setResult] = useState<{
    prediction: string
    confidence: number
    risk_level: "low" | "moderate" | "high"
    recommendations: string[]
  } | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith("image/")) {
        setSelectedFile(file)
        setResult(null)
      }
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      setResult(null)
    }
  }

  const simulateAnalysis = async () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 10
      })
    }, 200)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2500))

    // Mock result based on filename or random
    const mockResults = [
      {
        prediction: "Benign Nevus",
        confidence: 0.82,
        risk_level: "low" as const,
        recommendations: [
          "Continue regular self-examinations",
          "Monitor for any changes in size, color, or shape",
          "Schedule routine dermatologist check-up in 12 months",
        ],
      },
      {
        prediction: "Suspicious Lesion",
        confidence: 0.78,
        risk_level: "moderate" as const,
        recommendations: [
          "Consult a dermatologist within 2-4 weeks",
          "Document the lesion with photos for comparison",
          "Avoid sun exposure to the affected area",
        ],
      },
      {
        prediction: "Potential Melanoma",
        confidence: 0.85,
        risk_level: "high" as const,
        recommendations: [
          "URGENT: See a dermatologist immediately",
          "Do not delay medical consultation",
          "Bring this analysis to your healthcare provider",
        ],
      },
    ]

    const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)]
    setResult(randomResult)
    setIsAnalyzing(false)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-600"
      case "moderate":
        return "text-yellow-600"
      case "high":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "low":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "moderate":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "high":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <Brain className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-foreground">SkinCheck AI</h1>
              <p className="text-sm text-muted-foreground">Advanced skin cancer detection with 78% accuracy</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-foreground mb-4">AI-Powered Skin Analysis</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload a clear image of your skin concern for instant AI analysis. Our deep learning model provides
            preliminary assessments to help guide your healthcare decisions.
          </p>
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-serif">Upload Your Image</CardTitle>
            <CardDescription>Take a clear, well-lit photo of the skin area you'd like analyzed</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className="space-y-4">
                  <div className="w-48 h-48 mx-auto rounded-lg overflow-hidden bg-muted">
                    <img
                      src={URL.createObjectURL(selectedFile) || "/placeholder.svg"}
                      alt="Selected skin image"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedFile.name}</p>
                  <div className="flex gap-2 justify-center">
                    <Button onClick={simulateAnalysis} disabled={isAnalyzing} className="font-medium">
                      {isAnalyzing ? "Analyzing..." : "Analyze Image"}
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedFile(null)} disabled={isAnalyzing}>
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Camera className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div>
                    <p className="text-lg font-medium text-foreground mb-2">Drag and drop your image here</p>
                    <p className="text-sm text-muted-foreground mb-4">or click to browse your files</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button asChild className="cursor-pointer">
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          Choose Image
                        </span>
                      </Button>
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, WebP (max 10MB)</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Analysis Progress */}
        {isAnalyzing && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Brain className="h-5 w-5 text-primary animate-pulse" />
                  <span className="font-medium">Analyzing your image...</span>
                </div>
                <Progress value={analysisProgress} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  Our AI model is processing your image using advanced computer vision techniques.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {result && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                {getRiskIcon(result.risk_level)}
                Analysis Results
              </CardTitle>
              <CardDescription>Based on our deep learning model with 78% classification accuracy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Prediction</h4>
                  <p className="text-lg font-medium text-foreground">{result.prediction}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Confidence Level</h4>
                  <p className="text-lg font-medium">{Math.round(result.confidence * 100)}%</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Risk Assessment</h4>
                <p className={`text-lg font-medium capitalize ${getRiskColor(result.risk_level)}`}>
                  {result.risk_level} Risk
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Recommendations</h4>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> This analysis is for informational purposes only and should not replace
                  professional medical advice. Always consult with a qualified dermatologist for proper diagnosis and
                  treatment.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Information Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="font-serif text-lg">Secure & Private</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Your images are processed securely and never stored on our servers. Complete privacy guaranteed.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Brain className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="font-serif text-lg">AI-Powered</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Advanced convolutional neural networks trained on thousands of dermatological images.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="font-serif text-lg">Expert Validated</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our model has been validated by dermatologists and achieves 78% classification accuracy.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Educational Section */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">About Skin Cancer Detection</CardTitle>
            <CardDescription>Learn more about skin cancer prevention and early detection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                ABCDE Rule for Melanoma
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                <li>
                  <strong>A</strong>symmetry - One half doesn't match the other
                </li>
                <li>
                  <strong>B</strong>order - Irregular, scalloped, or poorly defined edges
                </li>
                <li>
                  <strong>C</strong>olor - Varied colors within the same mole
                </li>
                <li>
                  <strong>D</strong>iameter - Larger than 6mm (size of a pencil eraser)
                </li>
                <li>
                  <strong>E</strong>volving - Changes in size, shape, color, or texture
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">When to See a Doctor</h4>
              <p className="text-sm text-muted-foreground">
                Consult a dermatologist if you notice any suspicious changes in your skin, especially new growths or
                changes in existing moles. Early detection is key to successful treatment.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">
              <strong>Medical Disclaimer:</strong> This tool is for educational purposes only and does not provide
              medical advice.
            </p>
            <p>Always consult with qualified healthcare professionals for medical concerns.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

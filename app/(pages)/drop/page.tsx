"use client"

import { useState, useCallback } from "react"
import { Upload, File } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FileInfo {
  name: string;
  size: string;
}

export default function DropPage() {
  const [isDragging, setIsDragging] = useState(false)
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null)

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    const pdfFiles = files.filter(file => file.type === 'application/pdf')
    
    if (pdfFiles.length > 0) {
      const file = pdfFiles[0]
      setFileInfo({
        name: file.name,
        size: formatFileSize(file.size)
      })
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setFileInfo({
        name: file.name,
        size: formatFileSize(file.size)
      })
    }
  }, [])

  return (
    <div className="py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Upload PDF</CardTitle>
            <CardDescription>Drop your PDF file here or click to select</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fileInfo && (
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <File className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{fileInfo.name}</p>
                  <p className="text-sm text-muted-foreground">{fileInfo.size}</p>
                </div>
              </div>
            )}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                relative
                border-2
                border-dashed
                rounded-lg
                p-12
                text-center
                transition-colors
                ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
                hover:border-primary
                hover:bg-primary/5
              `}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-12 w-12 text-muted-foreground" />
                <p className="text-lg font-medium">
                  Drag and drop your PDF here
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to select a file
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
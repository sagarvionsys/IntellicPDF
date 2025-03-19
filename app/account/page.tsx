"use client"

import { useState } from "react"
import { CreditCard, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const mockUser = {
  name: "John Doe",
  email: "john@example.com",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  plan: "Pro",
  nextBilling: "May 1, 2024",
  storage: {
    used: 5.2,
    total: 10,
  },
}

export default function AccountPage() {
  const [user] = useState(mockUser)

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your personal information and settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
              <CardDescription>Your current plan and billing information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <CreditCard className="h-6 w-6" />
                  <div>
                    <h4 className="font-medium">{user.plan} Plan</h4>
                    <p className="text-sm text-muted-foreground">Next billing on {user.nextBilling}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Storage Usage</p>
                  <div className="h-2 bg-secondary rounded-full">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${(user.storage.used / user.storage.total) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {user.storage.used}GB of {user.storage.total}GB used
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
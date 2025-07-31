"use client";

import { Progress } from "@/components/ui/progress";

import { useEffect, useState } from "react";
import {
  User,
  Bell,
  Shield,
  Palette,
  Database,
  HelpCircle,
  LogOut,
  Smartphone,
  Monitor,
  Watch,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EcosystemSync } from "@/components/ecosystem-sync";

const userProfile = {
  firstName: "",
  lastName: "",
  email: "",
  gender: "",
  height: "",
  weight: "",
  fitnessLevel: "",
  goal: "",
  activityLevel: "",
};

const notificationSettings = {
  workoutReminders: true,
  habitTracking: true,
  challengeUpdates: false,
  weeklyReports: true,
  socialUpdates: false,
  emailNotifications: true,
  pushNotifications: true,
  smsNotifications: false,
};

const privacySettings = {
  profileVisibility: "Friends",
  activitySharing: true,
  dataCollection: true,
  thirdPartySharing: false,
  locationTracking: true,
};

export function SettingsContent({ email }: { email: string }) {
  const [profile, setProfile] = useState(userProfile);
  const [notifications, setNotifications] = useState(notificationSettings);
  const [privacy, setPrivacy] = useState(privacySettings);
  // const [profile, setProfile] = useState()
  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch(`/api/user/profile?email=${email}`);
      const data = await res.json();
      if (res.ok) {
        setProfile(data);
        console.log("profile" + data);
      } else {
        console.error("Failed to fetch profile", data);
      }
    };
    fetchProfile();
  }, [email]);
const handleSubmit = async () => {
  try {
    const response = await fetch("/api/user", {
      method: "PATCH", // or "PUT"
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profile),
    });

    if (response.ok) {
      console.log("Profile updated successfully");
    } else {
      console.error("Failed to update profile");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

  return (
    <div className="w-full h-full space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          {/* <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger> */}
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="ecosystem">Ecosystem</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="dark-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and fitness details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="/placeholder.svg?height=80&width=80" />
                  <AvatarFallback className="bg-gradient-to-r from-red-500 to-blue-500 text-white text-xl">
                    AJ
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline">Change Photo</Button>
                  <p className="text-sm text-gray-500 mt-2">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div> */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">First Name</Label>
                  <Input
                    id="name"
                    className="dark-input"
                    value={profile.firstName}
                    onChange={(e) =>
                      setProfile({ ...profile, firstName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Last Name</Label>
                  <Input
                    id="name"
                    className="dark-input"
                    value={profile.lastName}
                    onChange={(e) =>
                      setProfile({ ...profile, lastName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    className="dark-input"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select
                    value={profile.gender}
                    onValueChange={(value) =>
                      setProfile({ ...profile, gender: value })
                    }
                  >
                    <SelectTrigger className="dark-input">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent className="dark-input">
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                      <SelectItem value="Prefer not to say">
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    className="dark-input"
                    value={profile.height}
                    onChange={(e) =>
                      setProfile({ ...profile, height: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    className="dark-input"
                    value={profile.weight}
                    onChange={(e) =>
                      setProfile({ ...profile, weight: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Fitness Level</Label>
                  <Select
                    value={profile.fitnessLevel}
                    onValueChange={(value) =>
                      setProfile({ ...profile, fitnessLevel: value })
                    }
                  >
                    <SelectTrigger className="dark-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark-input">
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Primary Goal</Label>
                  <Select
                    value={profile.goal}
                    onValueChange={(value) =>
                      setProfile({ ...profile, goal: value })
                    }
                  >
                    <SelectTrigger className="dark-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark-input">
                      <SelectItem value="Lose Weight">Lose Weight</SelectItem>
                      <SelectItem value="Build Muscle">Build Muscle</SelectItem>
                      <SelectItem value="Maintain">Maintain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Activity Level</Label>
                  <Select
                    value={profile.activityLevel}
                    onValueChange={(value) =>
                      setProfile({ ...profile, activityLevel: value })
                    }
                  >
                    <SelectTrigger className="dark-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark-input">
                      <SelectItem value="Sedentary">Sedentary</SelectItem>
                      <SelectItem value="Light">Light</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Intense">Intense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
  className="bg-gradient-to-r from-red-500 to-blue-500"
  onClick={handleSubmit}
  type="button"
>
  Save Changes
</Button>

            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="dark-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-white">
                      Workout Reminders
                    </h3>
                    <p className="text-sm text-slate-400">
                      Get notified about scheduled workouts
                    </p>
                  </div>
                  <Switch
                    checked={notifications.workoutReminders}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        workoutReminders: checked,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-white">Habit Tracking</h3>
                    <p className="text-sm text-slate-400">
                      Daily reminders for your habits
                    </p>
                  </div>
                  <Switch
                    checked={notifications.habitTracking}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        habitTracking: checked,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-white">
                      Challenge Updates
                    </h3>
                    <p className="text-sm text-slate-400">
                      Updates on your active challenges
                    </p>
                  </div>
                  <Switch
                    checked={notifications.challengeUpdates}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        challengeUpdates: checked,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-white">Weekly Reports</h3>
                    <p className="text-sm text-slate-400">
                      Summary of your weekly progress
                    </p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReports}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        weeklyReports: checked,
                      })
                    }
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-medium mb-4 text-white">
                  Delivery Methods
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white">
                        Email Notifications
                      </h4>
                      <p className="text-sm text-slate-400">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          emailNotifications: checked,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white">
                        Push Notifications
                      </h4>
                      <p className="text-sm text-slate-400">
                        Receive push notifications on your device
                      </p>
                    </div>
                    <Switch
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          pushNotifications: checked,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white">
                        SMS Notifications
                      </h4>
                      <p className="text-sm text-slate-400">
                        Receive notifications via text message
                      </p>
                    </div>
                    <Switch
                      checked={notifications.smsNotifications}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          smsNotifications: checked,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* <TabsContent value="privacy" className="space-y-6">
          <Card className="dark-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy & Security
              </CardTitle>
              <CardDescription>Control your privacy settings and data sharing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-white">Profile Visibility</h3>
                    <p className="text-sm text-slate-400">Who can see your profile information</p>
                  </div>
                  <Select
                    value={privacy.profileVisibility}
                    onValueChange={(value) => setPrivacy({ ...privacy, profileVisibility: value })}
                  >
                    <SelectTrigger className="w-32 dark-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark-input">
                      <SelectItem value="Public">Public</SelectItem>
                      <SelectItem value="Friends">Friends</SelectItem>
                      <SelectItem value="Private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-white">Activity Sharing</h3>
                    <p className="text-sm text-slate-400">Share your workouts and achievements</p>
                  </div>
                  <Switch
                    checked={privacy.activitySharing}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, activitySharing: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-white">Data Collection</h3>
                    <p className="text-sm text-slate-400">Allow collection of usage data for improvements</p>
                  </div>
                  <Switch
                    checked={privacy.dataCollection}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, dataCollection: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-white">Location Tracking</h3>
                    <p className="text-sm text-slate-400">Allow location tracking for workout routes</p>
                  </div>
                  <Switch
                    checked={privacy.locationTracking}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, locationTracking: checked })}
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-medium mb-4 text-white">Account Security</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Enable Two-Factor Authentication
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Download My Data
                  </Button>
                  <Button variant="destructive" className="w-full justify-start">
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}

        {/* <TabsContent value="appearance" className="space-y-6">
          <Card className="dark-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Appearance
              </CardTitle>
              <CardDescription>Customize the look and feel of your dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium text-white">Theme</Label>
                  <p className="text-sm text-slate-400 mb-3">Choose your preferred theme</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <div className="w-full h-20 bg-white border rounded mb-2"></div>
                      <p className="text-sm text-center text-white">Light</p>
                    </div>
                    <div className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <div className="w-full h-20 bg-gray-900 border rounded mb-2"></div>
                      <p className="text-sm text-center text-white">Dark</p>
                    </div>
                    <div className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <div className="w-full h-20 bg-gradient-to-br from-white to-gray-900 border rounded mb-2"></div>
                      <p className="text-sm text-center text-white">Auto</p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium text-white">Accent Color</Label>
                  <p className="text-sm text-slate-400 mb-3">Choose your accent color</p>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-blue-500 rounded-full cursor-pointer border-2 border-gray-300"></div>
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full cursor-pointer"></div>
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full cursor-pointer"></div>
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full cursor-pointer"></div>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium text-white">Dashboard Layout</Label>
                  <p className="text-sm text-slate-400 mb-3">Choose your preferred layout</p>
                  <Select defaultValue="default">
                    <SelectTrigger className="dark-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark-input">
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="spacious">Spacious</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}

        <TabsContent value="data" className="space-y-6">
          <Card className="dark-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Data Management
              </CardTitle>
              <CardDescription>
                Manage your data and integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2 text-white">
                    Connected Apps
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-red-600 text-sm">❤️</span>
                        </div>
                        <div>
                          <p className="font-medium text-white">Apple Health</p>
                          <p className="text-sm text-slate-400">
                            Syncing health data
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Disconnect
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm">📱</span>
                        </div>
                        <div>
                          <p className="font-medium text-white">Google Fit</p>
                          <p className="text-sm text-slate-400">
                            Activity tracking
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Connect
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2 text-white">Data Export</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      Export Workout Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Export Habit Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Export All Data
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2 text-white">Storage Usage</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-white">
                      <span>Used Storage</span>
                      <span>2.4 GB of 5 GB</span>
                    </div>
                    <Progress value={48} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ecosystem" className="space-y-6">
          <div className="space-y-6">
            <EcosystemSync />

            <Card className="dark-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  Cross-Platform Features
                </CardTitle>
                <CardDescription>
                  Features optimized for different devices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <Monitor className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                    <h3 className="font-medium text-white">Web Dashboard</h3>
                    <p className="text-sm text-slate-400">
                      Full analytics and management
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <Smartphone className="w-8 h-8 mx-auto mb-2 text-green-500" />
                    <h3 className="font-medium text-white">Mobile App</h3>
                    <p className="text-sm text-slate-400">
                      On-the-go tracking and workouts
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <Watch className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                    <h3 className="font-medium text-white">Wearables</h3>
                    <p className="text-sm text-slate-400">
                      Real-time health monitoring
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="support" className="space-y-6">
          <Card className="dark-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                Help & Support
              </CardTitle>
              <CardDescription>
                Get help and support for your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Help Center
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Contact Support
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Report a Bug
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Feature Request
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Community Forum
                </Button>
              </div> */}

              <div className="border-t pt-6">
                <h3 className="font-medium mb-4 text-white">About</h3>
                <div className="space-y-2 text-sm text-slate-400">
                  <p>Trika.ai Fitness Dashboard v2.1.0</p>
                  <p>© 2024 Trika.ai. All rights reserved.</p>
                  <div className="flex gap-4 mt-4">
                    <Button variant="link" className="p-0 h-auto">
                      Privacy Policy
                    </Button>
                    <Button variant="link" className="p-0 h-auto">
                      Terms of Service
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <Button variant="destructive" className="w-full">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

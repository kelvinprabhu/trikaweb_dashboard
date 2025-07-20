"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Watch, Wifi, Bluetooth, BluetoothOff, Activity, Heart, Zap, RefreshCw } from "lucide-react"

interface Device {
  id: string
  name: string
  type: "phone" | "watch" | "tracker" | "scale"
  connected: boolean
  battery?: number
  lastSync?: Date
  data?: {
    steps?: number
    heartRate?: number
    calories?: number
    sleep?: number
  }
}

const mockDevices: Device[] = [
  {
    id: "iphone",
    name: "iPhone 15 Pro",
    type: "phone",
    connected: true,
    battery: 85,
    lastSync: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    data: {
      steps: 8432,
      calories: 2150,
    },
  },
  {
    id: "apple-watch",
    name: "Apple Watch Series 9",
    type: "watch",
    connected: true,
    battery: 67,
    lastSync: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    data: {
      steps: 8432,
      heartRate: 72,
      calories: 2150,
    },
  },
  {
    id: "fitbit",
    name: "Fitbit Charge 6",
    type: "tracker",
    connected: false,
    battery: 45,
    lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    data: {
      steps: 6234,
      sleep: 7.5,
    },
  },
]

export function EcosystemSync() {
  const [devices, setDevices] = useState<Device[]>(mockDevices)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate refresh delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Update last sync times for connected devices
    setDevices((prev) =>
      prev.map((device) => ({
        ...device,
        lastSync: device.connected ? new Date() : device.lastSync,
      })),
    )

    setIsRefreshing(false)
  }

  const toggleConnection = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((device) => (device.id === deviceId ? { ...device, connected: !device.connected } : device)),
    )
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "phone":
        return Smartphone
      case "watch":
        return Watch
      case "tracker":
        return Activity
      case "scale":
        return Activity
      default:
        return Activity
    }
  }

  const getBatteryColor = (battery?: number) => {
    if (!battery) return "text-slate-400"
    if (battery > 50) return "text-green-400"
    if (battery > 20) return "text-yellow-400"
    return "text-red-400"
  }

  const formatLastSync = (date?: Date) => {
    if (!date) return "Never"
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <Card className="dark-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Wifi className="w-4 h-4 text-white" />
              </div>
              Device Ecosystem
            </CardTitle>
            <CardDescription className="text-slate-400">Sync data across all your fitness devices</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="dark-button bg-transparent"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Sync All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {devices.map((device) => {
          const DeviceIcon = getDeviceIcon(device.type)

          return (
            <div key={device.id} className="p-4 bg-slate-800 rounded-lg border border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      device.connected ? "bg-green-500/20" : "bg-slate-700"
                    }`}
                  >
                    <DeviceIcon className={`w-5 h-5 ${device.connected ? "text-green-400" : "text-slate-400"}`} />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{device.name}</h3>
                    <p className="text-sm text-slate-400">Last sync: {formatLastSync(device.lastSync)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {device.battery && (
                    <div className="flex items-center gap-1">
                      <Zap className={`w-3 h-3 ${getBatteryColor(device.battery)}`} />
                      <span className={`text-xs ${getBatteryColor(device.battery)}`}>{device.battery}%</span>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleConnection(device.id)}
                    className={device.connected ? "text-green-400" : "text-slate-400"}
                  >
                    {device.connected ? <Bluetooth className="w-4 h-4" /> : <BluetoothOff className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge
                  className={
                    device.connected
                      ? "bg-green-500/20 text-green-300 border-green-500/30"
                      : "bg-slate-600/20 text-slate-400 border-slate-600/30"
                  }
                >
                  {device.connected ? "Connected" : "Disconnected"}
                </Badge>

                {device.data && (
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    {device.data.steps && (
                      <span className="flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        {device.data.steps.toLocaleString()}
                      </span>
                    )}
                    {device.data.heartRate && (
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-red-400" />
                        {device.data.heartRate} bpm
                      </span>
                    )}
                    {device.data.calories && (
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-orange-400" />
                        {device.data.calories} cal
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}

        <div className="pt-4 border-t border-slate-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-white">3</p>
              <p className="text-xs text-slate-400">Connected Devices</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">98%</p>
              <p className="text-xs text-slate-400">Sync Success Rate</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-400">2m</p>
              <p className="text-xs text-slate-400">Last Sync</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-400">24/7</p>
              <p className="text-xs text-slate-400">Auto Sync</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

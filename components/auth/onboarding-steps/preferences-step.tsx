"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PreferencesStepProps {
  data: {
    notifications: boolean
    dataSharing: boolean
    newsletter: boolean
    reminderTime: string
  }
  onUpdate: (data: any) => void
}

export function PreferencesStep({ data, onUpdate }: PreferencesStepProps) {
  const handleChange = (field: string, value: boolean | string) => {
    onUpdate({ [field]: value })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <Label className="font-medium">Push Notifications</Label>
            <p className="text-sm text-gray-600">Get reminders for workouts and habits</p>
          </div>
          <Switch checked={data.notifications} onCheckedChange={(checked) => handleChange("notifications", checked)} />
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <Label className="font-medium">Data Sharing</Label>
            <p className="text-sm text-gray-600">Help improve our AI with anonymous usage data</p>
          </div>
          <Switch checked={data.dataSharing} onCheckedChange={(checked) => handleChange("dataSharing", checked)} />
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <Label className="font-medium">Newsletter</Label>
            <p className="text-sm text-gray-600">Receive fitness tips and product updates</p>
          </div>
          <Switch checked={data.newsletter} onCheckedChange={(checked) => handleChange("newsletter", checked)} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Preferred Reminder Time</Label>
        <Select value={data.reminderTime} onValueChange={(value) => handleChange("reminderTime", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="06:00">6:00 AM</SelectItem>
            <SelectItem value="07:00">7:00 AM</SelectItem>
            <SelectItem value="08:00">8:00 AM</SelectItem>
            <SelectItem value="09:00">9:00 AM</SelectItem>
            <SelectItem value="10:00">10:00 AM</SelectItem>
            <SelectItem value="18:00">6:00 PM</SelectItem>
            <SelectItem value="19:00">7:00 PM</SelectItem>
            <SelectItem value="20:00">8:00 PM</SelectItem>
            <SelectItem value="21:00">9:00 PM</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Privacy & Security</h3>
        <p className="text-sm text-blue-800">
          Your data is encrypted and secure. You can change these preferences anytime in your settings. We never share
          your personal information with third parties without your consent.
        </p>
      </div>
    </div>
  )
}

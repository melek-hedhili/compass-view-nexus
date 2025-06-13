
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const activities = [
  {
    id: 1,
    user: "Alice Johnson",
    avatar: "/placeholder.svg",
    action: "completed",
    target: "Project Alpha",
    time: "2 minutes ago",
    type: "success"
  },
  {
    id: 2,
    user: "Bob Smith",
    avatar: "/placeholder.svg",
    action: "updated",
    target: "User Profile",
    time: "5 minutes ago",
    type: "info"
  },
  {
    id: 3,
    user: "Carol Wilson",
    avatar: "/placeholder.svg",
    action: "deleted",
    target: "Old Reports",
    time: "10 minutes ago",
    type: "destructive"
  },
  {
    id: 4,
    user: "David Brown",
    avatar: "/placeholder.svg",
    action: "created",
    target: "New Campaign",
    time: "15 minutes ago",
    type: "success"
  },
  {
    id: 5,
    user: "Emma Davis",
    avatar: "/placeholder.svg",
    action: "reviewed",
    target: "Code Changes",
    time: "20 minutes ago",
    type: "secondary"
  }
]

const badgeVariants = {
  success: "default",
  info: "secondary",
  destructive: "destructive",
  secondary: "outline"
} as const

export function RecentActivity() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <Avatar className="h-9 w-9">
                <AvatarImage src={activity.avatar} alt={activity.user} />
                <AvatarFallback>
                  {activity.user.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user}</span>{" "}
                  <span className="text-muted-foreground">{activity.action}</span>{" "}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
              <Badge variant={badgeVariants[activity.type as keyof typeof badgeVariants]}>
                {activity.action}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


import { useState } from "react";
import { User, Mail, Phone, MapPin, CreditCard, Dumbbell, Edit2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/components/AppLayout";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock data - replace with real data when connected to backend
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 8900",
    location: "New York, USA",
    avatar: `https://source.boringavatars.com/beam/120/john-doe?colors=1e40af,3b82f6,10b981,0f172a,64748b`,
    gym: {
      name: "FitZone Elite",
      subscription: {
        type: "Premium",
        amount: "$49.99",
        period: "monthly",
        startDate: "2024-01-01",
        endDate: "2024-12-31"
      }
    }
  });

  const handleProfileUpdate = (newProfile: typeof profile) => {
    setProfile(newProfile);
    setIsEditing(false);
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Basic Information</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        defaultValue={profile.name}
                        onChange={(e) => {
                          const newProfile = { ...profile, name: e.target.value };
                          handleProfileUpdate(newProfile);
                        }}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="avatar">Avatar URL</Label>
                      <Input
                        id="avatar"
                        defaultValue={profile.avatar}
                        onChange={(e) => {
                          const newProfile = { ...profile, avatar: e.target.value };
                          handleProfileUpdate(newProfile);
                        }}
                      />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback>{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold">{profile.name}</h2>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <span>{profile.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span>{profile.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>{profile.location}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Gym Membership</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Dumbbell className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{profile.gym.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div className="space-y-1">
                      <p className="font-medium">{profile.gym.subscription.type} Plan</p>
                      <p className="text-sm text-muted-foreground">
                        {profile.gym.subscription.amount} / {profile.gym.subscription.period}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Subscription Period</p>
                  <p>Start: {new Date(profile.gym.subscription.startDate).toLocaleDateString()}</p>
                  <p>End: {new Date(profile.gym.subscription.endDate).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;

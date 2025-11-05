"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDays,  UserPen, Trophy, Ticket, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from "next/image";

const menuItems = [
  { icon: CalendarDays, title: 'Events', active: true },
  { icon: Trophy, title: 'Rewards' },
  { icon: Ticket, title: 'Raffle Draws' },
];

const sectionItems = [
  { icon: LogOut, title: 'Logout' },
  { icon: UserPen, title: 'Edit Profile' },
];
interface UserData {
  name: string;
  email: string;
  avatar?: string;
}

export default function Sidebar() {
  const [userData, setUserData] = useState<UserData>({
    name: "Loading...",
    email: "Loading...",
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          setUserData({
            name: "Guest User",
            email: "Not logged in",
          });
          setIsLoading(false);
          router.push("/login");
          return;
        }

        // Fetch user data from API
        const response = await fetch("https://api.blocstage.com/users/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.ok) {
          const user = await response.json();
          setUserData({
            name: user.name || user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || "User",
            email: user.email || "No email",
            avatar: user.avatar || user.profile_picture || user.profile_picture_url,
          });
        } else {
          // Fallback to stored user data or default
          const storedUserData = localStorage.getItem("userData");
          if (storedUserData) {
            const user = JSON.parse(storedUserData);
            setUserData({
              name: user.name || user.full_name || user.username || "User",
              email: user.email || "No email",
              avatar: user.avatar || user.profile_picture,
            });
          } else {
            setUserData({
              name: "User",
              email: "No email available",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Fallback to stored user data
        const storedUserData = localStorage.getItem("userData");
        if (storedUserData) {
          const user = JSON.parse(storedUserData);
          setUserData({
            name: user.name || user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || "User",
            email: user.email || "No email",
            avatar: user.avatar || user.profile_picture || user.profile_picture_url,
          });
        } else {
          setUserData({
            name: "User",
            email: "No email available",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push("/login");
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col justify-between z-50">
      {/* Top Section */}
      <div className="px-6 py-8 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-12">
          <a href="/" className="cursor-pointer">
            <Image
              className="justify-center items-center"
              src="/images/sidebarlogo.png"
              alt="blocStage"
              width={120}
              height={32}
            />
          </a>
        </div>

        {/* Menu Items */}
        <nav className="space-y-1 border-b border-gray-200 pb-4 mb-6">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                onClick={item.title === 'Events' ? () => router.push('/viewevent') : undefined}   

                className={`flex items-center justify-between px-3 py-4 rounded-lg cursor-pointer transition-colors ${
                  item.active
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {IconComponent && <IconComponent className="w-5 h-5" />}
                  <span className="text-sm font-medium">{item.title}</span>
                </div>
              </div>
            );
          })}
        </nav>

        {/* More Section */}
        <div className="mt-80">
          <span className="text-xs font-medium text-[#98A2B3] tracking-wider block mb-4">
            More
          </span>
          <nav className="space-y-1 mb-8">
            {sectionItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  onClick={item.title === 'Logout' ? handleLogout : item.title === 'Edit Profile' ? () => router.push('/edit-profile') : undefined}   
                  className="flex items-center justify-between px-3 py-4 rounded-lg cursor-pointer font-light text-[#282828] hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {IconComponent && <IconComponent className="w-5 h-5 text-[#282828]" />}
                    <span className="text-sm font-medium">{item.title}</span>
                  </div>
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom User Profile */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex flex-row items-center gap-3 p-2 rounded-lg cursor-pointer">
          <Avatar className="w-10 h-10">
            <AvatarImage src={userData.avatar || "./images/Avatars.jpg"} />
            <AvatarFallback>
              {isLoading ? "..." : getInitials(userData.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {isLoading ? "Loading..." : userData.name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {isLoading ? "Loading..." : userData.email}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

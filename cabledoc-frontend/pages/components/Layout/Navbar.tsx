import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Menu } from "@headlessui/react";
import { NavbarConfig } from "../../types/navbar";
import { getHeight } from "./getClassNames";

import { useUserStore } from "../../../app/api/user";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  IconBellPlus,
  IconBellRinging,
  IconLogout,
  IconSettings,
} from "@tabler/icons-react";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { notifications } from "@/pages/layout/header/data";
import { BellIcon, CheckIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import router, { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar({
  onToggleSidebar,
  isSidebarOpen,
  darkTheme,
  toggleTheme,
  navProperties,
}: {
  onToggleSidebar: any;
  isSidebarOpen: boolean;
  darkTheme: boolean;
  toggleTheme: any;
  navProperties: NavbarConfig;
}) {
  const [searchText, setSearchText] = React.useState("");
  const { user } = useUserStore();

  const logout = useUserStore((state) => state.logout); // Die logout-Funktion aus dem UserStore abrufen
  const router = useRouter();
  const handleLogout = () => {
    logout(); // Logout-Funktion aufrufen
    router.push("/login");
  };
  const notifications = [
    {
      title: "Your call has been confirmed.",
      description: "1 hour ago",
    },
    {
      title: "You have a new message!",
      description: "1 hour ago",
    },
    {
      title: "Your subscription is expiring soon!",
      description: "2 hours ago",
    },
  ];
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };
  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Do something with the search text (e.g., perform a search)
    console.log("Searching for:", searchText);
  };

  /**
   * MM
   * tailwind extracts only class names as complete unbroken strings so this should be done in some variants
   * see https://tailwindcss.com/docs/content-configuration#dynamic-class-names
   */
  var name = "";
  // Teile den Namen in Vorname und Nachname
  if (user?.name != null) {
    name = user?.name;
    const [vorname, nachname] = name.split(" ");

    // Nimm den ersten Buchstaben von Vorname und Nachname
    const vornameInitial = vorname.charAt(0).toUpperCase();
    const nachnameInitial = nachname.charAt(0).toUpperCase();

    // Kombiniere die Initialen
    name = vornameInitial + nachnameInitial;
  }

  return (
    <>
      <nav
        className={`
    fixed top-0 right-0 md:w-3/4 sm:w-full lg:w-3/4 w-full xl:w-6/7 2xl:w-6/7
    ${getHeight(
      Number(navProperties.navbar.height),
      "h"
    )} flex items-center justify-between px-4 rounded-l-full
  `}
        id="navbar"
      >
        {/* Search section */}
        <div className="flex items-center justify-normal">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>{name}</AvatarFallback>
          </Avatar>
          <div className="mx-5">{user?.name}</div>
        </div>
        <div className="flex items-center hidden sm:block">
          <div className="relative">
            <form className="" onSubmit={handleSearchSubmit}>
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute hidden md:block left-2 top-1/2 transform -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchText}
                onChange={handleSearchChange}
                className="w-32 md:w-auto bg-gray-100 border border-gray-400 rounded-md py-1 px-3 md:px-5 lg:px-8 focus:outline-none focus:border-emerald-500 text-gray-700"
              />
              <button
                type="submit"
                className="ml-2 bg-emerald-500 hover:bg-emerald-600 text-white px-2 py-1 rounded-md focus:outline-none"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex items-center">
          <Popover>
            <PopoverTrigger>
              <Button variant="ghost">
                <IconBellRinging /> Notifications
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[416px]">
              <Card className={cn("w-[380px]")}>
                <CardHeader>
                  <CardDescription>You have 3 unread messages.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className=" flex items-center space-x-4 rounded-md border p-4">
                    <IconBellPlus />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Push Notifications
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Send notifications to device.
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div>
                    {notifications.map((notification, index) => (
                      <div
                        key={index}
                        className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                      >
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {notification.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {notification.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <CheckIcon className="mr-2 h-4 w-4" /> Mark all as read
                  </Button>
                </CardFooter>
              </Card>
            </PopoverContent>
          </Popover>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost">
                <IconSettings /> Settings
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Edit profile</SheetTitle>
                <SheetDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name" value="TelemaxX" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Username
                  </Label>
                  <Input
                    id="username"
                    value="@telemaxx"
                    className="col-span-3"
                  />
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="submit">Save changes</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost">
                <IconLogout /> Log Out
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sind Sie sich sicher?</AlertDialogTitle>
                <AlertDialogDescription>
                  Speichern Sie potentiell wichtige Änderungen vor dem
                  Ausloggen. Ungespeicherte Daten könnten verloren gehen.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout}>
                  Weiter
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Dark Theme Toggler */}
          <Menu as="div" className="ml-6">
            <Menu.Button className="focus:outline-none" onClick={toggleTheme}>
              {darkTheme ? (
                <FontAwesomeIcon icon={faSun} className="h-6 w-6" />
              ) : (
                <FontAwesomeIcon icon={faMoon} className="h-6 w-6" />
              )}
            </Menu.Button>
          </Menu>
        </div>
      </nav>
    </>
  );
}

"use client";

import { Switch } from "@heroui/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <Switch
      aria-label="Theme switch"
      isSelected={isDark}
      onChange={() => setTheme(isDark ? "light" : "dark")}
    >
      {({ isSelected }) => (
        <Switch.Content>
          <Switch.Control
            className={`h-7.75 w-12.75 ${
              isSelected
                ? "bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.5)]"
                : "bg-blue-500"
            }`}
          >
            <Switch.Thumb
              className={`size-6.75 bg-white shadow-sm ${
                isSelected ? "ms-5.5 shadow-lg" : ""
              }`}
            >
              <Switch.Icon>
                {isSelected ? (
                  <Moon className="size-4 text-cyan-600" />
                ) : (
                  <Sun className="size-4 text-blue-600" />
                )}
              </Switch.Icon>
            </Switch.Thumb>
          </Switch.Control>
        </Switch.Content>
      )}
    </Switch>
  );
}

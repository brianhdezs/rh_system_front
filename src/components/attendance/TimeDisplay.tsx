import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export default function TimeDisplay() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center space-x-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-4 rounded-xl">
      <Clock size={32} />
      <div>
        <div className="text-3xl font-bold">
          {currentTime.toLocaleTimeString("es-MX", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </div>
        <div className="text-sm opacity-90">
          {currentTime.toLocaleDateString("es-MX", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
    </div>
  );
}

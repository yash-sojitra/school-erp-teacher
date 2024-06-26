import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import { useCallback } from "react";
import { date } from "zod";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


function Calendar({ className, classNames, showOutsideDays = true, ...props }) {
  const [holidays, setHolidays] = useState([]);

  const fetchHolidays = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://erp-system-backend.onrender.com/api/v1/holiday/fetch`
      );
      console.log(response.data);

      setHolidays(() => {
        const arr = [];

        Object.keys(response.data).forEach((key) => {
          response.data[key].forEach((holiday) => {
            var parts = holiday.date.split("/");

            var day = parseInt(parts[0], 10);
            var month = parseInt(parts[1], 10) - 1;
            var year = parseInt(parts[2], 10);

            arr.push(new Date(year, month, day));
          });
        });

        return arr;
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchHolidays();
  }, []);

  return (
    <DayPicker
      modifiers={{ holiday: holidays }}
      modifiersClassNames={{ holiday: "text-red-600" }}
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 hover:text-primary",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary-foreground text-primary hover:bg-primary hover:text-primary focus:bg-primary-foreground focus:text-primary",
        day_today: "text-accent underline",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
        // DayContent: ({ date }) => {
        //   if (holidays.includes(date)) {
        //     return (
        //       <TooltipProvider>
        //         <Tooltip>
        //           <TooltipTrigger>{date.getDate()}</TooltipTrigger>
        //           <TooltipContent>
        //             <p>Add to library</p>
        //           </TooltipContent>
        //         </Tooltip>
        //       </TooltipProvider>
        //     );
        //   } else {
        //     return date.getDate()
        //   }
        // },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };

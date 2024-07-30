import React, { useState } from "react";

import { Calendar } from 'primereact/calendar';


export const Calender = () => {
  const [date, setDate] = useState(null);

    return (
        <div className="card flex justify-content-center  pe-2">
            <Calendar value={date} onChange={(e) => setDate(e.value)}  inline className="p-1" />
        </div>

    )
}

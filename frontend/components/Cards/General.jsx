"use client";
import { ResponsiveLine } from "@nivo/line";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect, memo } from "react";


function numberWithSpaces(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
}
const CustomTooltip = ({ point }) => (
  <div
    style={{
      background: 'white',
      padding: '5px 10px',
      border: '1px solid #ccc',
      color: 'black',
      whiteSpace: 'nowrap'
    }}
  >
    <div>Date: <strong>{point.data.x}</strong></div>
    <div>Total: <strong>{numberWithSpaces(point.data.yFormatted)} NTN</strong></div>
  </div>
);
const MyResponsiveLine = ({ data }) => (
  <ResponsiveLine
    theme={{
      tooltip: {
        container: {
          color: 'black',
          whiteSpace: 'nowrap',
        },
      },
    }}
    data={data}
    xScale={{ type: "point" }}
    yScale={{
      type: "linear",
      min: "auto",
      max: "auto",
      stacked: true,
      reverse: false,
    }}
    yFormat=" >-.2f"
    curve="linear"
    axisTop={null}
    axisRight={null}
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'date',
      legendOffset: 36,
      legendPosition: 'middle',
      truncateTickAt: 0,
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "ntn",
      legendOffset: -40,
      legendPosition: "middle",
      truncateTickAt: 0,
    }}
    enableGridX={false}
    enableGridY={false}
    lineWidth={3}
    enablePoints={true}
    pointSize={5}
    pointLabel="data.x"
    areaBlendMode="darken"
    crosshairType="left"
    useMesh={true}
    legends={[]}
    tooltip={CustomTooltip}

  />
);
function formatDateInUserTimezone(utcDate) {
  // Create a Date object from the UTC date string (assuming format YYYY-MM-DDTHH:mm:ssZ)
  var utcDateObj = new Date(utcDate);

  // Get the user's timezone offset in minutes
  var userOffset = utcDateObj.getTimezoneOffset();
  // Create a new Date object with the UTC date adjusted for the user's timezone offset
  var userLocalDateObj = new Date(utcDateObj.getTime() - (userOffset * 60 * 1000));

  // Extract and format the date components in the desired format
  var month = userLocalDateObj.toLocaleDateString("en-US", { month: "long" });
  var date = userLocalDateObj.getDate();
  var suffix = getOrdinalSuffix(date);
  var hours = userLocalDateObj.getHours() % 12 || 12;
  hours = hours.toString().padStart(2, "0");
  var minutes = userLocalDateObj.getMinutes().toString().padStart(2, "0");

  var formattedDate = month + " " + date + suffix + " " + userLocalDateObj.getFullYear();
  //  + " at " + hours + ":" + minutes;
  return formattedDate;
}

// Function to get ordinal suffix (st, nd, rd, th) for a date
function getOrdinalSuffix(date) {
  var suffixes = ["th", "st", "nd", "rd"];
  var v = date % 100;
  return (v > 10 && v < 20) ? "th" : suffixes[(date % 10) < 4 ? (date % 10) : 0];
}

import  LayoutLoader  from "@/components/layout-loader";
const General = memo(({ chartData }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    setData(chartData ? [
      {
        id: "history",
        data: chartData.length > 0 ? chartData.map((value) => ({
          x: formatDateInUserTimezone(value.time.slice(0, 10)),
          y: parseFloat(value.value),
        })) : [],
      },
    ]: [])
    },
  []);

  return (
    <Card className="bg-transparent">
      <CardContent className="absolute h-[140px] w-[300px] mt-5 ">
        <MyResponsiveLine data={data} />
      </CardContent>
    </Card>
  );
})

export default General;
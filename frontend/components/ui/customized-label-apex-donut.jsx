"use client";
import { useThemeStore } from "@/store";
import { useTheme } from "next-themes";
import { themes } from "@/config/thems";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import dynamic from "next/dynamic";
import { color } from "framer-motion";
import { marker } from "leaflet";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
function numberWithSpaces(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
}

const CustomizedLabelDonut = ({ height = 300, data }) => {
  const { theme: config, setTheme: setConfig } = useThemeStore();
  const { theme: mode } = useTheme();
  const theme = themes.find((theme) => theme.name === config);
  const series = data.map((v) => parseFloat(v.value));
  const COLORS = [
    "#06b6d4",
    " #c0f6f9", //  #c2d5c7
    `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].primary})`,
    `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].blue})`,
    `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].success})`,
    `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].secondary})`,
  ];
  const options = {
    chart: {
      type: "donut",
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              color: "gray",
              forecolor: "white",
              formatter: () =>
                numberWithSpaces(
                  parseFloat(series.reduce((a, b) => parseFloat(a) + parseFloat(b), 0).toFixed(2))
                ) + " NTN",
              },
              value: {
                offsetY: -4, // -8 worked for me
                color: "white",
                fontSize: "12px",
                formatter: (v) =>
                  numberWithSpaces(
                    parseFloat(v).toFixed(2)
                  ) + " NTN",
            },
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100],
      },
    },
    labels: ["Staked", "The rest"],
    colors: [COLORS[0], COLORS[1]],
    stroke: {
      show: false,
      colors: "white",
      width: 0,
    },
    legend: {
      show: true,
      position: "bottom",
      fontSize: "12px",
      fontWeight: 400,

      labels: {
        colors: ["rgb(148, 163, 184)", "rgb(148, 163, 184)"],
        // useSeriesColors: true
      },
    },
    tooltip: {
      theme: "light",
      enabled: false,
      y: {
        formatter: (v) => numberWithSpaces(parseFloat(v).toFixed(2)) + " NTN",
      },
    },
  };

  return (
    <ResponsiveContainer width={"100%"} height={height + 22}>
      <ApexChart
        type="donut"
        options={options}
        series={series}
        className="p-0 m-0"
      />
    </ResponsiveContainer>
  );
};

export default CustomizedLabelDonut;

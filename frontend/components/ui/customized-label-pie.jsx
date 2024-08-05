"use client";
import { useThemeStore } from "@/store";
import { useTheme } from "next-themes";
import { themes } from "@/config/thems";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

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

const CustomizedLabelPie = ({ height = 300, data }) => {
  const { theme: config, setTheme: setConfig } = useThemeStore();
  const { theme: mode } = useTheme();
  const theme = themes.find((theme) => theme.name === config);
  const COLORS = [
    "#ead51cce",
    "#93079fd7",
    `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].primary})`,
    `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].blue})`,
    `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].success})`,
    `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].secondary})`,
  ];
  return (
    <div className="">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart height={height}>
          <Pie
            isAnimationActive={true}
            animationDuration={2500}
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={130}
            fill={`hsl(${
              theme?.cssVars[mode === "dark" ? "dark" : "light"].info
            })`}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="flex justify-center mt-1">
      <div className='mt-1.5 mr-1 h-2 w-2 rounded-full'style={{ backgroundColor: COLORS[0] }}></div>
        <span className="mr-4" style={{ color: COLORS[0]}}>Self Bonded</span>
      <div
        className='ml-4 mt-1.5 mr-1 h-2 w-2 rounded-full' style={{ backgroundColor: COLORS[1]}}></div>
        <span style={{ color: COLORS[1]}}>Delegated</span>
      </div>
    </div>
  );
};

export default CustomizedLabelPie;
